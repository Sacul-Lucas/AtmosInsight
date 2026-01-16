import { Injectable } from '@nestjs/common';
import { WeatherLog } from '../schemas/weatherLog.schema';
import { stringify } from 'csv-stringify/sync';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {
  // ---------- CSV ----------
  generateCSV(logs: WeatherLog[]): Buffer {
    const records = logs.map((log) => ({
      date: log.collectedAt.toISOString(),
      locationId: log.locationId,
      temperature: log.metrics.temperature,
      humidity: log.metrics.humidity,
      windSpeed: log.metrics.wind_speed,
      condition: log.condition,
      rainProbability: log.metrics.precipitation_probability,
      type: log.type
    }));

    const csv = stringify(records, {
      header: true,
      columns: [
        { key: 'date', header: 'Date' },
        { key: 'locationId', header: 'Location' },
        { key: 'temperature', header: 'Temperature (°C)' },
        { key: 'humidity', header: 'Humidity (%)' },
        { key: 'windSpeed', header: 'Wind Speed (km/h)' },
        { key: 'condition', header: 'Condition' },
        { key: 'rainProbability', header: 'Rain Probability' },
      ],
    });

    return Buffer.from(csv);
  }

  // ---------- XLSX ----------
  async generateXLSX(logs: WeatherLog[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Weather Logs');

    sheet.columns = [
      { header: 'Date', key: 'date', width: 25 },
      { header: 'Location', key: 'locationId', width: 20 },
      { header: 'Temperature (°C)', key: 'temperature', width: 20 },
      { header: 'Humidity (%)', key: 'humidity', width: 15 },
      { header: 'Wind Speed (km/h)', key: 'windSpeed', width: 20 },
      { header: 'Condition', key: 'condition', width: 20 },
      { header: 'Rain Probability', key: 'rainProbability', width: 20 },
    ];

    logs.forEach((log) => {
      sheet.addRow({
        date: log.collectedAt.toISOString(),
        locationId: log.locationId,
        temperature: log.metrics.temperature,
        humidity: log.metrics.humidity,
        windSpeed: log.metrics.wind_speed,
        condition: log.condition,
        rainProbability: log.metrics.precipitation_probability,
        type: log.type
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
