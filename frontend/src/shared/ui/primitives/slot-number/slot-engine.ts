import { ReelMotion, SLOT_TAPE, digitAt, positionFromOffset, tapeOffset } from "./slot-motion";
import {
  SLOT_DEFAULT_DIGITS,
  SLOT_FINALE,
  SLOT_MAX_FRAME_STEP,
  SLOT_STORAGE_KEY,
  SLOT_WAVE_STEP,
} from "./slot-number.config";
import { prerenderSpeed } from "./slot-prerender";

type Reel = {
  motion: ReelMotion;
  element: HTMLDivElement;
  tape: HTMLDivElement;
  // Лишний барабан: сужается, встаёт на 0 и удаляется
  removing: boolean;
  target: number;
  // Время по часам движка, когда барабан начнёт тормозить
  stopAt: number | null;
};

type Slot = {
  key: string;
  root: HTMLElement;
  container: HTMLElement;
  // Слева направо, как в DOM
  reels: Reel[];
  value: number | null | undefined;
  // Уже крутился хоть раз: новые барабаны тогда появляются с ростом ширины
  started: boolean;
};

type DigitsMemory = Record<string, number>;

const readMemory = (): DigitsMemory => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SLOT_STORAGE_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as DigitsMemory) : {};
  } catch {
    return {};
  }
};

const writeMemory = (memory: DigitsMemory) => {
  try {
    localStorage.setItem(SLOT_STORAGE_KEY, JSON.stringify(memory));
  } catch {
    // Хранилище недоступно (приватный режим, запрет сайта) — просто не запоминаем
  }
};

const randomPosition = () => Math.random() * 10;

const createReelElement = () => {
  const element = document.createElement("div");
  element.className = "slot-reel";
  const view = document.createElement("div");
  view.className = "slot-window";
  const tape = document.createElement("div");
  tape.className = "slot-tape";
  for (const digit of SLOT_TAPE) {
    const cell = document.createElement("div");
    cell.textContent = String(digit);
    tape.append(cell);
  }
  view.append(tape);
  element.append(view);
  return { element, tape };
};

// Барабаны всех чисел одного блока: общий цикл анимации и общая волна остановки
export class SlotEngine {
  private slots = new Map<string, Slot>();
  // Барабан по его элементу: после повторного монтирования (Strict Mode) движок забирает свои же барабаны
  private known = new WeakMap<Element, Reel>();
  private frame = 0;
  private lastTime = 0;
  // Время движка в секундах: растёт только пока идёт анимация, шагами не больше SLOT_MAX_FRAME_STEP
  private clock = 0;
  private requestId = 0;
  private loading = false;

  constructor(private readonly scope: string) {}

  register(key: string, root: HTMLElement, container: HTMLElement) {
    const slot: Slot = { key, root, container, reels: [], value: undefined, started: false };
    // Барабаны уже в разметке: серверные крутятся на CSS, свои остались от прошлого монтирования
    for (const element of Array.from(container.children)) {
      const reel = this.known.get(element) ?? (element.classList.contains("is-prerender") ? this.adoptPrerendered(element) : null);
      if (reel) slot.reels.push(reel);
    }
    this.slots.set(key, slot);
    if (slot.reels.length > 0) {
      slot.started = true;
      this.matchRememberedCount(slot);
      this.run();
    }
    if (this.loading) this.startSlot(slot);
  }

  // DOM барабанов удаляет React вместе с числом; движок только забывает о нём
  unregister(key: string) {
    this.slots.delete(key);
  }

  setValue(key: string, value: number | null | undefined) {
    const slot = this.slots.get(key);
    if (slot) slot.value = value;
  }

  // Запрос отправлен: все барабаны разгоняются с того места и той скорости, где они сейчас
  load() {
    this.requestId += 1;
    this.loading = true;
    for (const slot of this.slots.values()) this.startSlot(slot);
    this.run();
    return this.requestId;
  }

