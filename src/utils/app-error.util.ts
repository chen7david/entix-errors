import { randomUUID } from 'crypto';
import { HTTP_ERROR_MESSAGES } from '@/constants/http.constants';
import { AppErrorOptions, ErrorDetail, ErrorResponse } from '@/types/app-error.types';

/**
 * Environment configuration for error handling
 * Set once at application startup for better performance
 */
export class ErrorConfig {
  private static _isDevelopment = process.env.NODE_ENV === 'development';

  static get isDevelopment(): boolean {
    return this._isDevelopment;
  }

  static setDevelopmentMode(isDev: boolean): void {
    this._isDevelopment = isDev;
  }
}

/**
 * Base error class that extends the native Error class
 * Provides additional properties for error classification and handling
 */
export class AppError extends Error {
  readonly status: number;
  readonly errorId: string;
  readonly cause?: Error;
  readonly details: ErrorDetail[];
  readonly logContext: Record<string, unknown>;
  readonly type: string;
  readonly expose: boolean;

  /**
   * Create a BaseError with a message or options object.
   * @param params Error message string or options object
   */
  constructor(message: string);
  constructor(options: AppErrorOptions);
  constructor(params: string | AppErrorOptions) {
    const options = AppError.normalizeOptions(params);
    const status = options.status || 500;
    const message = options.message || HTTP_ERROR_MESSAGES[status] || 'Unknown Error';

    super(message);
    this.status = status;
    this.errorId = randomUUID();
    this.cause = options.cause;
    this.details = options.details || [];
    this.logContext = options.logContext || {};
    this.expose = options.expose !== undefined ? options.expose : status < 500;
    this.type = this.constructor.name.replace(/Error$/, '').toLowerCase();
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Normalize constructor parameters into options object
   */
  private static normalizeOptions(messageOrOptions: string | AppErrorOptions): AppErrorOptions {
    if (typeof messageOrOptions === 'string') {
      return { message: messageOrOptions };
    }
    return messageOrOptions ?? {};
  }

  /**
   * Converts the error to a client-safe response object
   */
  toResponse(): ErrorResponse {
    const errorResponse: ErrorResponse = {
      status: this.status,
      type: this.type,
      message: this.expose
        ? this.message
        : HTTP_ERROR_MESSAGES[this.status] || 'Internal Server Error',
    };

    // Include errorId for 500-level errors to help with debugging
    if (this.status >= 500) {
      errorResponse.errorId = this.errorId;
    }

    // Include details only for exposed errors
    if (this.expose && this.details.length > 0) {
      errorResponse.details = this.details;
    }
    // Include stack trace only in development mode
    if (ErrorConfig.isDevelopment) {
      errorResponse.stack = this.stack;
      errorResponse.context = this.logContext;
    }

    return errorResponse;
  }

  /**
   * Serializes the error to JSON, including stack trace in development mode
   */
  toJSON(): Record<string, unknown> {
    const errorJson: Record<string, unknown> = {
      message: this.message,
      status: this.status,
      errorId: this.errorId,
      type: this.type,
      details: this.details,
    };

    // Include stack trace only in development mode
    if (ErrorConfig.isDevelopment) {
      errorJson.stack = this.stack;
      errorJson.context = this.logContext;
    }

    return errorJson;
  }
}
