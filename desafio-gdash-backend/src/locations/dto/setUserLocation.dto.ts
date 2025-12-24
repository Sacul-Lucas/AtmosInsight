import { IsMongoId } from 'class-validator';

export class SetUserLocationDto {
  @IsMongoId()
  locationId: string;
}
