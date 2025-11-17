/**
 * @summary
 * Zod validation utilities and reusable schemas
 *
 * @module utils/zodValidation
 */

import { z } from 'zod';

export const zString = z.string().min(1);
export const zNullableString = z.string().nullable();

export const zName = z.string().min(1).max(200);
export const zNullableDescription = z.string().max(500).nullable();

export const zBit = z.coerce.number().int().min(0).max(1);

export const zFK = z.coerce.number().int().positive();
export const zNullableFK = z.coerce.number().int().positive().nullable();

export const zDateString = z.string().datetime();
