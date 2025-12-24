export function calculateAverage(logs: any[]) {
  const sum = logs.reduce(
    (acc, l) => {
      acc.temperature += l.temperature;
      acc.humidity += l.humidity;
      acc.rainProbability += l.rainProbability;
      acc.windSpeed += l.windSpeed;
      return acc;
    },
    { temperature: 0, humidity: 0, rainProbability: 0, windSpeed: 0 },
  );

  const count = logs.length;

  return {
    temperature: +(sum.temperature / count).toFixed(1),
    humidity: Math.round(sum.humidity / count),
    rainProbability: +(sum.rainProbability / count).toFixed(2),
    windSpeed: +(sum.windSpeed / count).toFixed(1)
  };
}
