import { getToken } from "../lib/utils/tokenValidation";
import { API_BASE_URL } from "../../Config";
import axios from "axios";

export type ExportWeatherDataActionOutput = {
  status: ExportWeatherDataStatus;
  data?: string;
};

export type ExportWeatherDataStatus =
  | 'SUCCESS'
  | 'DATA_NOT_FOUND'
  | 'ACCESS_DENIED'
  | 'TOKEN_NOT_FOUND'
  | 'INVALID_TOKEN'
  | 'UNKNOWN';

export class ExportWeatherDataAction {
  static async execute(exportType: string): Promise<ExportWeatherDataActionOutput> {
    try {
      const token = getToken();

      if (!token) {
        return { status: 'TOKEN_NOT_FOUND', data: 'Token não encontrado' };
      }

      const response = await axios.get(
        `${API_BASE_URL}/weather/export/${exportType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
          withCredentials: true,
        }
      );

      const blob = new Blob([response.data], { type: `text/${exportType}` });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `weather-data.${exportType}`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      return { status: 'SUCCESS' };

    } catch (error: any) {
      if (error.response) {
        const statusCode = error.response.status;

        if (statusCode === 401) {
          return { status: 'INVALID_TOKEN', data: 'Token inválido' };
        }

        if (statusCode === 403) {
          return { status: 'ACCESS_DENIED', data: 'Acesso negado' };
        }

        if (statusCode === 404) {
          return { status: 'DATA_NOT_FOUND', data: 'Nenhum dado encontrado' };
        }
      }

      return {
        status: 'UNKNOWN',
        data: error.message || 'Erro ao exportar dados',
      };
    }
  }
}
