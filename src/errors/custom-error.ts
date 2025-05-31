import { BaseError } from '@/utils/base-error.util';

/**
 * CustomError extends BaseError to provide a simpler interface similar to the original CustomError
 * while leveraging all the capabilities of BaseError
 */
export class CustomError extends BaseError {
  public readonly code: string;
  public readonly isOperational: boolean;

  /**
   * Creates a new custom error
   * @param message - Error message
   * @param options - Error options including status, code, and isOperational flag
   */
  constructor(
    message: string,
    options: { status?: number; code?: string; isOperational?: boolean } = {},
  ) {
    const { status = 500, isOperational = true } = options;
    const code = options.code || 'INTERNAL_SERVER_ERROR';

    super({
      message,
      status,
      expose: isOperational,
    });
    this.code = code;
    this.isOperational = isOperational;
  }
}
