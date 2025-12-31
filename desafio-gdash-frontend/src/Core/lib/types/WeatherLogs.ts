export interface WeatherLogs {
  _id: string;
  locationId: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  rainProbability: number;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
};