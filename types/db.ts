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
  is_aws: boolean;
  user_db_aws: string | null;
  is_azure: boolean;
  user_db_azure: string | null;
  is_azure_multi_tenant: boolean; 
  azure_accounts?: CloudAccount[]; 
  is_aws_multi_tenant: boolean;  
  aws_accounts?: CloudAccount[];   

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

  recoveryToken?: string;      // Token temporal único para recuperación
  recoveryTokenExpires?: Date; // Fecha y hora de expiración del token

}

export interface AuthUserPayload {
  userId: string; 
  username: string;
  client: string;
  role: UserRole; 
  user_db_aws: string | null;
  user_db_azure: string | null;
  is_azure:boolean;
  is_aws:boolean;
  planName: string;
  azure_accounts?: CloudAccount[]; 
  aws_accounts?: CloudAccount[];
}