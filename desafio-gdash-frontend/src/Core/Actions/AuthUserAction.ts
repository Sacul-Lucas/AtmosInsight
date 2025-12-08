import axios from "axios";
import { API_BASE_URL } from "../../Config";

export type AuthUserActionInput = {
  email: string;
  password: string;
};

export type AuthUserActionOutput = {
  status: AuthUserStatus;
  data: string;
  token: object | undefined;
};

export type AuthUserStatus = 'SUCCESS' | 'EMAIL_NOT_FOUND' | 'INVALID_PASSWORD' | 'UNKNOWN';

export class AuthUserAction {
  static async execute(input: AuthUserActionInput): Promise<AuthUserActionOutput> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: input.email,
        password: input.password,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const { success, message, token } = response.data;

      if (success) {
        return { status: 'SUCCESS', data: message, token: token };
      } else {
        return { status: 'UNKNOWN', data: message || 'Erro desconhecido', token: undefined };
      }
    } catch (error: any) {
      // Axios lança erro para qualquer status code != 2xx
      if (error.response && error.response.data) {
        // Aqui você pega a mensagem enviada pelo backend
        const { message, error: backendError } = error.response.data;
        
        // Mapear status conforme a mensagem
        if (message === 'Email não encontrado') {
          return { status: 'EMAIL_NOT_FOUND', data: message, token: undefined };
        } else if (message === 'Senha incorreta') {
          return { status: 'INVALID_PASSWORD', data: message, token: undefined };
        } else {
          return { status: 'UNKNOWN', data: message || backendError || 'Erro desconhecido', token: undefined };
        }
      }

      // Erro de rede ou outro erro
      return { status: 'UNKNOWN', data: error.message || 'Erro de conexão', token: undefined };
    }
  }
}
