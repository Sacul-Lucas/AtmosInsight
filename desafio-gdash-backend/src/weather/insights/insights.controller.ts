import { Controller, Get, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('api/weather/insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  getInsights(
    @Req() req: Request,
    @Query('locationId') locationId: string,
    id: string
  ) {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    
    return this.insightsService.generate(
      id,
      locationId,
    );
  }
}
