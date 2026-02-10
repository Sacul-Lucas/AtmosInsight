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

    async upsert(dto: CreateWeatherLogDto) {
        return this.weatherModel.updateOne(
          {
            locationId: dto.locationId,
            collectedAt: new Date(dto.collectedAt),
            type: dto.type,
          },
          { $set: dto },
          { upsert: true },
        );
    }

    async create(dto: CreateWeatherLogDto) {
        return this.weatherModel.create({
          ...dto,
          collectedAt: new Date(dto.collectedAt),
        });
    }

    async findAll(userId: string, locationId?: string) {
        const filter: any = { userId };

        if (locationId) {
            filter.locationId = locationId;
        }

        return this.weatherModel
            .find(filter)
            .sort({ collectedAt: -1 })
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
          collectedAt: { $gte: from },
        });
    }

    async findObserved(userId: string, locationId?: string) {
        const filter: any = { userId, type: 'observed' };

        if (locationId) {
            filter.locationId = locationId;
        }

        return this.weatherModel
            .find(filter)
            .sort({ collected_at: 1 })
            .lean();
    }

    async findForecast(userId: string, locationId?: string) {
        const filter: any = { userId, type: 'forecast' };

        if (locationId) {
            filter.locationId = locationId;
        }
        return this.weatherModel
            .find(filter)
            .sort({ collected_at: 1 })
            .lean();
    }

    async findTimeSeries(userId: string, locationId?: string) {
        const filter: any = { userId };

        if (locationId) {
            filter.locationId = locationId;
        }
        return this.weatherModel
            .find(filter)
            .sort({ collected_at: 1 })
            .lean();
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
