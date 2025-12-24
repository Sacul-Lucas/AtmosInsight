import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
