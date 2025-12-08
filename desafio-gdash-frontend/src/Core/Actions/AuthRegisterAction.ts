import axios from "axios";
import { API_BASE_URL } from "../../Config";

export type RegisterUserActionInput = {
  username?: string;
  email: string;
  password: string;
};

export type RegisterUserActionOutput = {
  status: RegisterUserStatus;
  data: string;
};

export type RegisterUserStatus = 
  | 'SUCCESS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'USERNAME_ALREADY_EXISTS'
  | 'UNKNOWN';

export class RegisterUserAction {
  static async execute(input: RegisterUserActionInput): Promise<RegisterUserActionOutput> {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
            username: input.username,
            email: input.email,
            password: input.password,
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });

        const { success, message } = response.data;

        if (success) {
            return { status: 'SUCCESS', data: message || 'Conta criada com sucesso!' };
        } else {
            return { status: 'UNKNOWN', data: message || 'Erro desconhecido' };
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            const { message, error: backendError } = error.response.data;

            if (message === 'Email já foi registrado') {
                return { status: 'EMAIL_ALREADY_EXISTS', data: message };
            } else {
                return { status: 'UNKNOWN', data: message || backendError || 'Erro desconhecido' };
            }
        }

        return { status: 'UNKNOWN', data: error.message || 'Erro de conexão' };
    }
  }
}
