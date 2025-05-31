import { CustomError } from '@/errors/custom-error';

/**
 * Error thrown when a requested resource is not found
 */
export class NotFoundError extends CustomError {
  /**
   * Creates a new not found error
   * @param message - Error message
   * @param resource - The type of resource that was not found
   */
  constructor(message = 'Resource not found', resource = 'resource') {
    super(message, {
      status: 404,
      code: `${resource.toUpperCase()}_NOT_FOUND`,
    });
  }
}
