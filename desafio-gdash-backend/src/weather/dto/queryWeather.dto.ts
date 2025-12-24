import { IsOptional, IsString } from 'class-validator';

export class QueryWeatherDto {
  @IsOptional()
  @IsString()
  locationId?: string;
}
