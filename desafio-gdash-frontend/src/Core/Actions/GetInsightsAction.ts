import { getToken } from "../lib/utils/tokenValidation";
import { API_BASE_URL } from "../../Config";
import axios from "axios";

export type GetInsightsActionOutput = {
  status: GetInsightsStatus;
  data: any;
};

export type GetInsightsStatus = 'SUCCESS' | 'INSIGHTS_NOT_FOUND' | 'ACCESS_DENIED' | 'TOKEN_NOT_FOUND' | 'INVALID_TOKEN' | 'UNKNOWN';

const token = getToken()

export class GetInsightsAction {
    static async execute(): Promise<GetInsightsActionOutput> {
        try {
          const response = await axios.get(`${API_BASE_URL}/weather/insights`,
          {
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}` 
            },
            withCredentials: true
          });

          const { success, message } = response.data;

          if (success) {
            return { status: 'SUCCESS', data: message };
          } else {
            return { status: 'INSIGHTS_NOT_FOUND', data: message || 'Erro desconhecido' };
          }
        } catch (error: any) {
          if (error.response && error.response.data) {
            const { message, error: backendError } = error.response.data;

            if (message === 'Token não fornecido') {
              return { status: 'TOKEN_NOT_FOUND', data: message };
            } else if (message === 'Token inválido') {
              return { status: 'INVALID_TOKEN', data: message };
            } else if (message === 'Acesso negado') {
              return { status: 'ACCESS_DENIED', data: message };
            } else {
              return { status: 'UNKNOWN', data: message || backendError || 'Erro desconhecido' };
            }
          }

          return { status: 'UNKNOWN', data: error.message || 'Erro de conexão'};
        }
    } 
}
