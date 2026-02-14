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
      if (avg.rainProbability > 70) alerts.push('Alta chance de chuva');
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
      Você é um meteorologista profissional.

      Analise os dados climáticos observados nas últimas ${logs.length} coletas e gere insights claros, objetivos e úteis ao usuario.

      DADOS MÉDIOS:
      Temperatura média: ${avg.temperature.toFixed(1)} °C
      Umidade média: ${avg.humidity.toFixed(1)} %
      Vento médio: ${avg.windSpeed.toFixed(1)} km/h
      Probabilidade média de chuva: ${avg.rainProbability.toFixed(2)}

      TENDÊNCIAS:
      Temperatura: ${trend.temperature}
      Umidade: ${trend.humidity}
      Vento: ${trend.windSpeed}

      ÍNDICE DE CONFORTO: ${comfort}

      ALERTAS:
      ${alerts.length ? alerts.join(', ') : 'Nenhum'}

      TAREFAS:
      1. Crie um resumo executivo de leitura rápida e eficiente
      2. Analise as tendências observadas nas ultimas horas
      3. Projete o comportamento do clima para as próximas 3 a 6 horas
      4. Gere recomendações práticas para o usuário

      FORMATO OBRIGATÓRIO DA RESPOSTA:
      - Retorne APENAS texto válido, sem título
      - Nunca utilize markdown
      - Nunca inclua coordenadas ou dados de localização
      - O texto deve ter, no máximo, 4 frases, a fim de manter o usuário interessado
      - Sem texto introdutório, como: "Aqui está a análise detalhada do clima, com projeções e recomendações"
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
          maxOutputTokens: 1500,
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
