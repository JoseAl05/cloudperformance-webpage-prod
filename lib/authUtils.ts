import { NextRequest } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth'; // <--- Importa tu función existente de auth.ts
import type { AuthUserPayload } from '@/types/db'; // <--- Importa desde el archivo db.ts

// Obtenemos el tipo de los roles desde la interfaz AuthUserPayload
type Role = AuthUserPayload['role'];

/**
 * Verifica la autenticación y los permisos de rol para una solicitud.
 * @param req - La solicitud de Next.js.
 * @param allowedRoles - Un array de roles permitidos para acceder a esta ruta.
 * @returns Un objeto con el estado de la autorización y la información del usuario si es exitosa.
 */
export async function authorizeRequest(req: NextRequest, allowedRoles: Role[]) {
  // 1. Obtener la carga útil (payload) del token JWT
  const payload = await getAuthFromRequest(req);
  
  if (!payload) {
    return { authorized: false, status: 401, message: 'No autenticado o sesión expirada.' };
  }
  
  // 2. Mapear el payload al tipo AuthUserPayload.
  // Usamos 'as unknown as' para forzar la conversión, asumiendo que el JWT contiene el 'role' y 'client'.
  const user = payload as unknown as AuthUserPayload; 
  
  // 3. Comprobación de integridad del rol
  if (!user.role || !user.client) {
      return { authorized: false, status: 401, message: 'Token de sesión incompleto (falta rol o cliente).' };
  }

  // 4. Verificar si el rol del usuario está en la lista de roles permitidos
  if (!allowedRoles.includes(user.role)) {
    return { authorized: false, status: 403, message: `Permiso denegado. Se requiere uno de estos roles: ${allowedRoles.join(', ')}.` };
  }

  return { authorized: true, user, status: 200, message: 'Acceso concedido.' };
}