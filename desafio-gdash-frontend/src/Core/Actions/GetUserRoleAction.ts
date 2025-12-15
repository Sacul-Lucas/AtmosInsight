import { decoded, isTokenExpired, isTokenValid, token } from "../lib/utils/tokenValidation";

export type GetUserRoleActionOutput = {
    status: GetUserRoleActionStatus;
    data: string;
}

export type GetUserRoleActionStatus = 'SUCCESS' | 'USER_NOT_FOUND' | 'TOKEN_NOT_FOUND' | 'INVALID_TOKEN' | 'UNKNOWN';

export class GetUserRoleAction {
    static async execute(): Promise<GetUserRoleActionOutput> {
        try {
            const success = decoded.role
    
            if (success) {
                return {
                    status: 'SUCCESS',
                    data: decoded.role
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