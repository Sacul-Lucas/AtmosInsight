import { Controller, Get, NotFoundException, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
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
    const insights = this.insightsService.generate(
      id,
      locationId,
    )

    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    if (!insights) {
      throw new NotFoundException('Não foi possível gerar os insights de IA');
    }
    
    return {
      success: true,
      message: insights
    };
  }
}
