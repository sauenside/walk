import {
  SLOT_ACCEL_TIME,
  SLOT_CELL_HEIGHT,
  SLOT_DECEL_TIME,
  SLOT_EASE_GLOW_AT,
  SLOT_FULL_SPEED,
  SLOT_MIN_STOP_SPEED,
  SLOT_OVERSHOOT,
  SLOT_RETURN_TIME,
  SLOT_WINDOW_HEIGHT,
} from "./slot-number.config";

// Движение одного барабана без DOM. Положение position — непрерывное число в цифрах:
// рост position прокручивает ленту вниз, и следующая цифра приходит сверху

export const smoothstep = (progress: number) => progress * progress * (3 - 2 * progress);

export const smootherstep = (progress: number) => progress * progress * progress * (progress * (6 * progress - 15) + 10);

const smootherstepSlope = (progress: number) => 30 * progress * progress * (1 - progress) * (1 - progress);

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

// Остаток в диапазоне [−0.5, 9.5): вокруг любой цифры по одной соседней ячейке в ленте есть всегда
const wrap = (position: number) => ((((position + 0.5) % 10) + 10) % 10) - 0.5;

// Лента сверху вниз: 0 | 9 8 7 6 5 4 3 2 1 0 | 9 — по лишней ячейке с каждого края
export const SLOT_TAPE = [0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9];

// Сдвиг ленты, при котором в центре окошка стоит положение position
export const tapeOffset = (position: number) => SLOT_WINDOW_HEIGHT / 2 - (10.5 - wrap(position)) * SLOT_CELL_HEIGHT;

// Обратное к tapeOffset: положение по сдвигу ленты, в диапазоне [−0.5, 9.5)
export const positionFromOffset = (offset: number) => 10.5 - (SLOT_WINDOW_HEIGHT / 2 - offset) / SLOT_CELL_HEIGHT;

// Сдвиги ленты в начале и в конце одного оборота: от положения −0.5 до 9.5
export const TAPE_LOOP_FROM = SLOT_WINDOW_HEIGHT / 2 - 11 * SLOT_CELL_HEIGHT;
export const TAPE_LOOP_TO = SLOT_WINDOW_HEIGHT / 2 - SLOT_CELL_HEIGHT;

export type StopPlan = { distance: number; startSpeed: number; duration: number };

// Путь до цифры по ходу вращения плюс целые обороты, чтобы distance лежал в [startSpeed·duration/4, startSpeed·duration/2]:
// так торможение не разгоняет барабан и сходит к нулю без рывка
export const planStop = (position: number, velocity: number, target: number): StopPlan => {
  const startSpeed = Math.max(velocity, SLOT_MIN_STOP_SPEED);
  let distance = (((target - position) % 10) + 10) % 10;
  while (distance < (startSpeed * SLOT_DECEL_TIME) / 4) distance += 10;
  return { distance, startSpeed, duration: Math.max(SLOT_DECEL_TIME, (2 * distance) / startSpeed) };
};

// offset(progress) = distance − remaining³(cubic + quartic·remaining), remaining = 1 − progress: начинается со скорости startSpeed, в конце скорость и ускорение нулевые
export const decelOffset = (progress: number, { distance, startSpeed, duration }: StopPlan) => {
  const remaining = 1 - progress;
  const cubic = 4 * distance - startSpeed * duration;
  const quartic = startSpeed * duration - 3 * distance;
  return distance - remaining * remaining * remaining * (cubic + quartic * remaining);
};

// Производная offset по времени, цифр в секунду
export const decelVelocity = (progress: number, { distance, startSpeed, duration }: StopPlan) => {
  const remaining = 1 - progress;
  const cubic = 4 * distance - startSpeed * duration;
  const quartic = startSpeed * duration - 3 * distance;
  return (remaining * remaining * (3 * cubic + 4 * quartic * remaining)) / duration;
};

type Phase =
  | { kind: "idle" }
  | { kind: "spin"; fromSpeed: number; elapsed: number }
  | { kind: "decel"; from: number; plan: StopPlan; elapsed: number; finale: "overshoot" | "ease"; target: number }
  | { kind: "return"; from: number; elapsed: number };

export type StepResult = { glow: boolean; stopped: boolean };

export class ReelMotion {
  position: number;
  velocity = 0;
  private phase: Phase = { kind: "idle" };
  private glowed = false;

  constructor(position: number) {
    this.position = position;
  }

  get moving() {
    return this.phase.kind !== "idle";
  }

  get spinning() {
    return this.phase.kind === "spin";
  }

  // Разгон с текущего места и текущей скорости, даже если барабан ещё тормозит
  spin(atFullSpeed = false) {
    if (atFullSpeed) this.velocity = SLOT_FULL_SPEED;
    this.phase = { kind: "spin", fromSpeed: this.velocity, elapsed: 0 };
  }

  stop(digit: number, finale: "overshoot" | "ease") {
    const target = digit + (finale === "overshoot" ? SLOT_OVERSHOOT : 0);
    this.phase = { kind: "decel", from: this.position, plan: planStop(this.position, this.velocity, target), elapsed: 0, finale, target };
    this.glowed = false;
  }

  // Встать на цифру сразу, без анимации
  place(digit: number) {
    this.position = digit;
    this.velocity = 0;
    this.phase = { kind: "idle" };
  }

  step(deltaTime: number): StepResult {
    const phase = this.phase;

    if (phase.kind === "spin") {
      phase.elapsed += deltaTime;
      const ramp = smoothstep(clamp01(phase.elapsed / SLOT_ACCEL_TIME));
      this.velocity = phase.fromSpeed + (SLOT_FULL_SPEED - phase.fromSpeed) * ramp;
      this.position += this.velocity * deltaTime;
      return { glow: false, stopped: false };
    }

    if (phase.kind === "decel") {
      phase.elapsed += deltaTime;
      const progress = clamp01(phase.elapsed / phase.plan.duration);
      this.position = phase.from + decelOffset(progress, phase.plan);
      this.velocity = decelVelocity(progress, phase.plan);

      if (phase.finale === "ease") {
        const glow = !this.glowed && progress >= SLOT_EASE_GLOW_AT;
        if (glow) this.glowed = true;
        if (progress < 1) return { glow, stopped: false };
        // Точно на цифре: убираем накопленную погрешность чисел с плавающей точкой
        this.position = Math.round(phase.from + phase.plan.distance);
        this.velocity = 0;
        this.phase = { kind: "idle" };
        return { glow, stopped: true };
      }

      if (progress < 1) return { glow: false, stopped: false };
      // Пик проскока: отсюда плавный возврат, свечение — сейчас
      this.position = phase.from + phase.plan.distance;
      this.velocity = 0;
      this.phase = { kind: "return", from: this.position, elapsed: 0 };
      return { glow: true, stopped: false };
    }

    if (phase.kind === "return") {
      phase.elapsed += deltaTime;
      const progress = clamp01(phase.elapsed / SLOT_RETURN_TIME);
      this.position = phase.from - SLOT_OVERSHOOT * smootherstep(progress);
      this.velocity = (-SLOT_OVERSHOOT * smootherstepSlope(progress)) / SLOT_RETURN_TIME;
      if (progress < 1) return { glow: false, stopped: false };
      this.position = Math.round(this.position);
      this.velocity = 0;
      this.phase = { kind: "idle" };
      return { glow: false, stopped: true };
    }

    return { glow: false, stopped: false };
  }
}

// Цифра, на которой стоит барабан
export const digitAt = (position: number) => ((Math.round(position) % 10) + 10) % 10;
