import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherLog } from './schemas/weatherLog.schema';
import { CreateWeatherLogDto } from './dto/createWeatherLog.dto';

@Injectable()
export class WeatherService {
    constructor(
        @InjectModel(WeatherLog.name)
        private weatherModel: Model<WeatherLog>,
    ) {}

    async create(dto: CreateWeatherLogDto) {
        return this.weatherModel.create({
          ...dto,
          timestamp: new Date(dto.timestamp),
        });
    }

    async findAll(userId: string, locationId?: string) {
        const filter: any = { userId };

        if (locationId) {
            filter.locationId = locationId;
        }

        return this.weatherModel
            .find(filter)
            .sort({ timestamp: -1 })
            .limit(500);
    }

    async findByPeriod(
        userId: string,
        locationId: string,
        from: Date,
    ) {
        return this.weatherModel.find({
          userId,
          locationId,
          timestamp: { $gte: from },
        });
    }

    async findForExport(userId: string, locationId?: string) {
        const filter: any = { userId };
        
        if (locationId) {
            filter.locationId = locationId;
        }
    
        return this.weatherModel
            .find(filter)
            .sort({ timestamp: 1 });
    }

}
