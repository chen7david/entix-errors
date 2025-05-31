import { CustomError } from '@/errors/custom-error';
import { ErrorDetail } from '@/types/base-error.types';

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends CustomError {
  public readonly errors: ErrorDetail[];

  /**
   * Creates a new validation error
   * @param message - Error message
   * @param errors - Array of validation errors with field and message
   */
  constructor(message: string, errors: ErrorDetail[] = []) {
    super(message, { status: 400, code: 'VALIDATION_ERROR' });
    this.errors = errors;
  }
}
