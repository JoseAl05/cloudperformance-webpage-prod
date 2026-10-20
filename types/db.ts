import { ObjectId } from 'mongodb';

export type UserRole = 'admin_global' | 'admin_empresa' | 'usuario';

export interface CloudAccount {
  id: string;
  alias: string;
  db: string;
}

export interface Empresa {
  _id: ObjectId;
  name: string;
  planName: string;
  userLimit: number;
  currentUsers: number;
  createdAt?: Date;
  updatedAt?: Date;

  is_aws: boolean;
  user_db_aws: string | null;
  is_aws_multi_tenant: boolean;
  aws_accounts?: CloudAccount[];

  is_azure: boolean;
  user_db_azure: string | null;
  is_azure_multi_tenant: boolean;
  azure_accounts?: CloudAccount[];

  is_gcp: boolean;
  user_db_gcp: string | null;
  is_gcp_multi_tenant: boolean;
  gcp_accounts?: CloudAccount[];

  is_openai: boolean;
  user_db_openai: string | null;
  is_openai_multi_tenant: boolean;
  openai_accounts?: CloudAccount[];
}

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

  is_aws: boolean;
  user_db_aws?: string | null;
  is_aws_multi_tenant: boolean;
  aws_accounts?: CloudAccount[];

  is_azure: boolean;
  user_db_azure?: string | null;
  is_azure_multi_tenant: boolean;
  azure_accounts?: CloudAccount[];

  is_gcp: boolean;
  user_db_gcp?: string | null;
  is_gcp_multi_tenant: boolean;
  gcp_accounts?: CloudAccount[];

  is_openai: boolean;
  user_db_openai?: string | null;
  is_openai_multi_tenant: boolean;
  openai_accounts?: CloudAccount[];

  recoveryToken?: string;
  recoveryTokenExpires?: Date;

  connectors?: unknown[]

  active_client?: string;
}

export interface AuthUserPayload {
  userId: string;
  email: string;
  username: string;
  client: string;
  role: UserRole;
  planName: string;

  user_db_aws: string | null;
  is_aws: boolean;
  is_aws_multi_tenant?: boolean;
  aws_accounts?: CloudAccount[];

  user_db_azure: string | null;
  is_azure: boolean;
  is_azure_multi_tenant?: boolean;
  azure_accounts?: CloudAccount[];

  user_db_gcp: string | null;
  is_gcp: boolean;
  is_gcp_multi_tenant?: boolean;
  gcp_accounts?: CloudAccount[];

  user_db_openai?: string | null;
  is_openai?: boolean;
  is_openai_multi_tenant?: boolean;
  openai_accounts?: CloudAccount[];
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