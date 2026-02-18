import { WeatherExport } from '../types/weatherExport.type';
import { WeatherLog } from '../schemas/weatherLog.schema';
import { stringify } from 'csv-stringify/sync';
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {
  generateCSV(logs: WeatherExport[]): Buffer {
    const records = logs.map((log) => ({
      locationId: log.locationId,
      temperature: log.metrics.temperature,
      apparent_temperature: log.metrics.apparent_temperature,
      humidity: log.metrics.humidity,
      precipitation_probability: log.metrics.precipitation_probability,
      visibility: log.metrics.visibility,
      wind_speed: log.metrics.wind_speed,
      condition: log.conditionLabel,
      refDate: log.collectedAt.toISOString(),
      type: log.type
    }));

    const csv = stringify(records, {
      header: true,
      columns: [
        { key: 'locationId', header: 'Localização' },
        { key: 'temperature', header: 'Temperatura (°C)' },
        { key: 'apparent_temperature', header: 'Sensação térmica (°C)' },
        { key: 'humidity', header: 'Humidade (%)' },
        { key: 'precipitation_probability', header: 'Probabilidade de precipitação (%)' },
        { key: 'visibility', header: 'Visibilidade (m)' },
        { key: 'wind_speed', header: 'Velocidade do vento (km/h)' },
        { key: 'condition', header: 'Condição do tempo' },
        { key: 'refDate', header: 'Data referenciada' },
        { key: 'type', header: 'Tipo' }
      ],
    });

    return Buffer.from(csv);
  }

  async generateXLSX(logs: WeatherExport[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Weather Logs');

    sheet.columns = [
      { key: 'locationId', header: 'Localização', width: 30 },
      { key: 'temperature', header: 'Temperatura (°C)', width: 20 },
      { key: 'apparent_temperature', header: 'Sensação térmica (°C)', width: 30 },
      { key: 'humidity', header: 'Humidade (%)', width: 20 },
      { key: 'precipitation_probability', header: 'Probabilidade de precipitação (%)', width: 30 },
      { key: 'visibility', header: 'Visibilidade (m)', width: 20 },
      { key: 'wind_speed', header: 'Velocidade do vento (km/h)', width: 30 },
      { key: 'condition', header: 'Condição do tempo', width: 30 },
      { key: 'refDate', header: 'Data referenciada', width: 25 },
      { key: 'type', header: 'Tipo', width: 15 }
    ];

    logs.forEach((log) => {
      sheet.addRow({
        locationId: log.locationId,
        temperature: log.metrics.temperature,
        apparent_temperature: log.metrics.apparent_temperature,
        humidity: log.metrics.humidity,
        precipitation_probability: log.metrics.precipitation_probability,
        visibility: log.metrics.visibility,
        wind_speed: log.metrics.wind_speed,
        condition: log.conditionLabel,
        refDate: log.collectedAt.toISOString(),
        type: log.type === 'observed' ? 'Observado' : 'Previsto'
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
