import {
  Injectable,
  InternalServerErrorException,
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { WeatherService } from '../weather.service';
import { calculateAverage } from './calculators/average.calculator';
import { calculateTrend } from './calculators/trend.calculator';
import { calculateComfort } from './calculators/comfort.calculator';
import { InsightDTO } from './dto/insight.dto';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

@Injectable()
export class InsightsService {
  constructor(private readonly weatherService: WeatherService) {}

  private static globalLock = false;
  private static locks = new Set<string>();
  private static cache = new Map<
    string,
    { data: InsightDTO & { expiresAt: number }; expiresAt: number }
  >();

  async generate(userId: string, locationId: string): Promise<InsightDTO & { expiresAt: number }> {
    const cacheKey = `${userId}:${locationId}`;
    const now = Date.now();

    const cached = InsightsService.cache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    if (InsightsService.locks.has(cacheKey)) {
      throw new InternalServerErrorException(
        'Insights já estão sendo gerados. Aguarde a próxima atualização.',
      );
    }

    InsightsService.locks.add(cacheKey);

    try {
      const logs = await this.weatherService.findObserved(userId, locationId);

      if (!logs || logs.length === 0) {
        throw new InternalServerErrorException(
          'Dados insuficientes para gerar insights',
        );
      }

      const avg = calculateAverage(logs);
      const trend = calculateTrend(logs);
      const comfort = calculateComfort(avg.temperature, avg.humidity);

      const alerts: string[] = [];
      if (avg.rainProbability > 0.7) alerts.push('Alta chance de chuva');
      if (avg.temperature > 32) alerts.push('Calor extremo');
      if (avg.temperature < 10) alerts.push('Frio intenso');

      const prompt = this.buildPrompt(logs, avg, trend, comfort, alerts);
      const aiHTML = await this.callAI(prompt);

      const expiresAt = this.getNextHourTimestamp();

      const result = {
        period: 'last_6_hours',
        average: avg,
        trend,
        comfortIndex: comfort,
        alerts,
        summaryHTML: aiHTML,
        expiresAt,
      };

      InsightsService.cache.set(cacheKey, {
        data: result,
        expiresAt,
      });

      return result;
    } finally {
      InsightsService.locks.delete(cacheKey);
    }
  }

  private getNextHourTimestamp(): number {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours() + 1,
      0,
      0,
      0,
    ).getTime();
  }

  private buildPrompt(
    logs: any[],
    avg: any,
    trend: any,
    comfort: number,
    alerts: string[],
  ): string {
    return `
      ANÁLISE CLIMÁTICA - Local selecionado
      CONTEXTO:
      Você é um meteorologista especializado. Analise os dados climáticos das últimas ${logs.length} observações e gere insights claros e úteis.

      DADOS MÉDIOS:
      - Temperatura: ${avg.temperature.toFixed(1)}°C
      - Umidade: ${avg.humidity.toFixed(1)}%
      - Vento: ${avg.windSpeed.toFixed(1)} km/h
      - Probabilidade de chuva: ${avg.rainProbability.toFixed(2)}

      TENDÊNCIAS:
      - Temperatura: ${trend.temperature}
      - Umidade: ${trend.humidity}
      - Vento: ${trend.windSpeed}

      ÍNDICE DE CONFORTO: ${comfort}

      ALERTAS:
      ${alerts.length > 0 ? alerts.join(', ') : 'Nenhum alerta'}

      REQUISITOS:
      1. Crie um resumo textual de 2 a 3 frases
      2. Forneça uma análise detalhada das tendências
      3. Gere recomendações práticas
      4. Retorne SOMENTE HTML válido (sem markdown e sem acento agudo)
    `;
  }

  private async callAI(prompt: string): Promise<string> {
    if (InsightsService.globalLock) {
      throw new InternalServerErrorException(
        'IA ocupada no momento. Tente novamente mais tarde.',
      );
    }

    InsightsService.globalLock = true;

    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.6,
          maxOutputTokens: 512,
        },
      });

      const text = response.text;

      if (!text) {
        throw new Error('Resposta vazia da IA');
      }

      return text
        .replace(/```/g, '')
        .replace(/html/gi, '')
        .trim();
    } catch (error: any) {
      if (error?.message?.includes('429')) {
        throw new HttpException(
          'Limite de requisições da IA atingido. Tente novamente após a próxima atualização.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      console.error('Gemini SDK error:', error);
      throw new InternalServerErrorException(
        'Erro ao gerar insights com IA',
      );
    } finally {
      InsightsService.globalLock = false;
    }
  }
}
