import { AppError, ErrorConfig } from '@/utils/app-error.util';

describe('AppError', () => {
  beforeEach(() => {
    // Reset development mode for each test
    ErrorConfig.setDevelopmentMode(false);
  });

  it('should create an error with a message string', () => {
    const error = new AppError('Test error');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Test error');
    expect(error.status).toBe(500);
    expect(error.expose).toBe(false);
    expect(error.details).toEqual([]);
    expect(error.logContext).toEqual({});
    expect(error.type).toBe('app');
    expect(error.stack).toBeDefined();
    expect(error.errorId).toBeDefined();
  });

  it('should create an error with options object', () => {
    const error = new AppError({
      message: 'Test error with options',
      status: 400,
      details: [{ path: 'field', message: 'Field is required' }],
      logContext: { requestId: '123' },
    });

    expect(error.message).toBe('Test error with options');
    expect(error.status).toBe(400);
    expect(error.expose).toBe(true);
    expect(error.details).toEqual([{ path: 'field', message: 'Field is required' }]);
    expect(error.logContext).toEqual({ requestId: '123' });
  });

  it('should set expose to true for 4xx errors by default', () => {
    const error = new AppError({ status: 404 });
    expect(error.expose).toBe(true);
  });

  it('should set expose to false for 5xx errors by default', () => {
    const error = new AppError({ status: 500 });
    expect(error.expose).toBe(false);
  });

  it('should override default expose value when provided', () => {
    const error1 = new AppError({ status: 404, expose: false });
    const error2 = new AppError({ status: 500, expose: true });

    expect(error1.expose).toBe(false);
    expect(error2.expose).toBe(true);
  });

  describe('toResponse', () => {
    it('should return a client-safe response object', () => {
      const error = new AppError({
        message: 'Test error',
        status: 400,
        details: [{ path: 'field', message: 'Field is required' }],
      });

      const response = error.toResponse();

      expect(response).toEqual({
        status: 400,
        type: 'app',
        message: 'Test error',
        details: [{ path: 'field', message: 'Field is required' }],
      });
    });

    it('should not expose message for 5xx errors', () => {
      const error = new AppError({
        message: 'Internal error details',
        status: 500,
      });

      const response = error.toResponse();

      expect(response.message).not.toBe('Internal error details');
      expect(response.message).toBe('Internal Server Error');
      expect(response.errorId).toBeDefined();
    });

    it('should include stack trace in development mode', () => {
      ErrorConfig.setDevelopmentMode(true);

      const error = new AppError('Test error');
      const response = error.toResponse();

      expect(response.stack).toBeDefined();
      expect(response.context).toEqual({});
    });
  });

  describe('toJSON', () => {
    it('should serialize error to JSON', () => {
      const error = new AppError('Test error');
      const json = error.toJSON();

      expect(json).toEqual({
        message: 'Test error',
        status: 500,
        errorId: error.errorId,
        type: 'app',
        details: [],
      });
    });

    it('should include stack trace in development mode', () => {
      ErrorConfig.setDevelopmentMode(true);

      const error = new AppError('Test error');
      const json = error.toJSON();

      expect(json.stack).toBeDefined();
      expect(json.context).toEqual({});
    });
  });
});
