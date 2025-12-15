import { decoded, isTokenExpired, isTokenValid, token } from "../lib/utils/tokenValidation";

export type GetUsernameActionOutput = {
    status: GetUsernameActionStatus;
    data: string;
}

export type GetUsernameActionStatus = 'SUCCESS' | 'USER_NOT_FOUND' | 'TOKEN_NOT_FOUND' | 'INVALID_TOKEN' | 'UNKNOWN';

export class GetUsernameAction {
    static async execute(): Promise<GetUsernameActionOutput> {
        try {
            const success = decoded.username
    
            if (success) {
                return {
                    status: 'SUCCESS',
                    data: decoded.username
                };
            } else {
                return {
                    status: 'USER_NOT_FOUND',
                    data: 'Usuário não encontrado'
                };
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                if (!token) {
                    return { status: 'TOKEN_NOT_FOUND', data: 'Token não encontrado' };
                } else if (!isTokenValid(token) || isTokenExpired(token)) {
                    return { status: 'INVALID_TOKEN', data: 'Token inválido' };
                } else {
                    return { status: 'UNKNOWN', data: 'Erro desconhecido' };
                }
            }

            return { status: 'UNKNOWN', data: error.message || 'Erro de conexão' };
        }
    }
};