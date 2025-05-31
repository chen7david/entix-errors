import { AppError } from '@/utils/app-error.util';
import { AppErrorOptions } from '@/types/app-error.types';

/**
 * Error thrown when a requested resource is not found
 */
export class NotFoundError extends AppError {
  /**
   * Creates a new not found error
   * @param message - Error message or options
   */
  constructor(message?: string);
  constructor(options?: AppErrorOptions);
  constructor(arg?: string | AppErrorOptions) {
    if (typeof arg === 'string') {
      super({ status: 404, message: arg });
    } else {
      super({ status: 404, ...arg });
    }
  }
}

/**
 * Error thrown when a request is malformed or invalid
 */
export class BadRequestError extends AppError {
  /**
   * Creates a new bad request error
   * @param message - Error message or options
   */
  constructor(message?: string);
  constructor(options?: AppErrorOptions);
  constructor(arg?: string | AppErrorOptions) {
    if (typeof arg === 'string') {
      super({ status: 400, message: arg });
    } else {
      super({ status: 400, ...arg });
    }
  }
}

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends AppError {
  /**
   * Creates a new validation error
   * @param message - Error message or options
   */
  constructor(message?: string);
  constructor(options?: AppErrorOptions);
  constructor(arg?: string | AppErrorOptions) {
    if (typeof arg === 'string') {
      super({ status: 422, message: arg });
    } else {
      super({ status: 422, ...arg });
    }
  }
}

/**
 * Error thrown when a user is not authenticated
 */
export class UnauthorizedError extends AppError {
  /**
   * Creates a new unauthorized error
   * @param message - Error message or options
   */
  constructor(message?: string);
  constructor(options?: AppErrorOptions);
  constructor(arg?: string | AppErrorOptions) {
    if (typeof arg === 'string') {
      super({ status: 401, message: arg });
    } else {
      super({ status: 401, ...arg });
    }
  }
}

/**
 * Error thrown when a user is authenticated but not authorized for a resource
 */
export class ForbiddenError extends AppError {
  /**
   * Creates a new forbidden error
   * @param message - Error message or options
   */
  constructor(message?: string);
  constructor(options?: AppErrorOptions);
  constructor(arg?: string | AppErrorOptions) {
    if (typeof arg === 'string') {
      super({ status: 403, message: arg });
    } else {
      super({ status: 403, ...arg });
    }
  }
}

/**
 * Error thrown when a request conflicts with the current state of the server
 */
export class ConflictError extends AppError {
  /**
   * Creates a new conflict error
   * @param message - Error message or options
   */
  constructor(message?: string);
  constructor(options?: AppErrorOptions);
  constructor(arg?: string | AppErrorOptions) {
    if (typeof arg === 'string') {
      super({ status: 409, message: arg });
    } else {
      super({ status: 409, ...arg });
    }
  }
}

/**
 * Error thrown when a service is unavailable
 */
export class ServiceError extends AppError {
  /**
   * Creates a new service error
   * @param message - Error message or options
   */
  constructor(message?: string);
  constructor(options?: AppErrorOptions);
  constructor(arg?: string | AppErrorOptions) {
    if (typeof arg === 'string') {
      super({ status: 503, message: arg, expose: false });
    } else {
      super({ status: 503, ...arg, expose: false });
    }
  }
}

/**
 * Error thrown for internal server errors
 */
export class InternalError extends AppError {
  /**
   * Creates a new internal error
   * @param message - Error message or options
   */
  constructor(message?: string);
  constructor(options?: AppErrorOptions);
  constructor(arg?: string | AppErrorOptions) {
    if (typeof arg === 'string') {
      super({ status: 500, message: arg, expose: false });
    } else {
      super({ status: 500, ...arg, expose: false });
    }
  }
}

/**
 * Error thrown when a client is rate limited
 */
export class RateLimitError extends AppError {
  /**
   * Creates a new rate limit error
   * @param message - Error message or options
   */
  constructor(message?: string);
  constructor(options?: AppErrorOptions);
  constructor(arg?: string | AppErrorOptions) {
    if (typeof arg === 'string') {
      super({ status: 429, message: arg });
    } else {
      super({ status: 429, ...arg });
    }
  }
}

/**
 * Creates a custom error with a code and operational flag
 */
export class CustomError extends AppError {
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
