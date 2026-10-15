import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_COOKIE } from '@/lib/cookies'
import { verifyAuthToken, signAuthToken } from '@/lib/auth'
import { findCompanyByName } from '@/lib/db-utils'
import { createLogger } from '@/lib/logger'
import type { CloudProvider } from '@/lib/cloudAccounts'
import type { JWTPayload } from '@/types'
import type { Empresa } from '@/types/db'

const logger = createLogger('SwapClientContext')

class AccountNotAllowedError extends Error {}

/**
 * Resuelve la BD de una nube SIEMPRE desde la empresa destino.
 * El navegador sólo puede elegir una cuenta por su ID; nunca envía nombres de BD.
 */
function resolveCloudDb(
    company: Empresa,
    cloud: CloudProvider,
    requestedAccountId: unknown
): string | null {
    const accounts =
        company[`is_${cloud}_multi_tenant` as const] === true
            ? company[`${cloud}_accounts` as const] || []
            : []

    // Single-tenant: la única BD posible es la de la empresa.
    if (accounts.length === 0) return company[`user_db_${cloud}` as const] || null

    if (typeof requestedAccountId === 'string' && requestedAccountId) {
        const account = accounts.find((acc) => acc.id === requestedAccountId)
        if (!account) throw new AccountNotAllowedError(cloud)
        return account.db
    }

    return company[`user_db_${cloud}` as const] || accounts[0].db
}

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE)?.value

    if (!token) {
        return NextResponse.json({ message: 'No autenticado.' }, { status: 401 })
    }

    let originalPayload: JWTPayload | null = null

    try {
        originalPayload = await verifyAuthToken(token)
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
        azure_account_id: azureAccountId,
        aws_account_id: awsAccountId,
        gcp_account_id: gcpAccountId,
        openai_account_id: openaiAccountId,
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

    // Sólo admin_global elige la empresa; el resto queda en la de su propio token.
    const targetCompanyName = isGlobalAdmin ? clientName : originalPayload.client
    const targetCompany = await findCompanyByName(targetCompanyName)

    if (!targetCompany) {
        return NextResponse.json(
            { message: `Empresa '${targetCompanyName}' no encontrada.` },
            { status: 404 }
        )
    }

    // ------------------ DB FINAL POR NUBE ------------------

    let finalAzureDb: string | null
    let finalAwsDb: string | null
    let finalGcpDb: string | null
    let finalOpenaiDb: string | null

    try {
        finalAzureDb = resolveCloudDb(targetCompany, 'azure', azureAccountId)
        finalAwsDb = resolveCloudDb(targetCompany, 'aws', awsAccountId)
        finalGcpDb = resolveCloudDb(targetCompany, 'gcp', gcpAccountId)
        finalOpenaiDb = resolveCloudDb(targetCompany, 'openai', openaiAccountId)
    } catch (err) {
        if (err instanceof AccountNotAllowedError) {
            logger.warn('Swap rechazado: cuenta fuera de la empresa destino', {
                actor: originalPayload.email,
                role: originalPayload.role,
                targetCompany: targetCompany.name,
                cloud: err.message,
            })
            return NextResponse.json(
                { message: 'La cuenta seleccionada no pertenece a la empresa.' },
                { status: 403 }
            )
        }
        throw err
    }

    // ------------------ NUEVO PAYLOAD ------------------

    // Los tokens antiguos traían `connectors`; ya no viajan en el JWT (se leen por empresa)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { connectors: _legacyConnectors, ...payloadWithoutConnectors } = originalPayload

    const newPayload: JWTPayload = {
        ...payloadWithoutConnectors,

        client: targetCompany.name,
        role: originalPayload.role,
        planName: targetCompany.planName,

        user_db_azure: finalAzureDb,
        user_db_aws: finalAwsDb,
        user_db_gcp: finalGcpDb,
        user_db_openai: finalOpenaiDb,

        is_aws: targetCompany.is_aws,
        is_azure: targetCompany.is_azure,
        is_gcp: targetCompany.is_gcp,
        is_openai: targetCompany.is_openai === true,

        // Los flags se toman SIEMPRE de la empresa destino: si se heredaran del
        // token anterior, un admin_global podría arrastrar un `multi_tenant`
        // de otra empresa y quedar con cuentas que no le corresponden.
        is_aws_multi_tenant: targetCompany.is_aws_multi_tenant === true,
        is_azure_multi_tenant: targetCompany.is_azure_multi_tenant === true,
        is_gcp_multi_tenant: targetCompany.is_gcp_multi_tenant === true,
        is_openai_multi_tenant: targetCompany.is_openai_multi_tenant === true,

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
        openai_accounts:
            targetCompany.is_openai_multi_tenant === true
                ? targetCompany.openai_accounts || []
                : [],

        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    }

    const signedToken = await signAuthToken(newPayload);

    console.log('[SWAP] Cliente:', targetCompany.name);
    console.log('[SWAP] AWS accounts:', newPayload.aws_accounts?.length);
    console.log('[SWAP] Azure accounts:', newPayload.azure_accounts?.length);
    console.log('[SWAP] GCP accounts:', newPayload.gcp_accounts?.length);

    console.log(
        '[SWAP] Payload bytes:',
        Buffer.byteLength(JSON.stringify(newPayload), 'utf8')
    );

    if (typeof signedToken === 'string') {
        console.log(
            '[SWAP] JWT bytes:',
            Buffer.byteLength(signedToken, 'utf8')
        );
    }

    logger.info('Contexto de cliente actualizado', {
        actor: originalPayload.email,
        role: originalPayload.role,
        fromCompany: originalPayload.client,
        toCompany: targetCompany.name,
        accounts: {
            aws: awsAccountId ?? null,
            azure: azureAccountId ?? null,
            gcp: gcpAccountId ?? null,
            openai: openaiAccountId ?? null,
        },
    })

    return NextResponse.json(
        {
            message: `Contexto actualizado correctamente.`,
            client: targetCompany.name,
        },
        { status: 200 }
    )
}
