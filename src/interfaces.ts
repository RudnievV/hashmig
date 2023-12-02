import { ConnectionOptions } from 'mysql2';

export interface DBProcedureRow {
  Db: string;
  Name: string;
  Type: string;
  Definer: string;
  Modified: string;
  Created: string;
  SECURITY_TYPE: string;
  Comment: string;
  character_set_client: string;
  collation_connection: string;
  'Database Collation': string;
}

export type DBFunctionRow = DBProcedureRow;

export interface DBProcedureSourceRow {
  Procedure: string;
  sql_mode: string;
  'Create Procedure': string;
  character_set_client: string;
  collation_connection: string;
  'Database Collation': string;
}

export interface DBFunctionSourceRow {
  Function: string;
  sql_mode: string;
  'Create Function': string;
  character_set_client: string;
  collation_connection: string;
  'Database Collation': string;
}

export interface DBMigrationRow {
  FileName: string;
  Hash: string;
  Type: 'procedure' | 'function';
}

export interface LoggerEngine {
  log(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  success(message: string): void;
}

export interface HashmigConfig {
  db: ConnectionOptions;
  folder?: string;
  table?: string;
  silent?: boolean;
  logger?: LoggerEngine;
}
