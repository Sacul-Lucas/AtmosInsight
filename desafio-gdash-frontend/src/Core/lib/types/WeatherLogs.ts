export interface WeatherLogs {
  _id: string;
  locationId: string;
  metrics: {
    temperature: number;
    apparent_temperature: number;
    humidity: number;
    wind_speed: number;
    rain: number;
    precipitation_probability: number;
    visibility: number;
  };
  type: 'observed' | 'forecast';
  condition: string;
  collectedAt: string;
  createdAt: string;
  updatedAt: string;
  source: string;
};
