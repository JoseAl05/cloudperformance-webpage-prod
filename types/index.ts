export interface UserDoc {
  _id: string;
  email: string;
  username: string;
  client: string;
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
  user_db_aws: string;
  user_db_azure: string;
}