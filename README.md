# @entix/errors

A TypeScript error handling library for Entix projects that provides standardized error classes with improved type safety and flexibility.

## Installation

```bash
npm install @entix/errors
```

## Features

- Standardized error handling with a consistent interface
- Full TypeScript support with proper typings
- Environment-aware error serialization (stack traces only in development)
- Client-safe error responses
- Flexible error details for validation errors
- Customizable error codes and HTTP status codes

## Usage

```typescript
import {
  BaseError,
  CustomError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ErrorConfig,
} from '@entix/errors';

// Set development mode for stack traces
ErrorConfig.setDevelopmentMode(process.env.NODE_ENV !== 'production');

// Base error with flexible options
throw new BaseError({
  message: 'Something went wrong',
  status: 500,
  details: [{ field: 'id', message: 'Invalid ID format' }],
  logContext: { requestId: '12345' },
});

// Custom error with simpler interface
throw new CustomError('Something went wrong', {
  status: 500,
  code: 'INTERNAL_ERROR',
  isOperational: true,
});

// Validation error with details
throw new ValidationError('Validation failed', [
  { field: 'email', message: 'Email is required' },
  { field: 'password', message: 'Password must be at least 8 characters' },
]);

// Not found error
throw new NotFoundError('User not found', 'user');

// Unauthorized error
throw new UnauthorizedError('Invalid credentials');
```

## Error Classes

### BaseError

Advanced base error class with flexible configuration.

```typescript
new BaseError(options);
// or
new BaseError(message);
```

- `message`: Error message
- `status`: HTTP status code (default: 500)
- `details`: Array of error details
- `logContext`: Additional context for logging
- `expose`: Whether to expose error details to clients (default: true for 4xx, false for 5xx)
- `cause`: Original error that caused this error

### CustomError

Simplified error class that extends BaseError.

```typescript
new CustomError(message, options);
```

- `message`: Error message
- `options.status`: HTTP status code (default: 500)
- `options.code`: Error code for programmatic identification (default: 'INTERNAL_SERVER_ERROR')
- `options.isOperational`: Whether this is an operational error that can be handled (default: true)

### ValidationError

Error for validation failures.

```typescript
new ValidationError(message, errors);
```

- `message`: Error message
- `errors`: Array of validation errors with field and message (default: [])

### NotFoundError

Error for resource not found situations.

```typescript
new NotFoundError(message, resource);
```

- `message`: Error message (default: 'Resource not found')
- `resource`: The type of resource that was not found (default: 'resource')

### UnauthorizedError

Error for unauthorized access attempts.

```typescript
new UnauthorizedError(message);
```

- `message`: Error message (default: 'Unauthorized')

## Environment Configuration

To control when stack traces are included in error JSON representations:

```typescript
import { ErrorConfig } from '@entix/errors';

// Enable stack traces in development
ErrorConfig.setDevelopmentMode(process.env.NODE_ENV !== 'production');
```

## Error Response Format

When using the `toResponse()` method, errors are transformed into a client-safe format:

```typescript
{
  status: 400,
  type: 'validation',
  message: 'Validation failed',
  details: [
    { field: 'email', message: 'Email is required' }
  ]
}
```

## License

MIT
