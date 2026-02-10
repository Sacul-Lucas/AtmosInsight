import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherLogDto } from './dto/createWeatherLog.dto';
import { QueryWeatherDto } from './dto/queryWeather.dto';
import { WorkerGuard } from '../common/guards/worker.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { InsightsService } from './insights/insights.service';
import { ExportService } from './export/export.service';
import type { Response } from 'express';
import type { Request } from 'express';

@Controller('api/weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly exportService: ExportService,
    private readonly insightsService: InsightsService
  ) {}

  @Post('logs')
  @UseGuards(WorkerGuard)
  create(@Body() dto: CreateWeatherLogDto) {
    return this.weatherService.upsert(dto);
  }

  @Get('logs')
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: QueryWeatherDto, id: string) {
    const weatherLogs = await this.weatherService.findAll(
      id,
      query.locationId,
    );

    if (!weatherLogs || weatherLogs.length === 0) {
      throw new NotFoundException('Não foram encontrados dados climáticos');
    }

    return {
      success: true,
      message: weatherLogs
    };
  }

  @Get('logs/observed')
  @UseGuards(JwtAuthGuard)
  async getObserved(@Query() query: QueryWeatherDto, id: string) {
    const userId = id;

    const data = await this.weatherService.findObserved(
      userId,
      query.locationId,
    );

    if (!data || data.length === 0) {
      throw new NotFoundException('Nenhum dado histórico encontrado');
    }

    return {
      success: true,
      message: data
    };
  }

  @Get('logs/forecast')
  @UseGuards(JwtAuthGuard)
  async getForecast(@Query() query: QueryWeatherDto, id: string) {
    const userId = id;

    const data = await this.weatherService.findForecast(
      userId,
      query.locationId,
    );

    if (!data || data.length === 0) {
      throw new NotFoundException('Nenhuma previsão encontrada');
    }

    return {
      success: true,
      message: data
    };
  }

  @Get('/insights')
  async getInsights(
    @Query('locationId') locationId: string,
    id: string
  ) {
    const insights = await this.insightsService.generate(
      id,
      locationId,
    )

    if (!insights) {
      throw new NotFoundException('Não foi possível gerar os insights de IA');
    }
    
    return {
      success: true,
      message: insights
    };
  }

  @Get('logs/timeseries')
  @UseGuards(JwtAuthGuard)
  async getTimeSeries(@Query() query: QueryWeatherDto, id: string) {
    const userId = id;

    const series = await this.weatherService.findTimeSeries(
      userId,
      query.locationId,
    );

    if (!series || series.length === 0) {
      throw new NotFoundException('Nenhum dado encontrado para a série temporal');
    }

    return {
      success: true,
      data: series
    };
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard)
  async exportCSV(
    @Req() req: Request,
    @Query('locationId') locationId: string,
    @Res() res: Response,
    id: string
  ) {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const logs = await this.weatherService.findForExport(
      id,
      locationId,
    );

    const csv = this.exportService.generateCSV(logs);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="weather-data.csv"',
    );

    res.send(csv);
  }

  @Get('export/xlsx')
  @UseGuards(JwtAuthGuard)
  async exportXLSX(
    @Req() req: Request,
    @Query('locationId') locationId: string,
    @Res() res: Response,
    id: string
  ) {
    const logs = await this.weatherService.findForExport(
      id,
      locationId,
    );

    const xlsx = await this.exportService.generateXLSX(logs);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="weather-data.xlsx"',
    );

    res.send(xlsx);
  }
}
