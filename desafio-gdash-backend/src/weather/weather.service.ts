import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherLog } from './schemas/weatherLog.schema';
import { CreateWeatherLogDto } from './dto/createWeatherLog.dto';
import { getWeatherConditionLabel } from './utils/weatherConditionCodes';

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
      
        const logs = await this.weatherModel
            .find(filter)
            .sort({ collectedAt: -1 })
            .limit(500)
            .lean();
      
        return logs.map((log) => ({
            ...log,
            conditionLabel: getWeatherConditionLabel(log.condition),
        }));
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
      
        const logs = await this.weatherModel
            .find(filter)
            .sort({ collectedAt: 1 })
            .lean();
        
        return logs.map((log) => ({
            ...log,
            conditionLabel: getWeatherConditionLabel(log.condition),
        }));
    }

    async findForecast(userId: string, locationId?: string) {
        const filter: any = { userId, type: 'forecast' };

        if (locationId) {
            filter.locationId = locationId;
        }
        const logs = await this.weatherModel
            .find(filter)
            .sort({ collectedAt: 1 })
            .lean();

        return logs.map((log) => ({
            ...log,
            conditionLabel: getWeatherConditionLabel(log.condition),
        }));
    }

    async findTimeSeries(userId: string, locationId?: string) {
        const filter: any = { userId };

        if (locationId) {
            filter.locationId = locationId;
        }
        const logs = await this.weatherModel
            .find(filter)
            .sort({ collectedAt: 1 })
            .lean();

        return logs.map((log) => ({
            ...log,
            conditionLabel: getWeatherConditionLabel(log.condition),
        }));
    }

    async findForExport(userId: string, locationId?: string) {
        const filter: any = { userId };
        
        if (locationId) {
            filter.locationId = locationId;
        }
      
        const logs = await this.weatherModel
            .find(filter)
            .sort({ collectedAt: 1 })
            .lean();
      
        return logs.map((log) => ({
            ...log,
            conditionLabel: getWeatherConditionLabel(log.condition),
        }));
    }

}
