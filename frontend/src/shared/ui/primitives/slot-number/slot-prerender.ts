import { SLOT_TAPE, TAPE_LOOP_FROM, TAPE_LOOP_TO, tapeOffset } from "./slot-motion";
import { SLOT_ACCEL_TIME, SLOT_DEFAULT_DIGITS, SLOT_FULL_SPEED } from "./slot-number.config";

// Барабаны в серверной разметке: крутятся на CSS ещё до запуска JS, потом их забирает движок.
// Разгон по cubic-bezier(0.42, 0, 0.58, 0.16) повторяет путь при smoothstep-скорости (2u³ − progress⁴)
// с точностью до 0.3px и в конце выходит ровно на полную скорость — стык с прокруткой без скачка

const BEZIER = { firstX: 0.42, firstY: 0, secondX: 0.58, secondY: 0.16 };

// За разгон барабан проходит половину пути полной скорости: ∫ v·smoothstep = v·T/2
const SPIN_UP_DISTANCE = (SLOT_FULL_SPEED * SLOT_ACCEL_TIME) / 2;

// Один оборот ленты на полной скорости, секунды
const LOOP_TIME = 10 / SLOT_FULL_SPEED;

// Детерминированное число 0..1 из строки: разметка сервера и браузера должна совпасть
const hash01 = (text: string) => {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  // Финальное перемешивание: без него ключи, различающиеся последним символом («:0» и «:1»),
  // дают почти одинаковые числа, и барабаны одного числа крутятся синхронно
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return (hash >>> 0) / 4294967296;
};

export const SLOT_CELLS_HTML = SLOT_TAPE.map((digit) => `<div>${digit}</div>`).join("");

// Старт в [−0.5, 5.5): весь разгон (4 цифры) укладывается в ленту без перехода через край
const prerenderReel = (key: string, index: number) => {
  const start = -0.5 + 6 * hash01(`${key}:${index}`);
  const end = start + SPIN_UP_DISTANCE;
  // Фаза бесконечной прокрутки подобрана так, что после разгона она продолжается ровно с его конца
  const phase = (end + 0.5) / 10;
  const loopDelay = SLOT_ACCEL_TIME - phase * LOOP_TIME;
  const style = [
    `--slot-from: ${tapeOffset(start)}px`,
    `--slot-to: ${tapeOffset(end)}px`,
    `--slot-accel: ${SLOT_ACCEL_TIME}parameter`,
    `--slot-loop: ${LOOP_TIME}parameter`,
    `--slot-loop-from: ${TAPE_LOOP_FROM}px`,
    `--slot-loop-to: ${TAPE_LOOP_TO}px`,
    `--slot-loop-delay: ${loopDelay}parameter`,
  ].join("; ");
  return `<div class="slot-reel is-prerender" style="${style}"><div class="slot-window"><div class="slot-tape">${SLOT_CELLS_HTML}</div></div></div>`;
};

export const prerenderReelsHtml = (key: string) =>
  Array.from({ length: SLOT_DEFAULT_DIGITS }, (_, index) => prerenderReel(key, index)).join("");

const bezierAxis = (firstControl: number, secondControl: number, parameter: number) =>
  3 * firstControl * (1 - parameter) * (1 - parameter) * parameter + 3 * secondControl * (1 - parameter) * parameter * parameter + parameter * parameter * parameter;

const bezierSlope = (firstControl: number, secondControl: number, parameter: number) =>
  3 * firstControl * (1 - parameter) * (1 - parameter) + 6 * (secondControl - firstControl) * (1 - parameter) * parameter + 3 * (1 - secondControl) * parameter * parameter;

// Скорость CSS-барабана, цифр в секунду, через elapsed секунд после старта разгона
export const prerenderSpeed = (elapsed: number) => {
  const progress = elapsed / SLOT_ACCEL_TIME;
  if (progress >= 1) return SLOT_FULL_SPEED;
  if (progress <= 0) return 0;
  // x(parameter) = progress решаем бисекцией: x монотонна на [0, 1]
  let low = 0;
  let high = 1;
  for (let step = 0; step < 40; step += 1) {
    const middle = (low + high) / 2;
    if (bezierAxis(BEZIER.firstX, BEZIER.secondX, middle) < progress) low = middle;
    else high = middle;
  }
  const parameter = (low + high) / 2;
  const slope = bezierSlope(BEZIER.firstY, BEZIER.secondY, parameter) / bezierSlope(BEZIER.firstX, BEZIER.secondX, parameter);
  return (slope * SPIN_UP_DISTANCE) / SLOT_ACCEL_TIME;
};
