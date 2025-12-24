import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/createLocation.dto';
import { UpdateLocationDto } from './dto/updateLocation.dto';

@Controller('api/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // 🔐 Idealmente protegido (admin)
  @Post()
  create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  // 🔐 Admin
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  // 🌍 USADO PELO PYTHON
  @Get('active')
  findActive() {
    return this.locationsService.findActive();
  }

  // 🔐 Admin
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, dto);
  }

  // 🔐 Admin
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(id);
  }
}
