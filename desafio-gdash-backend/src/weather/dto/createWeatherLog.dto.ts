import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateWeatherLogDto {
  @IsString()
  userId: string;

  @IsString()
  locationId: string;

  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;

  @IsNumber()
  windSpeed: number;

  @IsString()
  condition: string;

  @IsNumber()
  rainProbability: number;

  @IsDateString()
  timestamp: string;
}
