export function calculateComfort(temp: number, humidity: number) {
  let score = 100;
  score -= Math.abs(22 - temp) * 2;
  if (humidity > 70) score -= 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}