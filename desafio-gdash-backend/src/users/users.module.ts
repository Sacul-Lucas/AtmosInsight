import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './user.schema';
import { SeedAdmin } from './seed-admin';
import { AuthModule } from '../auth/auth.module';
import { LocationsModule } from 'src/locations/locations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    LocationsModule,
  ],
  providers: [UsersService, SeedAdmin],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
