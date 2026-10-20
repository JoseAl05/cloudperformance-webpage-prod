import type { Empresa, User } from '@/types/db';
import type { JWTPayload } from '@/types';
import { CLOUD_PROVIDERS, type CloudProvider } from '@/lib/cloudAccounts';

type CloudClaims = Pick<
    JWTPayload,
    | 'is_aws' | 'user_db_aws' | 'is_azure' | 'user_db_azure' | 'is_gcp' | 'user_db_gcp' | 'is_openai' | 'user_db_openai'
    | 'is_aws_multi_tenant' | 'is_azure_multi_tenant' | 'is_gcp_multi_tenant' | 'is_openai_multi_tenant'
> & Record<`${CloudProvider}_accounts`, Empresa['aws_accounts']>;

export function companyCloudClaims(
    company: Empresa,
    activeDbs: Partial<Record<CloudProvider, string | null>> = {},
): CloudClaims {
    const claims: Record<string, unknown> = {};
    for (const cloud of CLOUD_PROVIDERS) {
        const multiTenant = company[`is_${cloud}_multi_tenant`] === true;
        claims[`is_${cloud}`] = company[`is_${cloud}`] === true;
        claims[`user_db_${cloud}`] = cloud in activeDbs ? activeDbs[cloud] ?? null : company[`user_db_${cloud}`] || null;
        claims[`is_${cloud}_multi_tenant`] = multiTenant;
        claims[`${cloud}_accounts`] = multiTenant ? company[`${cloud}_accounts`] || [] : [];
    }
    return claims as CloudClaims;
}

export function buildLoginPayload(user: User, company: Empresa): JWTPayload {
    return {
        sub: String(user._id),
        username: user.username,
        email: user.email,
        client: user.client,
        role: user.role,
        ...companyCloudClaims(company),
        planName: company.planName,
    };
}
