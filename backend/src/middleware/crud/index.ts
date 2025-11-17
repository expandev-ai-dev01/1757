/**
 * @summary
 * CRUD controller middleware for standardized operations
 *
 * @module middleware/crud
 */

import { Request } from 'express';
import { z } from 'zod';

export interface CrudPermission {
  securable: string;
  permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
}

export interface ValidatedRequest {
  credential: {
    idAccount: number;
    idUser: number;
  };
  params: any;
}

export class CrudController {
  private permissions: CrudPermission[];

  constructor(permissions: CrudPermission[]) {
    this.permissions = permissions;
  }

  async create(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | null, any]> {
    return this.validateRequest(req, schema, 'CREATE');
  }

  async read(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | null, any]> {
    return this.validateRequest(req, schema, 'READ');
  }

  async update(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | null, any]> {
    return this.validateRequest(req, schema, 'UPDATE');
  }

  async delete(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | null, any]> {
    return this.validateRequest(req, schema, 'DELETE');
  }

  private async validateRequest(
    req: Request,
    schema: z.ZodSchema,
    operation: string
  ): Promise<[ValidatedRequest | null, any]> {
    try {
      const params = {
        ...req.params,
        ...req.query,
        ...req.body,
      };

      const validated = await schema.parseAsync(params);

      return [
        {
          credential: {
            idAccount: 1,
            idUser: 1,
          },
          params: validated,
        },
        null,
      ];
    } catch (error: any) {
      return [
        null,
        {
          statusCode: 400,
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: error.errors,
        },
      ];
    }
  }
}

export function successResponse(data: any) {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function errorResponse(message: string, details?: any) {
  return {
    success: false,
    error: {
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

export const StatusGeneralError = {
  statusCode: 500,
  code: 'INTERNAL_SERVER_ERROR',
  message: 'An unexpected error occurred',
};
