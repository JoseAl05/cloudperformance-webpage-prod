import { ObjectId } from 'mongodb';

export type UserRole = 'admin_global' | 'admin_empresa' | 'usuario';

export interface CloudAccount {
  /** ID con formato `clp-<id>`. Lo genera el servidor y se propaga a Users. */
  id: string;
  alias: string;
  db: string;
}

/**
 * INVARIANTE de los campos `<cloud>_accounts` (Empresas y Users):
 *  - Sólo existen cuando `is_<cloud>` e `is_<cloud>_multi_tenant` son `true`.
 *  - Si la nube NO es multi-tenant, el campo no existe y la conexión se
 *    resuelve por `user_db_<cloud>`.
 * Ver `lib/cloudAccounts.ts`.
 */
export interface Empresa {
  _id: ObjectId;
  name: string;
  planName: string;
  userLimit: number;
  currentUsers: number;
  createdAt?: Date;
  updatedAt?: Date;

  /* -------- AWS -------- */
  is_aws: boolean;
  user_db_aws: string | null;
  is_aws_multi_tenant: boolean;
  aws_accounts?: CloudAccount[];

  /* -------- AZURE -------- */
  is_azure: boolean;
  user_db_azure: string | null;
  is_azure_multi_tenant: boolean;
  azure_accounts?: CloudAccount[];

  /* -------- GCP -------- */
  is_gcp: boolean;
  user_db_gcp: string | null;
  is_gcp_multi_tenant: boolean;
  gcp_accounts?: CloudAccount[];
}

/**
 * Los campos de nube de un usuario son SIEMPRE un espejo de los de su empresa
 * (`client`). Se copian al crear el usuario y se re-propagan al editar la
 * licencia; nunca se editan por usuario.
 */
export interface User {
  _id: ObjectId;
  email: string;
  username: string;
  client: string;
  passwordHash: string;
  role: UserRole;
  planName?: string | null;
  is_active?: boolean;
  createdAt: Date;
  updatedAt: Date;

  /* -------- AWS -------- */
  is_aws: boolean;
  user_db_aws?: string | null;
  is_aws_multi_tenant: boolean;
  aws_accounts?: CloudAccount[];

  /* -------- AZURE -------- */
  is_azure: boolean;
  user_db_azure?: string | null;
  is_azure_multi_tenant: boolean;
  azure_accounts?: CloudAccount[];

  /* -------- GCP  -------- */
  is_gcp: boolean;
  user_db_gcp?: string | null;
  is_gcp_multi_tenant: boolean;
  gcp_accounts?: CloudAccount[];

  recoveryToken?: string;
  recoveryTokenExpires?: Date;

  connectors?: []
}

export interface AuthUserPayload {
  userId: string;
  email: string;
  username: string;
  client: string;
  role: UserRole;
  planName: string;

  /* -------- AWS -------- */
  user_db_aws: string | null;
  is_aws: boolean;
  is_aws_multi_tenant?: boolean;
  aws_accounts?: CloudAccount[];

  /* -------- AZURE -------- */
  user_db_azure: string | null;
  is_azure: boolean;
  is_azure_multi_tenant?: boolean;
  azure_accounts?: CloudAccount[];

  /* -------- GCP -------- */
  user_db_gcp: string | null;
  is_gcp: boolean;
  is_gcp_multi_tenant?: boolean;
  gcp_accounts?: CloudAccount[];
}

export interface ClientConnector {
  created_by:{
    username: string;
    email: string;
    client: string;
    role: UserRole;
  };
  connector_type: string;
  config:{
    [key: string]: string;
  };
  encrypted_credentials: {
    ciphertext: string;
    encrypted_data_key?: string;
    encryption_version: number;
  };
  status: string;
  created_at: Date;
  updated_at: Date;
  last_validated_at: Date;

}
