export interface WeatherExport {
  locationId: string;
  collectedAt: Date;
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
  condition: number;
  conditionLabel: string;
  source: string;
}