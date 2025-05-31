import {
  NotFoundError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ServiceError,
  InternalError,
  RateLimitError,
  CustomError,
} from '@/errors';
import { AppError } from '@/utils/app-error.util';

describe('Specific Error Classes', () => {
  describe('NotFoundError', () => {
    it('should create with default status code 404', () => {
      const error = new NotFoundError('Resource not found');

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Resource not found');
      expect(error.status).toBe(404);
      expect(error.expose).toBe(true);
      expect(error.type).toBe('notfound');
    });

    it('should accept options object', () => {
      const error = new NotFoundError({
        message: 'User not found',
        details: [{ path: 'id', message: 'User with this ID does not exist' }],
      });

      expect(error.message).toBe('User not found');
      expect(error.status).toBe(404);
      expect(error.details).toHaveLength(1);
    });
  });

  describe('BadRequestError', () => {
    it('should create with default status code 400', () => {
      const error = new BadRequestError('Bad request');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Bad request');
      expect(error.status).toBe(400);
      expect(error.expose).toBe(true);
      expect(error.type).toBe('badrequest');
    });
  });

  describe('ValidationError', () => {
    it('should create with default status code 422', () => {
      const error = new ValidationError('Validation failed');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Validation failed');
      expect(error.status).toBe(422);
      expect(error.expose).toBe(true);
      expect(error.type).toBe('validation');
    });

    it('should accept validation details', () => {
      const error = new ValidationError({
        message: 'Validation failed',
        details: [
          { path: 'email', message: 'Email is required' },
          { path: 'password', message: 'Password must be at least 8 characters' },
        ],
      });

      expect(error.details).toHaveLength(2);
      expect(error.details[0].path).toBe('email');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create with default status code 401', () => {
      const error = new UnauthorizedError('Unauthorized');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Unauthorized');
      expect(error.status).toBe(401);
      expect(error.expose).toBe(true);
      expect(error.type).toBe('unauthorized');
    });
  });

  describe('ForbiddenError', () => {
    it('should create with default status code 403', () => {
      const error = new ForbiddenError('Forbidden');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Forbidden');
      expect(error.status).toBe(403);
      expect(error.expose).toBe(true);
      expect(error.type).toBe('forbidden');
    });
  });

  describe('ConflictError', () => {
    it('should create with default status code 409', () => {
      const error = new ConflictError('Conflict');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Conflict');
      expect(error.status).toBe(409);
      expect(error.expose).toBe(true);
      expect(error.type).toBe('conflict');
    });
  });

  describe('ServiceError', () => {
    it('should create with default status code 503 and expose=false', () => {
      const error = new ServiceError('Service unavailable');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Service unavailable');
      expect(error.status).toBe(503);
      expect(error.expose).toBe(false);
      expect(error.type).toBe('service');
    });

    it('should not allow expose to be overridden to true', () => {
      const error = new ServiceError({ message: 'Service error', expose: true });

      expect(error.expose).toBe(false);
    });
  });

  describe('InternalError', () => {
    it('should create with default status code 500 and expose=false', () => {
      const error = new InternalError('Internal server error');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Internal server error');
      expect(error.status).toBe(500);
      expect(error.expose).toBe(false);
      expect(error.type).toBe('internal');
    });

    it('should not allow expose to be overridden to true', () => {
      const error = new InternalError({ message: 'Server error', expose: true });

      expect(error.expose).toBe(false);
    });
  });

  describe('RateLimitError', () => {
    it('should create with default status code 429', () => {
      const error = new RateLimitError('Too many requests');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Too many requests');
      expect(error.status).toBe(429);
      expect(error.expose).toBe(true);
      expect(error.type).toBe('ratelimit');
    });
  });

  describe('CustomError', () => {
    it('should create with default values', () => {
      const error = new CustomError('Custom error');

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toBe('Custom error');
      expect(error.status).toBe(500);
      expect(error.code).toBe('INTERNAL_SERVER_ERROR');
      expect(error.isOperational).toBe(true);
      expect(error.expose).toBe(true);
    });

    it('should accept custom values', () => {
      const error = new CustomError('Custom error', {
        status: 400,
        code: 'CUSTOM_ERROR',
        isOperational: false,
      });

      expect(error.message).toBe('Custom error');
      expect(error.status).toBe(400);
      expect(error.code).toBe('CUSTOM_ERROR');
      expect(error.isOperational).toBe(false);
      expect(error.expose).toBe(false);
    });
  });
});
