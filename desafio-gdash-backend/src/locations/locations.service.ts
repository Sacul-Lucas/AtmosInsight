import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from './locations.schema';
import { CreateLocationDto } from './dto/createLocation.dto';
import { UpdateLocationDto } from './dto/updateLocation.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  create(dto: CreateLocationDto) {
    return this.locationModel.create(dto);
  }

  findAll() {
    return this.locationModel.find().sort({ city: 1 });
  }

  async findOne(id: string) {
    return this.locationModel.findById(id);
  }

  async findByObject(location: {city: string, latitude: number, longitude: number}): Promise<Location | null> {
    return this.locationModel.findOne(location).exec();
  }

  findActive() {
    return this.locationModel.find({ active: true }).select('city latitude longitude');
  }

  async findById(id: string) {
    const location = await this.locationModel.findById(id);
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    return location;
  }

  async update(id: string, dto: UpdateLocationDto) {
    const location = await this.locationModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  async remove(id: string) {
    const location = await this.locationModel.findByIdAndDelete(id);
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    return location;
  }
}
