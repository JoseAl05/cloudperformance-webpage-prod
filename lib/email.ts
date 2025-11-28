import nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer';

const host = process.env.SMTP_HOST!;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER!;
const pass = process.env.SMTP_PASS!;
const from = process.env.MAIL_FROM!;

export const mailer = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass }
});

export async function send2FACodeEmail(to: string, code: string) {
  const appName = process.env.APP_NAME || 'Cloudperformance';
  const res = await mailer.sendMail({
    from,
    to,
    subject: `[${appName}] Tu código 2FA`,
    text: `Tu código de verificación es: ${code}. Expira en 10 minutos.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <h2 style="color: #0d9488;">Hola,</h2>
        <p>Has solicitado iniciar sesión en <strong>CloudPerformance</strong>.</p>
        <p>Tu código de verificación de 6 dígitos es:</p>
        <div style="font-size: 2rem; font-weight: bold; color: #0284c7; letter-spacing: 0.2em; margin: 20px 0;">
          ${code}
        </div>
        <p>No lo compartas con nadie.</p>
        <p>Si no solicitaste este código, por favor ignora este correo.</p>
        <hr style="border:none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.9rem; color: #666;">Gracias por confiar en <strong>CloudPerformance</strong>.</p>
      </div>
    `,
  });
  return res.messageId;
}

// NUEVA FUNCIÓN PARA RECUPERACIÓN DE CONTRASEÑA 
export async function sendRecoveryEmail(to: string, token: string): Promise<SentMessageInfo> {
    const appName = process.env.APP_NAME || 'Cloudperformance';
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const res = await mailer.sendMail({
        from,
        to,
        subject: `[${appName}] Restablecer Contraseña`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2563eb;">Solicitud de Restablecimiento de Contraseña</h2>
                <p>Hemos recibido una solicitud para cambiar la contraseña asociada a esta dirección de correo.</p>
                <p>Haz clic en el siguiente botón para continuar:</p>
                <a href="${resetLink}" 
                   style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; font-weight: bold;">
                   Restablecer Contraseña
                </a>
                <p style="margin-top: 25px; font-size: 12px; color: #666;">
                    Este enlace es válido solo por una hora. Si no solicitaste un cambio de contraseña, ignora este correo.
                </p>
            </div>
        `,
    });
    return res;
}