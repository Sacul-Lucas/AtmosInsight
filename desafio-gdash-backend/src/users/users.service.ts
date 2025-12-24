import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Location } from '../locations/locations.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Location.name)
    private readonly locationModel: Model<Location>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const defaultLocation = await this.locationModel.findOne({ active: true });

    if (!defaultLocation) {
      throw new NotFoundException(
        'No active location found. Please create a default location.',
      );
    }

    const createdUser = new this.userModel({
      ...createUserDto,
      location: defaultLocation._id,
    });

    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('location').exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).populate('location').exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).populate('location').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .populate('location')
      .exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async updateUserLocation(userId: string, locationId: string): Promise<User> {
    const locationExists = await this.locationModel.exists({
      _id: new Types.ObjectId(locationId),
      active: true,
    });
  
    if (!locationExists) {
      throw new NotFoundException('Location not found or inactive');
    }
  
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { location: locationId },
        { new: true },
      )
      .populate('location')
      .exec();
    
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
  
    return updatedUser;
  }
}
