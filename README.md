# Sentient Arts Errors

A TypeScript error handling library for Sentient Arts projects that provides standardized error classes with improved type safety and flexibility.

## Installation

```bash
npm install @sentientarts/errors
```

## Features

- Standardized error handling with a consistent interface
- Full TypeScript support with proper typings
- Environment-aware error serialization (stack traces only in development)
- Client-safe error responses
- Flexible error details for validation errors
- Customizable error codes and HTTP status codes
- Constructor overloading for all error classes

## Quick Start

```typescript
import { AppError, ErrorConfig, ValidationError } from '@sentientarts/errors';

// Set development mode for detailed errors
ErrorConfig.setDevelopmentMode(process.env.NODE_ENV !== 'production');

// Basic error handling
try {
  // Some operation that might fail
  throw new ValidationError('Invalid input data');
} catch (error) {
  if (error instanceof AppError) {
    console.log(error.toResponse()); // Client-safe response
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Error Classes

### AppError (Base Error)

The base error class with flexible configuration options.

```typescript
// Simple constructor
new AppError('Something went wrong');

// With options
new AppError({
  message: 'Something went wrong',
  status: 500,
  details: [{ path: 'id', message: 'Invalid ID format' }],
  logContext: { requestId: '12345' },
  expose: false,
});
```

### Specialized Error Classes

#### HTTP Status Error Classes

The library provides a set of specialized error classes for common HTTP status codes:

- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `ValidationError` (422)
- `RateLimitError` (429)
- `InternalError` (500)
- `ServiceError` (503)

All specialized errors support constructor overloading:

```typescript
// Simple constructor with message
new NotFoundError('User not found');

// With options object
new NotFoundError({
  message: 'User not found',
  details: [{ path: 'id', message: 'User with ID 123 does not exist' }],
  logContext: { userId: '123' },
});
```

#### CustomError

The `CustomError` class provides additional properties for error classification:

```typescript
new CustomError('Permission denied', {
  status: 403,
  isOperational: true,
});
```

## Error Configuration

Control when stack traces are included in error responses:

```typescript
import { ErrorConfig } from '@sentientarts/errors';

// Enable stack traces in development
ErrorConfig.setDevelopmentMode(process.env.NODE_ENV !== 'production');
```

## Client-Safe Response Format

The `toResponse()` method provides a client-safe error representation:

```typescript
{
  status: 400,
  type: 'validation',
  message: 'Validation failed',
  details: [
    { path: 'email', message: 'Email is required' }
  ]
}
```

## Error Serialization

Errors can be serialized to JSON with the `toJSON()` method:

```typescript
const error = new ValidationError('Invalid input');
console.log(JSON.stringify(error)); // Uses toJSON() internally
```

In development mode, stack traces are included in the JSON output.

## License

MIT
