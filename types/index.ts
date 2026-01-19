import { UserRole } from './db';

export interface UserDoc {
  _id: string;
  email: string;
  username: string;
  client: string;
  role: UserRole;
  user_db: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionDoc {
  _id: string;
  userId: string;
  userAgent?: string;
  ip?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface TwoFactorCodeDoc {
  _id: string;
  userId: string;
  code: string;
  purpose: 'login';
  createdAt: Date;
  expiresAt: Date;
}

export interface JWTPayload {
  sub: string;
  username: string;
  client: string;
  role: UserRole;

  // AWS
  is_aws: boolean;
  user_db_aws: string | null;

  // Azure
  is_azure: boolean;
  user_db_azure: string | null;

  // GCP 
  is_gcp: boolean;
  user_db_gcp: string | null;

  is_aws_multi_tenant?: boolean;
  is_azure_multi_tenant?: boolean;
  is_gcp_multi_tenant?: boolean;
}
