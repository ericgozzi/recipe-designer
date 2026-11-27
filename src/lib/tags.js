// Technique tags render blue; oven / time / heat tags render red.
const PARAM_RE = /(°C|°F|\bMIN\b|\bSEC\b|\bHR\b|\bCHILL\b|\bHEAT\b|\bOVEN\b|\bFROID\b|\bFRIGO\b|\bKÜHLEN\b|\bFRÍO\b|\bFRIO\b|\bFEU\b|\bFUOCO\b|\bHITZE\b|\bFUEGO\b|\bLUME\b|冷蔵|火|\d+\s*(M|H|S)\b)/i;

export function isTimeOrOvenTag(tag) {
  return PARAM_RE.test(String(tag || '').toUpperCase().trim());
}
