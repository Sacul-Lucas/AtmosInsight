import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location, LocationSchema } from './locations.schema';
import { SeedLocation } from './seedLocation';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService, SeedLocation],
  exports: [
    LocationsService,
    MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]),
  ],
})
export class LocationsModule {}
