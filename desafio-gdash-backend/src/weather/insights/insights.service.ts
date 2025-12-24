import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { WeatherService } from '../weather.service';
import { calculateAverage } from './calculators/average.calculator';
import { calculateTrend } from './calculators/trend.calculator';
import { calculateComfort } from './calculators/comfort.calculator';
import { InsightDTO } from './dto/insight.dto';
import axios from 'axios';

@Injectable()
export class InsightsService {
  constructor(private readonly weatherService: WeatherService) {}

  async generate(userId: string, locationId: string): Promise<InsightDTO> {
    const from = new Date();
    from.setDate(from.getDate() - 7); // últimos 7 dias

    const logs = await this.weatherService.findByPeriod(userId, locationId, from);

    if (logs.length === 0) {
      throw new InternalServerErrorException('Dados insuficientes para gerar insights');
    }

    const avg = calculateAverage(logs);
    const trend = calculateTrend(logs);
    const comfort = calculateComfort(avg.temperature, avg.humidity);

    const alerts = [];
    if (avg.rainProbability > 0.7) alerts.push('Alta chance de chuva');
    if (avg.temperature > 32) alerts.push('Calor extremo');
    if (avg.temperature < 10) alerts.push('Frio intenso');

    const prompt = this.buildPrompt(logs, avg, trend, comfort, alerts);

    const aiHTML = await this.callAI(prompt);

    return {
      period: 'last_7_days',
      average: avg,
      trend,
      comfortIndex: comfort,
      alerts,
      summaryHTML: aiHTML,
    };
  }

  private buildPrompt(
    logs: any[],
    avg: any,
    trend: any,
    comfort: number,
    alerts: string[],
  ): string {
    const reverseTimeline = [...logs].sort(
      (a, b) => new Date(a.current.time).getTime() - new Date(b.current.time).getTime(),
    );

    return `
        ANÁLISE CLIMÁTICA - ${logs[0].city_name}
        CONTEXTO:
        Você é um meteorologista especializado. Analise os dados climáticos das últimas ${logs.length} observações e gere insights.

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
        1. Crie um resumo textual de 2-3 frases
        2. Forneça análise detalhada das tendências
        3. Gere recomendações práticas (ex.: guarda-chuva, roupas, cuidados)
        4. A resposta deve ser em HTML:
           - Títulos H3
           - Listas em <ul><li>
           - Texto em <p>
           - Não mostrar coordenadas da cidade
        `;
    }

    private async callAI(prompt: string): Promise<string> {
        try {
            const res = await axios.post(
                process.env.GEMINI_API_URL!,
                {
                    system_instruction: {
                      parts: [{ text: 'Você é um profissional experiente em análise climática e meteorologia' }],
                    },
                    contents: { parts: [{ text: prompt }] },
                    generationConfig: { temperature: 1.0 },
                },
                {
                    headers: {
                        'x-goog-api-key': process.env.GEMINI_API_KEY,
                        'Content-Type': 'application/json',
                    },
                },
            );
          
            // Retorna apenas HTML limpo
            return res.data.candidates[0].content.parts[0].text.replace('```', '').replace('html', '');
        } catch (error) {
            throw new InternalServerErrorException('Erro ao gerar insights com IA');
        }
    }
}

