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
- Integration with Zod for validation errors
- AWS Cognito error handling

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

## Integrations

### Zod Integration

The library provides built-in support for transforming [Zod](https://github.com/colinhacks/zod) validation errors into ValidationError instances:

```typescript
import { z } from 'zod';
import { isZodError, fromZodError } from '@sentientarts/errors';

// Define a Zod schema
const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

try {
  // Parse/validate data with Zod
  const result = userSchema.parse({ email: 'invalid', password: '123' });
  return result;
} catch (error) {
  // Check if it's a Zod error and transform it
  if (isZodError(error)) {
    // Transform Zod error into a ValidationError
    throw fromZodError(error, 'Invalid user data');
  }
  throw error;
}
```

The transformed error will include:

- Status code 422 (Unprocessable Entity)
- Properly formatted validation details for each field
- Paths in dot notation (e.g., 'user.email')
- Original error messages from Zod

### AWS Cognito Integration

The library provides support for handling AWS Cognito errors and converting them into appropriate error types:

```typescript
import { isCognitoError, fromCognitoError } from '@sentientarts/errors';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });

async function registerUser(email: string, password: string) {
  try {
    const command = new SignUpCommand({
      ClientId: 'your-client-id',
      Username: email,
      Password: password,
    });

    return await cognitoClient.send(command);
  } catch (error) {
    // Check if it's a Cognito error
    if (isCognitoError(error)) {
      // Transform to appropriate application error
      throw fromCognitoError(error);
    }
    throw error;
  }
}
```

The transformer handles common Cognito error codes:

| Cognito Error Code        | Transformed To    | HTTP Status |
| ------------------------- | ----------------- | ----------- |
| NotAuthorizedException    | UnauthorizedError | 401         |
| UserNotFoundException     | NotFoundError     | 404         |
| AccessDeniedException     | ForbiddenError    | 403         |
| UsernameExistsException   | ConflictError     | 409         |
| InvalidParameterException | ValidationError   | 422         |
| LimitExceededException    | RateLimitError    | 429         |
| (Other/Unknown)           | InternalError     | 500         |

The original Cognito error is preserved in the `logContext` property for debugging purposes.

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
