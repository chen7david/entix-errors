import { UnauthorizedError } from '@/errors/unauthorized-error';
import { CustomError } from '@/errors/custom-error';

describe('UnauthorizedError', () => {
  it('should create an unauthorized error with default values', () => {
    const error = new UnauthorizedError();

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(error.message).toBe('Unauthorized');
    expect(error.status).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
  });

  it('should create an unauthorized error with custom message', () => {
    const error = new UnauthorizedError('Invalid credentials');

    expect(error.message).toBe('Invalid credentials');
    expect(error.status).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
  });
});
