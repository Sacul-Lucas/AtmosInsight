export function calculateAverage(logs: any[]) {
  const sum = logs.reduce(
    (acc, l) => {
      acc.temperature += l.metrics.temperature;
      acc.humidity += l.metrics.humidity;
      acc.rainProbability += l.metrics.precipitation_probability;
      acc.windSpeed += l.metrics.wind_speed;
      return acc;
    },
    { temperature: 0, humidity: 0, rainProbability: 0, windSpeed: 0 },
  );

  const count = logs.length;

  return {
    temperature: +(sum.temperature / count).toFixed(1),
    humidity: Math.round(sum.humidity / count),
    rainProbability: +(sum.rainProbability / count).toFixed(2),
    windSpeed: +(sum.windSpeed / count).toFixed(1),
  };
}