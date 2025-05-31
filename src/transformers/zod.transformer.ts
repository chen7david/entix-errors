import { ValidationError } from '@/errors';

/**
 * Interface representing a ZodError structure
 */
export interface ZodErrorItem {
  message: string;
  path: string[];
  code: string;
  [key: string]: unknown;
}

export interface ZodErrorStructure {
  name: string;
  errors: ZodErrorItem[];
}

/**
 * Checks if an unknown error is a Zod error
 * @param error - The error to check
 * @returns Boolean indicating if the error is a Zod error
 */
export function isZodError(error: unknown): error is ZodErrorStructure {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: string }).name === 'ZodError' &&
    'errors' in error &&
    Array.isArray((error as { errors: unknown[] }).errors) &&
    (error as { errors: unknown[] }).errors.every(
      (e: unknown) => e && typeof e === 'object' && 'message' in e && 'path' in e && 'code' in e,
    )
  );
}

/**
 * Transforms a Zod error into a ValidationError
 * @param error - The Zod error to transform
 * @param message - The message for the ValidationError
 * @returns A ValidationError with details from the Zod error
 */
export function fromZodError(error: ZodErrorStructure, message: string): ValidationError {
  return new ValidationError({
    message,
    details: error.errors.map(err => ({
      path: err.path.length > 0 ? err.path.join('.') : '',
      message: err.message,
    })),
  });
}
