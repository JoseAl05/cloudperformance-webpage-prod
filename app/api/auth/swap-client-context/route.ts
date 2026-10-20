import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_COOKIE } from '@/lib/cookies'
import { verifyAuthToken, signAuthToken } from '@/lib/auth'
import { findCompanyByName } from '@/lib/db-utils'
import { companyCloudClaims } from '@/lib/sessionPayload'
import { createLogger } from '@/lib/logger'
import type { CloudProvider } from '@/lib/cloudAccounts'
import type { JWTPayload } from '@/types'
import type { Empresa } from '@/types/db'

const logger = createLogger('SwapClientContext')

class AccountNotAllowedError extends Error {}

function resolveCloudDb(
    company: Empresa,
    cloud: CloudProvider,
    requestedAccountId: unknown
): string | null {
    const accounts =
        company[`is_${cloud}_multi_tenant` as const] === true
            ? company[`${cloud}_accounts` as const] || []
            : []

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

    const targetCompanyName = isGlobalAdmin ? clientName : originalPayload.client
    const targetCompany = await findCompanyByName(targetCompanyName)

    if (!targetCompany) {
        return NextResponse.json(
            { message: `Empresa '${targetCompanyName}' no encontrada.` },
            { status: 404 }
        )
    }

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { connectors: _legacyConnectors, ...payloadWithoutConnectors } = originalPayload

    const newPayload: JWTPayload = {
        ...payloadWithoutConnectors,

        client: targetCompany.name,
        role: originalPayload.role,
        planName: targetCompany.planName,

        ...companyCloudClaims(targetCompany, {
            azure: finalAzureDb,
            aws: finalAwsDb,
            gcp: finalGcpDb,
            openai: finalOpenaiDb,
        }),

        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    }

    const signedToken = await signAuthToken(newPayload);

    console.log('[SWAP] Cliente:', targetCompany.name);
    const accountCount = (accounts: unknown) => (Array.isArray(accounts) ? accounts.length : undefined);
    console.log('[SWAP] AWS accounts:', accountCount(newPayload.aws_accounts));
    console.log('[SWAP] Azure accounts:', accountCount(newPayload.azure_accounts));
    console.log('[SWAP] GCP accounts:', accountCount(newPayload.gcp_accounts));

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
