export interface Insights {
  period: string;
  average: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    rainProbability: number;
  };
  trend: string;
  comfortIndex: number;
  alerts: string[];
  summaryHTML?: string;
}