import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class WeatherMetrics {
  @Prop({ required: true }) temperature: number;
  @Prop({ required: true }) apparent_temperature: number;
  @Prop({ required: true }) humidity: number;
  @Prop({ required: true }) wind_speed: number;
  @Prop({ required: true }) rain: number;
  @Prop({ required: true }) precipitation_probability: number;
  @Prop({ required: true }) visibility: number;
}

const WeatherMetricsSchema = SchemaFactory.createForClass(WeatherMetrics);

@Schema({ timestamps: true })
export class WeatherLog extends Document {
  @Prop({ required: true })
  locationId: string;

  @Prop({ required: true })
  collectedAt: Date;

  @Prop({ type: WeatherMetricsSchema, required: true })
  metrics: WeatherMetrics;

  @Prop({
    required: true,
    enum: ['observed', 'forecast'],
  })
  type: 'observed' | 'forecast';

  @Prop({ required: true })
  condition: number;

  @Prop()
  source: string;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);