  // Ответ пришёл: барабаны встают волной слева направо через все числа подряд
  settle(requestId: number) {
    if (this.requestId === 0) return this.place();
    // Ответ на устаревший запрос: уже отправлен новый
    if (requestId !== this.requestId) return;
    this.loading = false;

    const memory = readMemory();
    let order = 0;

    for (const slot of this.orderedSlots()) {
      const targets = this.prepareTargets(slot, memory);
      for (const reel of slot.reels) {
        reel.target = reel.removing ? 0 : (targets.shift() ?? 0);
        if (!reel.motion.spinning) {
          // Стоящий барабан нечего тормозить: ставим сразу; уходящий и так уже тормозит
          if (!reel.motion.moving && !reel.removing) {
            reel.motion.place(reel.target);
            this.render(reel);
          }
          continue;
        }
        reel.stopAt = this.clock + order * SLOT_WAVE_STEP;
        order += 1;
      }
      // Стоящие лишние барабаны убираем сразу
      for (const reel of slot.reels.filter((item) => item.removing && !item.motion.moving)) this.removeReel(slot, reel);
    }

    writeMemory(memory);
    this.run();
  }

  // Первый показ без запроса (данные уже в кэше): числа встают сразу, без анимации
  place() {
    const memory = readMemory();
    for (const slot of this.slots.values()) {
      for (const reel of slot.reels) reel.element.remove();
      slot.reels = [];
      const digits = slot.value == null ? null : String(slot.value).split("").map(Number);
      slot.root.classList.toggle("is-dash", digits === null);
      if (!digits) continue;
      for (const digit of digits) {
        this.addReel(slot, "end", false, digit);
        slot.started = true;
      }
      memory[this.memoryKey(slot)] = digits.length;
    }
    writeMemory(memory);
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  private memoryKey(slot: Slot) {
    return `${this.scope}.${slot.key}`;
  }

  private orderedSlots() {
    return [...this.slots.values()].sort((first, second) =>
      first.root.compareDocumentPosition(second.root) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );
  }

  // Барабаны для ожидания: если их нет, столько, сколько цифр было в прошлом ответе
  private startSlot(slot: Slot) {
    slot.root.classList.remove("is-dash");
    if (slot.reels.every((reel) => reel.removing)) {
      const count = readMemory()[this.memoryKey(slot)] ?? SLOT_DEFAULT_DIGITS;
      for (let index = 0; index < count; index += 1) {
        this.addReel(slot, "end", slot.started, randomPosition());
      }
    }
    slot.started = true;
    // Уходящие барабаны не разгоняем: они дотормаживают и исчезают
    for (const reel of slot.reels.filter((item) => !item.removing)) {
      reel.stopAt = null;
      reel.motion.spin();
    }
  }

  // Серверный барабан: берём положение и скорость его CSS-анимации, снимаем её и продолжаем с той же точки
  private adoptPrerendered(element: Element) {
    const tape = element.querySelector<HTMLDivElement>(".slot-tape");
    if (!(element instanceof HTMLDivElement) || !tape) return null;

    const spinUp = tape
      .getAnimations()
      .find((animation) => animation instanceof CSSAnimation && animation.animationName === "slot-spin-up");
    // Разгон закончился и снят, значит барабан уже на полной скорости
    const elapsed = spinUp?.currentTime == null ? Infinity : Number(spinUp.currentTime) / 1000;

    let offset: number;
    try {
      offset = new DOMMatrixReadOnly(getComputedStyle(tape).transform).m42;
    } catch {
      offset = tapeOffset(0);
    }

    const motion = new ReelMotion(positionFromOffset(offset));
    motion.velocity = prerenderSpeed(elapsed);
    motion.spin();

    const reel: Reel = { motion, element, tape, removing: false, target: 0, stopAt: null };
    // Снимаем CSS-анимацию и в том же кадре ставим ленту туда же через transform: скачка нет
    element.classList.remove("is-prerender");
    this.render(reel);
    this.known.set(element, reel);
    return reel;
  }

  // Сервер не видит localStorage и рисует барабаны по умолчанию: подгоняем их число под прошлый ответ
  private matchRememberedCount(slot: Slot) {
    const remembered = readMemory()[this.memoryKey(slot)];
    if (remembered === undefined) return;
    const active = slot.reels.filter((reel) => !reel.removing);

    for (const reel of active.slice(0, Math.max(active.length - remembered, 0))) {
      this.markRemoving(reel);
      reel.motion.stop(0, SLOT_FINALE);
    }

    const speed = active[0]?.motion.velocity ?? 0;
    for (let missing = remembered - active.length; missing > 0; missing -= 1) {
      const reel = this.addReel(slot, "start", true, randomPosition());
      reel.motion.velocity = speed;
      reel.motion.spin();
    }
  }

  // Подгоняет число барабанов под новое значение и возвращает цифры для оставшихся
  private prepareTargets(slot: Slot, memory: DigitsMemory) {
    const active = slot.reels.filter((reel) => !reel.removing);

    if (slot.value == null) {
      // Ошибка или нет значения: все барабаны уходят, остаётся прочерк
      for (const reel of active) this.markRemoving(reel);
      slot.root.classList.add("is-dash");
      return [];
    }

    const digits = String(slot.value).split("").map(Number);
    slot.root.classList.remove("is-dash");

    // Лишние — слева: встают первыми в волне и сужаются
    for (const reel of active.slice(0, Math.max(active.length - digits.length, 0))) this.markRemoving(reel);

    // Недостающие появляются слева уже на полной скорости
    for (let missing = digits.length - active.length; missing > 0; missing -= 1) {
      this.addReel(slot, "start", true, randomPosition()).motion.spin(true);
    }

    memory[this.memoryKey(slot)] = digits.length;
    return digits;
  }

  // Положение задаётся сразу, чтобы первый кадр уже был на своём месте
  private addReel(slot: Slot, side: "start" | "end", grow: boolean, position: number) {
    const { element, tape } = createReelElement();
    const reel: Reel = { motion: new ReelMotion(position), element, tape, removing: false, target: 0, stopAt: null };
    const firstActive = slot.reels.findIndex((item) => !item.removing);

    if (side === "start") {
      // Слева от действующих барабанов, но правее уходящих
      const before = firstActive === -1 ? null : slot.reels[firstActive].element;
      slot.container.insertBefore(element, before);
      slot.reels.splice(firstActive === -1 ? slot.reels.length : firstActive, 0, reel);
    } else {
      slot.container.append(element);
      slot.reels.push(reel);
    }

    if (grow) {
      // Ширина с нуля: сначала нулевая, перерасчёт раскладки, потом снимаем класс — сработает переход
      element.classList.add("is-collapsed");
      void element.offsetWidth;
      element.classList.remove("is-collapsed");
    }
    this.render(reel);
    this.known.set(element, reel);
    return reel;
  }

  private markRemoving(reel: Reel) {
    reel.removing = true;
    reel.element.classList.add("is-collapsed");
  }

  private removeReel(slot: Slot, reel: Reel) {
    reel.element.remove();
    slot.reels = slot.reels.filter((item) => item !== reel);
  }

  private render(reel: Reel) {
    reel.tape.style.transform = `translate3d(0px, ${tapeOffset(reel.motion.position)}px, 0px)`;
  }

  private glow(reel: Reel) {
    // Перезапуск анимации: снять класс, пересчитать раскладку, поставить снова
    reel.element.classList.remove("is-glowing");
    void reel.element.offsetWidth;
    reel.element.classList.add("is-glowing");
  }

  private run() {
    if (this.frame) return;
    // Время текущего кадра, а не «сейчас»: по нему же браузер считает CSS-анимации и метки requestAnimationFrame.
    // Иначе первый шаг после передачи серверного барабана выходит короче и лента на кадр притормаживает
    const frameTime = document.timeline.currentTime;
    this.lastTime = typeof frameTime === "number" ? frameTime : performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    const deltaTime = Math.min(Math.max((now - this.lastTime) / 1000, 0), SLOT_MAX_FRAME_STEP);
    this.lastTime = now;
    this.clock += deltaTime;

    let moving = false;
    for (const slot of this.slots.values()) {
      for (const reel of [...slot.reels]) {
        if (reel.stopAt !== null && this.clock >= reel.stopAt && reel.motion.spinning) {
          reel.motion.stop(reel.target, SLOT_FINALE);
          reel.stopAt = null;
        }

        const { glow, stopped } = reel.motion.step(deltaTime);
        this.render(reel);
        if (glow && !reel.removing) this.glow(reel);

        if (stopped && reel.removing) {
          this.removeReel(slot, reel);
          continue;
        }
        if (stopped && digitAt(reel.motion.position) !== reel.target) {
          // Не должно случаться: барабан всегда встаёт на свою цифру
          reel.motion.place(reel.target);
          this.render(reel);
        }
        if (reel.motion.moving || reel.stopAt !== null) moving = true;
      }
    }

    // Цикл работает, только пока хоть один барабан движется
    this.frame = moving ? requestAnimationFrame(this.tick) : 0;
  };
}
