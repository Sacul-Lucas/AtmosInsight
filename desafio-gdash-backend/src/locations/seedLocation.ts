import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Injectable()
export class SeedLocation implements OnApplicationBootstrap {
    constructor(private readonly locationsService: LocationsService) {}

    async onApplicationBootstrap() {
        const DEFAULT_CITY = process.env.DEFAULT_CITY;
        const DEFAULT_LAT = Number(process.env.DEFAULT_LAT);
        const DEFAULT_LON = Number(process.env.DEFAULT_LON);
        
        if (!DEFAULT_CITY || isNaN(DEFAULT_LAT) || isNaN(DEFAULT_LON)) {
          console.warn(
            'Default location not seeded. Missing DEFAULT_CITY, DEFAULT_LAT or DEFAULT_LON.',
          );
          return;
        }
    
        const existingLocation = await this.locationsService.findByObject({
          city: DEFAULT_CITY,
          latitude: DEFAULT_LAT,
          longitude: DEFAULT_LON,
        });
    
        if (existingLocation) {
          console.log(`Localização padrão já existe: ${DEFAULT_CITY}`);
          return;
        }
    
        await this.locationsService.create({
          city: DEFAULT_CITY,
          latitude: DEFAULT_LAT,
          longitude: DEFAULT_LON,
          active: true,
        });
    
        console.log(`Localização padrão criada: ${DEFAULT_CITY}`);
    }
}
