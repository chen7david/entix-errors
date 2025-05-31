import {
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  RateLimitError,
  InternalError,
  BadRequestError,
} from '@/errors';

/**
 * Interface representing a Cognito error structure
 */
export interface CognitoErrorStructure {
  name: string;
  message: string;
  $metadata?: {
    httpStatusCode?: number;
  };
  code?: string;
  [key: string]: unknown;
}

/**
 * Checks if an unknown error is a Cognito error
 * @param error - The error to check
 * @returns Boolean indicating if the error is a Cognito error
 */
export function isCognitoError(error: unknown): error is CognitoErrorStructure {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    'message' in error &&
    ((error as { $metadata?: unknown }).$metadata !== undefined ||
      typeof (error as { code?: string }).code === 'string')
  );
}

/**
 * Maps common Cognito error codes to the appropriate error class
 * @param error - The Cognito error to transform
 * @returns An instance of an appropriate error class
 */
export function fromCognitoError(
  error: CognitoErrorStructure,
):
  | UnauthorizedError
  | ValidationError
  | NotFoundError
  | ForbiddenError
  | ConflictError
  | RateLimitError
  | InternalError
  | BadRequestError {
  const errorCode = error.code || '';
  const statusCode = error.$metadata?.httpStatusCode;
  const message = error.message;

  // Handle specific Cognito error codes
  switch (errorCode) {
    // Authentication and authorization errors
    case 'NotAuthorizedException':
      return new UnauthorizedError({
        message: message || 'Invalid credentials or user not authorized',
        logContext: { cognitoError: error },
      });

    case 'UserNotConfirmedException':
      return new UnauthorizedError({
        message: message || 'User account is not confirmed',
        logContext: { cognitoError: error },
      });

    case 'PasswordResetRequiredException':
      return new UnauthorizedError({
        message: message || 'Password reset is required',
        logContext: { cognitoError: error },
      });

    // Resource existence errors
    case 'UserNotFoundException':
    case 'ResourceNotFoundException':
      return new NotFoundError({
        message: message || 'Resource not found',
        logContext: { cognitoError: error },
      });

    // Permission errors
    case 'AccessDeniedException':
      return new ForbiddenError({
        message: message || 'Access denied',
        logContext: { cognitoError: error },
      });

    // Conflict errors
    case 'UsernameExistsException':
    case 'AliasExistsException':
    case 'GroupExistsException':
      return new ConflictError({
        message: message || 'Resource already exists',
        logContext: { cognitoError: error },
      });

    // Validation errors
    case 'InvalidParameterException':
    case 'InvalidPasswordException':
    case 'CodeMismatchException':
    case 'ExpiredCodeException':
    case 'CodeDeliveryFailureException':
      return new ValidationError({
        message: message || 'Validation error',
        details: [{ path: 'input', message: message || 'Invalid input' }],
        logContext: { cognitoError: error },
      });

    // Rate limiting
    case 'LimitExceededException':
    case 'TooManyRequestsException':
      return new RateLimitError({
        message: message || 'Too many requests',
        logContext: { cognitoError: error },
      });

    // Default case - use HTTP status code if available
    default:
      if (statusCode) {
        if (statusCode >= 400 && statusCode < 500) {
          if (statusCode === 400) {
            return new BadRequestError({
              message: message || 'Bad request',
              logContext: { cognitoError: error },
            });
          } else if (statusCode === 401) {
            return new UnauthorizedError({
              message: message || 'Unauthorized',
              logContext: { cognitoError: error },
            });
          } else if (statusCode === 403) {
            return new ForbiddenError({
              message: message || 'Forbidden',
              logContext: { cognitoError: error },
            });
          } else if (statusCode === 404) {
            return new NotFoundError({
              message: message || 'Not found',
              logContext: { cognitoError: error },
            });
          } else if (statusCode === 409) {
            return new ConflictError({
              message: message || 'Conflict',
              logContext: { cognitoError: error },
            });
          } else if (statusCode === 429) {
            return new RateLimitError({
              message: message || 'Too many requests',
              logContext: { cognitoError: error },
            });
          } else {
            return new BadRequestError({
              message: message || 'Client error',
              logContext: { cognitoError: error },
            });
          }
        } else {
          return new InternalError({
            message: message || 'Server error',
            logContext: { cognitoError: error },
          });
        }
      }

      // Fallback for unknown error codes
      return new InternalError({
        message: 'An error occurred with the authentication service',
        logContext: { cognitoError: error },
      });
  }
}
