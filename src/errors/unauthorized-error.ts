import { CustomError } from '@/errors/custom-error';

/**
 * Error thrown when a user is not authorized to perform an action
 */
export class UnauthorizedError extends CustomError {
  /**
   * Creates a new unauthorized error
   * @param message - Error message
   */
  constructor(message = 'Unauthorized') {
    super(message, { status: 401, code: 'UNAUTHORIZED' });
  }
}
