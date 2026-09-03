import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_COOKIE } from '@/lib/cookies'
import { verifyAuthToken, signAuthToken } from '@/lib/auth'
import { findCompanyByName } from '@/lib/db-utils'
import type { AuthUserPayload } from '@/types/db'

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE)?.value

    if (!token) {
        return NextResponse.json({ message: 'No autenticado.' }, { status: 401 })
    }

    let originalPayload: AuthUserPayload | null = null

    try {
        originalPayload = (await verifyAuthToken(token)) as AuthUserPayload
        if (!originalPayload) throw new Error('Token inválido')
    } catch (err) {
        return NextResponse.json(
            { message: 'Token inválido o expirado.' },
            { status: 401 }
        )
    }

    const body = await request.json()
    const {
        clientName,
        user_db_azure: explicitAzureDb,
        user_db_aws: explicitAwsDb,
        user_db_gcp: explicitGcpDb,
    } = body

    if (!clientName) {
        return NextResponse.json(
            { message: 'Falta el campo clientName.' },
            { status: 400 }
        )
    }

    const isGlobalAdmin = originalPayload.role === 'admin_global'
    const isSameCompany = originalPayload.client === clientName

    if (!isGlobalAdmin && !isSameCompany) {
        return NextResponse.json(
            {
                message:
                    'Permiso denegado. No puedes cambiar el contexto a otra empresa.',
            },
            { status: 403 }
        )
    }

    const targetCompany = await findCompanyByName(clientName)

    if (!targetCompany) {
        return NextResponse.json(
            { message: `Empresa '${clientName}' no encontrada.` },
            { status: 404 }
        )
    }

    // ------------------ DB FINAL POR NUBE ------------------

    const finalAzureDb =
        explicitAzureDb || targetCompany.user_db_azure || null

    const finalAwsDb =
        explicitAwsDb || targetCompany.user_db_aws || null

    const finalGcpDb =
        explicitGcpDb || targetCompany.user_db_gcp || null

    // ------------------ NUEVO PAYLOAD ------------------

    const newPayload: AuthUserPayload = {
        ...originalPayload,

        client: targetCompany.name,
        role: originalPayload.role,
        planName: targetCompany.planName,

        user_db_azure: finalAzureDb,
        user_db_aws: finalAwsDb,
        user_db_gcp: finalGcpDb,

        is_aws: targetCompany.is_aws,
        is_azure: targetCompany.is_azure,
        is_gcp: targetCompany.is_gcp,

        // Los flags se toman SIEMPRE de la empresa destino: si se heredaran del
        // token anterior, un admin_global podría arrastrar un `multi_tenant`
        // de otra empresa y quedar con cuentas que no le corresponden.
        is_aws_multi_tenant: targetCompany.is_aws_multi_tenant === true,
        is_azure_multi_tenant: targetCompany.is_azure_multi_tenant === true,
        is_gcp_multi_tenant: targetCompany.is_gcp_multi_tenant === true,

        // Sólo hay cuentas en multi-tenant; en single-tenant manda `user_db_<cloud>`.
        aws_accounts:
            targetCompany.is_aws_multi_tenant === true
                ? targetCompany.aws_accounts || []
                : [],
        azure_accounts:
            targetCompany.is_azure_multi_tenant === true
                ? targetCompany.azure_accounts || []
                : [],
        gcp_accounts:
            targetCompany.is_gcp_multi_tenant === true
                ? targetCompany.gcp_accounts || []
                : [],

        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    }

    await signAuthToken(newPayload)

    return NextResponse.json(
        {
            message: `Contexto actualizado correctamente.`,
            client: targetCompany.name,
        },
        { status: 200 }
    )
}
