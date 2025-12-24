import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, default: 'user' })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'Location' })
  location: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
