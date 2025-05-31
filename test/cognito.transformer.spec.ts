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
import { isCognitoError, fromCognitoError } from '@/transformers/cognito.transformer';

describe('Cognito Transformer', () => {
  describe('isCognitoError', () => {
    it('should return true for a Cognito error with $metadata', () => {
      const cognitoError = {
        name: 'NotAuthorizedException',
        message: 'User not authenticated',
        $metadata: {
          httpStatusCode: 401,
        },
      };

      expect(isCognitoError(cognitoError)).toBe(true);
    });

    it('should return true for a Cognito error with code', () => {
      const cognitoError = {
        name: 'InvalidParameterException',
        message: 'Invalid parameter',
        code: 'InvalidParameterException',
      };

      expect(isCognitoError(cognitoError)).toBe(true);
    });

    it('should return false for a non-Cognito error object', () => {
      expect(isCognitoError(new Error('Regular error'))).toBe(false);
      expect(isCognitoError({ message: 'Missing name property' })).toBe(false);
      expect(isCognitoError({ name: 'Missing message property' })).toBe(false);
      expect(isCognitoError(null)).toBe(false);
      expect(isCognitoError(undefined)).toBe(false);
    });
  });

  describe('fromCognitoError', () => {
    it('should transform NotAuthorizedException to UnauthorizedError', () => {
      const cognitoError = {
        name: 'NotAuthorizedException',
        message: 'Incorrect username or password',
        code: 'NotAuthorizedException',
      };

      const appError = fromCognitoError(cognitoError);

      expect(appError).toBeInstanceOf(UnauthorizedError);
      expect(appError.message).toBe('Incorrect username or password');
      expect(appError.status).toBe(401);
      expect(appError.logContext).toHaveProperty('cognitoError', cognitoError);
    });

    it('should transform UserNotFoundException to NotFoundError', () => {
      const cognitoError = {
        name: 'UserNotFoundException',
        message: 'User does not exist',
        code: 'UserNotFoundException',
      };

      const appError = fromCognitoError(cognitoError);

      expect(appError).toBeInstanceOf(NotFoundError);
      expect(appError.message).toBe('User does not exist');
      expect(appError.status).toBe(404);
    });

    it('should transform AccessDeniedException to ForbiddenError', () => {
      const cognitoError = {
        name: 'AccessDeniedException',
        message: 'Access denied',
        code: 'AccessDeniedException',
      };

      const appError = fromCognitoError(cognitoError);

      expect(appError).toBeInstanceOf(ForbiddenError);
      expect(appError.message).toBe('Access denied');
      expect(appError.status).toBe(403);
    });

    it('should transform UsernameExistsException to ConflictError', () => {
      const cognitoError = {
        name: 'UsernameExistsException',
        message: 'Username already exists',
        code: 'UsernameExistsException',
      };

      const appError = fromCognitoError(cognitoError);

      expect(appError).toBeInstanceOf(ConflictError);
      expect(appError.message).toBe('Username already exists');
      expect(appError.status).toBe(409);
    });

    it('should transform InvalidParameterException to ValidationError', () => {
      const cognitoError = {
        name: 'InvalidParameterException',
        message: 'Password must have uppercase characters',
        code: 'InvalidParameterException',
      };

      const appError = fromCognitoError(cognitoError);

      expect(appError).toBeInstanceOf(ValidationError);
      expect(appError.message).toBe('Password must have uppercase characters');
      expect(appError.status).toBe(422);
      expect(appError.details).toHaveLength(1);
      expect(appError.details[0].path).toBe('input');
      expect(appError.details[0].message).toBe('Password must have uppercase characters');
    });

    it('should transform LimitExceededException to RateLimitError', () => {
      const cognitoError = {
        name: 'LimitExceededException',
        message: 'Too many requests',
        code: 'LimitExceededException',
      };

      const appError = fromCognitoError(cognitoError);

      expect(appError).toBeInstanceOf(RateLimitError);
      expect(appError.message).toBe('Too many requests');
      expect(appError.status).toBe(429);
    });

    it('should fallback to HTTP status code if no recognized error code', () => {
      const cognitoError = {
        name: 'SomeUnknownError',
        message: 'Something went wrong',
        $metadata: {
          httpStatusCode: 400,
        },
      };

      const appError = fromCognitoError(cognitoError);

      expect(appError).toBeInstanceOf(BadRequestError);
      expect(appError.message).toBe('Something went wrong');
      expect(appError.status).toBe(400);
    });

    it('should use InternalError as fallback for unknown errors', () => {
      const cognitoError = {
        name: 'UnknownError',
        message: 'Unknown error occurred',
        code: 'UnknownError',
      };

      const appError = fromCognitoError(cognitoError);

      expect(appError).toBeInstanceOf(InternalError);
      expect(appError.message).toBe('An error occurred with the authentication service');
      expect(appError.status).toBe(500);
    });

    it('should use InternalError for server-side errors based on status code', () => {
      const cognitoError = {
        name: 'ServiceError',
        message: 'Internal server error',
        $metadata: {
          httpStatusCode: 500,
        },
      };

      const appError = fromCognitoError(cognitoError);

      expect(appError).toBeInstanceOf(InternalError);
      expect(appError.message).toBe('Internal server error');
      expect(appError.status).toBe(500);
    });
  });
});
