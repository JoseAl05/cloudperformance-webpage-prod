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

export interface User {
  _id: ObjectId;
  email: string;
  username: string;
  client: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  /* -------- AWS -------- */
  is_aws: boolean;
  user_db_aws?: string;
  is_aws_multi_tenant: boolean;
  aws_accounts?: CloudAccount[];

  /* -------- AZURE -------- */
  is_azure: boolean;
  user_db_azure?: string;
  is_azure_multi_tenant: boolean;
  azure_accounts?: CloudAccount[];

  /* -------- GCP  -------- */
  is_gcp: boolean;
  user_db_gcp?: string;
  is_gcp_multi_tenant: boolean;
  gcp_accounts?: CloudAccount[];

  recoveryToken?: string;
  recoveryTokenExpires?: Date;
}

export interface AuthUserPayload {
  userId: string;
  username: string;
  client: string;
  role: UserRole;
  planName: string;

  /* -------- AWS -------- */
  user_db_aws: string | null;
  is_aws: boolean;
  aws_accounts?: CloudAccount[];

  /* -------- AZURE -------- */
  user_db_azure: string | null;
  is_azure: boolean;
  azure_accounts?: CloudAccount[];

  /* -------- GCP -------- */
  user_db_gcp: string | null;
  is_gcp: boolean;
  gcp_accounts?: CloudAccount[];
}
