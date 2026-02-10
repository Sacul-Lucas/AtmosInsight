export function calculateTrend(logs: any[]) {
  const half = Math.floor(logs.length / 2);
  const first = logs.slice(0, half);
  const second = logs.slice(half);

  const avg = (arr: any[], key: string) =>
    arr.reduce((s, l) => s + l.metrics[key], 0) / arr.length;

  const calc = (key: string) => {
    const diff = avg(second, key) - avg(first, key);

    if (diff > 2) return 'Aumentando significativamente';
    if (diff > 0.5) return 'Aumentando levemente';
    if (diff < -2) return 'Diminuindo significativamente';
    if (diff < -0.5) return 'Diminuindo levemente';
    return 'Estável';
  };

  return {
    temperature: calc('temperature'),
    humidity: calc('humidity'),
    windSpeed: calc('wind_speed'),
  };
}
