import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { ExportService } from './export/export.service';
import { WeatherLog, WeatherLogSchema } from './schemas/weatherLog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeatherLog.name, schema: WeatherLogSchema },
    ]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService, ExportService],
})
export class WeatherModule {}
