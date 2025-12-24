import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WeatherLog extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  locationId: string;

  @Prop()
  temperature: number;

  @Prop()
  humidity: number;

  @Prop()
  windSpeed: number;

  @Prop()
  condition: string;

  @Prop()
  rainProbability: number;

  @Prop({ required: true })
  timestamp: Date;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
