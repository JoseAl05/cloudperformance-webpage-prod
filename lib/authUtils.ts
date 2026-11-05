import { NextRequest } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import type { AuthUserPayload } from '@/types/db';

type Role = AuthUserPayload['role'];

export async function authorizeRequest(req: NextRequest, allowedRoles: Role[]) {
  const payload = await getAuthFromRequest(req);
  
  if (!payload) {
    return { authorized: false, status: 401, message: 'No autenticado o sesión expirada.' };
  }
  
  const user = payload as unknown as AuthUserPayload; 
  
  if (!user.role || !user.client) {
      return { authorized: false, status: 401, message: 'Token de sesión incompleto (falta rol o cliente).' };
  }

  if (!allowedRoles.includes(user.role)) {
    return { authorized: false, status: 403, message: `Permiso denegado. Se requiere uno de estos roles: ${allowedRoles.join(', ')}.` };
  }

  return { authorized: true, user, status: 200, message: 'Acceso concedido.' };
}