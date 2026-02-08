export function calculateAverage(logs: any[]) {
  const sum = logs.reduce(
    (acc, l) => {
      acc.temperature += l.temperature;
      acc.humidity += l.humidity;
      acc.precipitation_probability += l.precipitation_probability;
      acc.wind_speed += l.wind_speed;
      return acc;
    },
    { temperature: 0, humidity: 0, rainProbability: 0, windSpeed: 0 },
  );

  const count = logs.length;

  return {
    temperature: +(sum.temperature / count).toFixed(1),
    humidity: Math.round(sum.humidity / count),
    rainProbability: +(sum.precipitation_probability / count).toFixed(2),
    windSpeed: +(sum.wind_speed / count).toFixed(1)
  };
}
