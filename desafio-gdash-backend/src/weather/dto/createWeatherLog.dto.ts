import { IsString, IsDateString, IsObject } from 'class-validator';

export class CreateWeatherLogDto {
  @IsString()
  locationId: string;

  @IsDateString()
  collectedAt: string;

  @IsObject()
  metrics: {
    temperature: number;
    apparent_temperature: number;
    humidity: number;
    wind_speed: number;
    rain: number;
    precipitation_probability: number;
    visibility: number;
  };

  @IsString()
  type: 'observed' | 'forecast';

  @IsString()
  condition: string;

  @IsString()
  source: string;
}
