import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCollection } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rateLimit';
import { send2FACodeEmail } from '@/lib/email';
import { createLogger } from '@/lib/logger';
// import newrelic from 'newrelic';

const logger = createLogger('LoginAPI');

const LoginSchema = z.object({
  emailOrUsername: z.string().min(2),
  password: z.string().min(8),
});

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID(); // ID único para rastrear la petición

  logger.info('Petición de login recibida', { requestId });

  try {
    // Obtener IP
    const ip =
      (req.headers.get('x-forwarded-for') || '').split(',')[0] || 'unknown';
    logger.debug('IP del cliente identificada', { ip, requestId });

    // Rate limiting
    const rl = rateLimit(`login:${ip}`, 3, 5 * 60000);
    if (!rl.allowed) {
      logger.warn('Rate limit excedido', {
        ip,
        requestId,
        remainingAttempts: rl.remaining,
      });
      return NextResponse.json(
        { error: 'Demasiados intentos, espera 5 minutos para reintentar.' },
        { status: 429 }
      );
    }

    logger.debug('Rate limit verificado', {
      ip,
      requestId,
      remainingAttempts: rl.remaining,
    });

    // Parsear body
    const body = await req.json();
    const { emailOrUsername } = body;

    logger.info('Intentando autenticar usuario', {
      emailOrUsername,
      requestId,
    });

    // Validar datos
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      logger.warn('Validación de datos fallida', {
        emailOrUsername,
        errors: parsed.error.errors,
        requestId,
      });
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const { password } = parsed.data;

    // Buscar usuario en DB
    const users = await getCollection('Users');
    const user = await logger.time('Búsqueda de usuario en DB', () =>
      users.findOne({ email: emailOrUsername })
    );

    if (!user) {
      logger.warn('Usuario no encontrado', {
        emailOrUsername,
        requestId,
      });
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const userId = String(user._id);
    logger.info('Usuario encontrado', {
      userId,
      email: user.email,
      requestId,
    });

    // Verificar si la cuenta está activa
    if (user.is_active === false) {
      logger.warn('Intento de login en cuenta bloqueada', {
        userId,
        requestId,
      });
      return NextResponse.json(
        {
          error:
            'Tu cuenta ha sido bloqueada por un administrador. Contacta al soporte para más detalles.',
        },
        { status: 403 }
      );
    }

    // Verificar contraseña
    const passwordValid = await logger.time('Verificación de contraseña', () =>
      bcrypt.compare(password, user.passwordHash)
    );

    if (!passwordValid) {
      logger.warn('Contraseña incorrecta', {
        userId,
        requestId,
      });
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    logger.info('Contraseña verificada correctamente', {
      userId,
      requestId,
    });

    // Generar código 2FA
    const code = generateCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60_000);

    logger.debug('Código 2FA generado', {
      userId,
      requestId,
      expiresAt: expiresAt.toISOString(),
    });

    // Guardar código en DB
    const codes = await getCollection('twofactor_codes');
    await logger.time('Guardando código 2FA en DB', () =>
      codes.insertOne({
        userId,
        code,
        purpose: 'login',
        createdAt: now,
        expiresAt,
      })
    );

    // Enviar email
    try {
      await logger.time('Enviando email con código 2FA', () =>
        send2FACodeEmail(user.email, code)
      );

      logger.info('Email 2FA enviado exitosamente', {
        userId,
        email: user.email,
        requestId,
      });
    } catch (emailError) {
      logger.error('Error al enviar email 2FA', emailError as Error, {
        userId,
        email: user.email,
        requestId,
      });

      // Decidir si continuar o fallar
      return NextResponse.json(
        { error: 'Error al enviar el código. Intenta nuevamente.' },
        { status: 500 }
      );
    }

    logger.info('Login completado exitosamente', {
      userId,
      requestId,
    });

    return NextResponse.json({
      ok: true,
      userId,
      message: 'Código enviado a tu correo',
    });
  } catch (error) {
    logger.error('Error inesperado en proceso de login', error as Error, {
      requestId,
    });

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
