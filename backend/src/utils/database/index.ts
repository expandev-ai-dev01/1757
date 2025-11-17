/**
 * @summary
 * Database utility functions for SQL Server operations
 *
 * @module utils/database
 */

import sql from 'mssql';
import { config } from '@/config';

export enum ExpectedReturn {
  Single = 'Single',
  Multi = 'Multi',
  None = 'None',
}

export interface IRecordSet<T = any> {
  recordset: T[];
}

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect({
      server: config.database.server,
      port: config.database.port,
      database: config.database.database,
      user: config.database.user,
      password: config.database.password,
      options: config.database.options,
    });
  }
  return pool;
}

export async function dbRequest(
  routine: string,
  parameters: { [key: string]: any },
  expectedReturn: ExpectedReturn,
  transaction?: sql.Transaction,
  resultSetNames?: string[]
): Promise<any> {
  const currentPool = transaction || (await getPool());
  const request = currentPool.request();

  for (const [key, value] of Object.entries(parameters)) {
    request.input(key, value);
  }

  const result = await request.execute(routine);

  if (expectedReturn === ExpectedReturn.None) {
    return null;
  }

  if (expectedReturn === ExpectedReturn.Single) {
    return result.recordset[0] || null;
  }

  if (resultSetNames && resultSetNames.length > 0) {
    const namedResults: { [key: string]: any[] } = {};
    resultSetNames.forEach((name, index) => {
      namedResults[name] = result.recordsets[index] || [];
    });
    return namedResults;
  }

  return result.recordsets;
}

export async function beginTransaction(): Promise<sql.Transaction> {
  const currentPool = await getPool();
  const transaction = new sql.Transaction(currentPool);
  await transaction.begin();
  return transaction;
}

export async function commitTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.commit();
}

export async function rollbackTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.rollback();
}
