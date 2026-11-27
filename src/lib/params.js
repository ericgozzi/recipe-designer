// Temperature and time tags, as written by the fader and the timer knob.
// They stay ordinary tags ("180°C", "12 MIN", "1H 30 MIN") so the grid, the PDF
// and JSON export are unchanged.

// ---------------------------------------------------------------------------
// Temperature
// ---------------------------------------------------------------------------
export const TEMP_MIN = 0;
export const TEMP_MAX = 300;
export const TEMP_STEP = 5;

const TEMP_RE = /^\s*(-?\d+)\s*°\s*C\s*$/i;

export function isTempTag(tag) {
  return TEMP_RE.test(String(tag));
}
export function parseTemp(tag) {
  const m = TEMP_RE.exec(String(tag));
  return m ? Number(m[1]) : null;
}
export function formatTemp(c) {
  return `${c}°C`;
}

// Thermometer scale: blue (cold) → violet → yellow → orange → red (hot). It skips
// green on purpose (poor contrast on the white body); violet keeps blue → yellow from going muddy.
const TEMP_STOPS = [
  [0, [40, 100, 255]],
  [0.22, [140, 105, 235]],
  [0.45, [245, 185, 10]],
  [0.7, [255, 120, 20]],
  [1, [228, 35, 25]],
];

export function tempColor(c) {
  const t = Math.min(1, Math.max(0, (c - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)));
  let i = 1;
  while (i < TEMP_STOPS.length - 1 && t > TEMP_STOPS[i][0]) i++;
  const [t0, c0] = TEMP_STOPS[i - 1];
  const [t1, c1] = TEMP_STOPS[i];
  const k = (t - t0) / (t1 - t0);
  const rgb = c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
  return `rgb(${rgb.join(' ')})`;
}

// ---------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------
// Detent positions of the timer knob, in minutes: fine at the bottom, coarse at the top.
export const TIME_STEPS = [
  ...Array.from({ length: 20 }, (_, i) => i + 1), // 1 … 20
  ...[25, 30, 35, 40, 45, 50, 55, 60],
  ...[75, 90, 105, 120, 135, 150, 165, 180],
  ...[210, 240, 270, 300, 330, 360, 420, 480],
];

const TIME_RE = /^\s*(?:(\d+)\s*H)?\s*(?:(\d+)\s*MIN)?\s*$/i;

export function isTimeTag(tag) {
  const m = TIME_RE.exec(String(tag));
  return Boolean(m && (m[1] || m[2]));
}
export function parseTime(tag) {
  const m = TIME_RE.exec(String(tag));
  if (!m || !(m[1] || m[2])) return null;
  return Number(m[1] || 0) * 60 + Number(m[2] || 0);
}
export function formatTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} MIN`;
  return m ? `${h}H ${m} MIN` : `${h}H`;
}
/**
 * Reads a time typed by hand: "90", "12 min", "12'", "1h30", "1h 30", "1:30", "4h", "4 H".
 * Returns minutes, or null if it can't be read.
 */
export function parseTimeInput(text) {
  const s = String(text).trim().toLowerCase().replace(',', '.');
  if (!s) return null;
  let m = /^(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|ore|heures?|std|horas?|時間)\s*(\d+)?\s*(?:m|min|')?$/.exec(s);
  if (m) return Math.round(Number(m[1]) * 60 + Number(m[2] || 0));
  m = /^(\d+)\s*:\s*(\d{1,2})$/.exec(s);
  if (m) return Number(m[1]) * 60 + Number(m[2]);
  m = /^(\d+)\s*(?:m|min|mins|minutes?|minuti|minutos|minuten|分|')?$/.exec(s);
  if (m) return Number(m[1]);
  return null;
}

/** Index of the detent closest to a number of minutes. */
export function nearestTimeStep(min) {
  let best = 0;
  TIME_STEPS.forEach((v, i) => {
    if (Math.abs(v - min) < Math.abs(TIME_STEPS[best] - min)) best = i;
  });
  return best;
}
