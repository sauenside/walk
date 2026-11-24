// Все настройки барабанов в одном месте: их удобно подбирать на глаз

// Высота ячейки ленты = высота строки; окошко в полторы строки
export const SLOT_CELL_HEIGHT = 20;
export const SLOT_WINDOW_HEIGHT = 30;

// Полная скорость, цифр в секунду
export const SLOT_FULL_SPEED = 10;

// Разгон от текущей скорости до полной, секунды
export const SLOT_ACCEL_TIME = 1;

// Минимальная длительность торможения, секунды
export const SLOT_DECEL_TIME = 1.8;

// Ниже этой скорости торможение считается от неё, иначе путь слишком короткий
export const SLOT_MIN_STOP_SPEED = 4;

// Шаг волны остановки слева направо, секунды
export const SLOT_WAVE_STEP = 0.04;

// Проскок мимо цифры в доле её высоты и время возврата на неё, секунды
export const SLOT_OVERSHOOT = 0.25;
export const SLOT_RETURN_TIME = 0.5;

// Финал: "overshoot" — проскок и доворот, "ease" — чистое замедление
export const SLOT_FINALE: "overshoot" | "ease" = "overshoot";

// В варианте "ease" свечение вспыхивает, когда пройдена эта доля торможения
export const SLOT_EASE_GLOW_AT = 0.85;

// Шаг времени между кадрами не больше этого, чтобы после возврата на вкладку не было скачка, секунды
export const SLOT_MAX_FRAME_STEP = 0.05;

// Сколько барабанов крутить, пока число ещё ни разу не приходило
export const SLOT_DEFAULT_DIGITS = 1;

// Объект «ключ метрики → число цифр» из прошлого ответа
export const SLOT_STORAGE_KEY = "walk.slot-number.digits";
