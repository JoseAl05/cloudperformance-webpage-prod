import { ObjectId } from 'mongodb';

export type UserRole = 'admin_global' | 'admin_empresa' | 'usuario';

export interface Empresa {
  _id: ObjectId;
  name: string;
  planName: string; 
  userLimit: number; 
  currentUsers: number; 
  is_aws: boolean;
  is_azure: boolean;
  user_db_aws: string;
  user_db_azure: string;

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
  is_aws: boolean;
  is_azure: boolean;
  user_db_aws?: string;
  user_db_azure?: string;

}

export interface AuthUserPayload {
  userId: string; 
  username: string;
  client: string;
  role: UserRole; 
  user_db_aws: string;
  user_db_azure: string;
  is_azure:boolean;
  is_aws:boolean;
  
}