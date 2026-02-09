export class InsightDTO {
  period: string;

  average: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    rainProbability: number;
  };

  trend: {
    temperature: string;
    humidity: string;
    windSpeed: string;
  };

  comfortIndex: number;
  alerts: string[];
  summaryHTML?: string;
}