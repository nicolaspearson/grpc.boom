# gRPC Boom

A gRPC implementation of the awesome [Boom](https://github.com/hapijs/boom) library to help create gRPC-friendly error objects.

### Installation

```
npm install grpc-boom --save
```

### Example

```typescript
import GrpcBoom from 'grpc-boom';

function sayHelloStrict(call, callback) {
	if (call.request.Name.length >= 10) {
		return callback(GrpcBoom.invalidArgument('Length of `Name` cannot be more than 10 characters'));
	}
	callback(null, { Result: 'Hey, ' + call.request.Name + '!' });
}
```

Generates the following response payload:

```json
{
	"code": 3,
	"error": "INVALID_ARGUMENT",
	"message": "Length of `Name` cannot be more than 10 characters"
}
```

<!-- toc -->

- [GrpcBoom](#boom)
  - [`reformat(debug)`](#reformatdebug)
  - [Helper Methods](#helper-methods)
    - [`new GrpcBoom(message, [options])`](#new-boommessage-options)
    - [`boomify(err, [options])`](#boomifyerr-options)
    - [`isBoom(err)`](#isboomerr)
  - [Supported gRPC Errors](#supported-grpc-errors)
    - [`GrpcBoom.cancelled([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.unknown([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.invalidArgument([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.deadlineExceeded([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.notFound([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.alreadyExists([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.permissionDenied([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.resourceExhausted([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.failedPrecondition([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.aborted([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.outOfRange([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.unimplemented([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.internal([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.unavailable([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.dataLoss([message], [data])`](#grpcboomcancelledmessage-data) - [`GrpcBoom.unauthenticated([message], [data])`](#grpcboomcancelledmessage-data)

<!-- tocstop -->

**gRPC Boom** provides a set of utilities for returning gRPC errors. Each utility returns a `GrpcBoom`
error response object which includes the following properties:

- `isBoom` - if `true`, indicates this is a `GrpcBoom` object instance. Note that this boolean should
  only be used if the error is an instance of `Error`. If it is not certain, use `GrpcBoom.isBoom()`
  instead.
- `message` - the error message.
- `typeof` - the constructor used to create the error (e.g. `GrpcBoom.invalidArgument`).
- `output` - the formatted response. Can be directly manipulated after object construction to return a custom
  error response. Allowed root keys:
  - `code` - the gRPC status code.
  - `payload` - the formatted object used as the response payload (stringified). Can be directly manipulated but any
    changes will be lost
    if `reformat()` is called. Any content allowed and by default includes the following content:
    - `code` - the gRPC status code, derived from `error.output.code`.
    - `error` - the gRPC status message (e.g. 'Bad Request', 'Internal Server Error') derived from `code`.
    - `message` - the error message derived from `error.message`.
- inherited `Error` properties.

The `GrpcBoom` object also supports the following method:

### `reformat(debug)`

Rebuilds `error.output` using the other object properties where:

- `debug` - a Boolean that, when `true`, causes Internal Server Error messages to be left in tact. Defaults to `false`, meaning that Internal Server Error messages are redacted.

Note that `GrpcBoom` object will return `true` when used with `instanceof GrpcBoom`, but do not use the
`GrpcBoom` prototype (they are either plain `Error` or the error prototype passed in). This means
`GrpcBoom` objects should only be tested using `instanceof GrpcBoom` or `GrpcBoom.isBoom()` but not by looking
at the prototype or contructor information. This limitation is to avoid manipulating the prototype
chain which is very slow.

## Helper Methods

### `new GrpcBoom(message, [options])`

Creates a new `GrpcBoom` object using the provided `message` and then calling
[`boomify()`](#boomifyerr-options) to decorate the error with the `GrpcBoom` properties, where:

- `message` - the error message. If `message` is an error, it is the same as calling
  [`boomify()`](#boomifyerr-options) directly.
- `options` - and optional object where: - `code` - the gRPC status code. Defaults to `13` if no status code is already set.
  - `data` - additional error information (assigned to `error.data`).
  - `decorate` - an option with extra properties to set on the error object.
  - `ctor` - constructor reference used to crop the exception call stack output.
  - if `message` is an error object, also supports the other [`boomify()`](#boomifyerr-options)
    options.

### `boomify(err, [options])`

Decorates an error with the `GrpcBoom` properties where:

- `err` - the `Error` object to decorate.
- `options` - optional object with the following optional settings: - `code` - the gRPC status code. Defaults to `13` if no status code is already set and `err` is not a `GrpcBoom` object. - `message` - error message string. If the error already has a message, the provided `message` is added as a prefix.
  Defaults to no message.
  - `decorate` - an option with extra properties to set on the error object. - `override` - if `false`, the `err` provided is a `GrpcBoom` object, and a `code` or `message` are provided,
    the values are ignored. Defaults to `true` (apply the provided `code` and `message` options to the error
    regardless of its type, `Error` or `GrpcBoom` object).

```typescript
const error = new Error('Unexpected input');
GrpcBoom.boomify(error, { code: 3 });
```

### `isBoom(err)`

Identifies whether an error is a `GrpcBoom` object. Same as calling `instanceof GrpcBoom`.

## Supported gRPC Errors

### `GrpcBoom.cancelled([message], [data])`

Returns a `1` Cancelled error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.cancelled('Operation was cancelled');
```

Generates the following response payload:

```json
{
	"code": 1,
	"error": "CANCELLED",
	"message": "Operation was cancelled"
}
```

### `GrpcBoom.unknown([message], [data])`

Returns a `2` Unknown error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.unknown('Unknown error');
```

Generates the following response payload:

```json
{
	"code": 2,
	"error": "UNKNOWN",
	"message": "Unknown error"
}
```

### `GrpcBoom.invalidArgument([message], [data])`

Returns a `3` Invalid Argument error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.invalidArgument('Invalid query');
```

Generates the following response payload:

```json
{
	"code": 3,
	"error": "INVALID_ARGUMENT",
	"message": "Invalid query"
}
```

### `GrpcBoom.deadlineExceeded([message], [data])`

Returns a `4` Deadline Exceeded error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.deadlineExceeded('Deadline expired before operation could complete');
```

Generates the following response payload:

```json
{
	"code": 4,
	"error": "DEADLINE_EXCEEDED",
	"message": "Deadline expired before operation could complete"
}
```

### `GrpcBoom.notFound([message], [data])`

Returns a `5` Not Found error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.notFound('Requested entity was not found');
```

Generates the following response payload:

```json
{
	"code": 5,
	"error": "NOT_FOUND",
	"message": "Requested entity was not found"
}
```

### `GrpcBoom.alreadyExists([message], [data])`

Returns a `6` Already Exists error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.alreadyExists('Requested entity already exists');
```

Generates the following response payload:

```json
{
	"code": 6,
	"error": "ALREADY_EXISTS",
	"message": "Requested entity already exists"
}
```

### `GrpcBoom.permissionDenied([message], [data])`

Returns a `7` Permission Denied error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.permissionDenied('The caller does not have permission to execute the specified operation');
```

Generates the following response payload:

```json
{
	"code": 7,
	"error": "PERMISSION_DENIED",
	"message": "The caller does not have permission to execute the specified operation"
}
```

### `GrpcBoom.resourceExhausted([message], [data])`

Returns a `8` Resource Exhausted error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.resourceExhausted('Resource has been exhausted');
```

Generates the following response payload:

```json
{
	"code": 8,
	"error": "RESOURCE_EXHAUSTED",
	"message": "Resource has been exhausted"
}
```

### `GrpcBoom.failedPrecondition([message], [data])`

Returns a `9` Failed Precondition error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.failedPrecondition(
	'Operation was rejected because the system is not in a state required for the operations execution'
);
```

Generates the following response payload:

```json
{
	"code": 9,
	"error": "FAILED_PRECONDITION",
	"message": "Operation was rejected because the system is not in a state required for the operations execution"
}
```

### `GrpcBoom.aborted([message], [data])`

Returns a `10` Aborted error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.aborted('The operation was aborted');
```

Generates the following response payload:

```json
{
	"code": 10,
	"error": "ABORTED",
	"message": "The operation was aborted"
}
```

### `GrpcBoom.outOfRange([message], [data])`

Returns a `11` Out of Range error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.outOfRange('Operation was attempted past the valid range');
```

Generates the following response payload:

```json
{
	"code": 11,
	"error": "OUT_OF_RANGE",
	"message": "Operation was attempted past the valid range"
}
```

### `GrpcBoom.unimplemented([message], [data])`

Returns a `12` Unimplemented error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.unimplemented('Operation is not implemented or not supported/enabled');
```

Generates the following response payload:

```json
{
	"code": 12,
	"error": "UNIMPLEMENTED",
	"message": "Operation is not implemented or not supported/enabled"
}
```

### `GrpcBoom.internal([message], [data])`

Returns a `13` Internal error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.internal('Internal errors');
```

Generates the following response payload:

```json
{
	"code": 13,
	"error": "INTERNAL",
	"message": "Internal errors"
}
```

### `GrpcBoom.unavailable([message], [data])`

Returns a `14` Unavailable error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.unavailable('The service is currently unavailable');
```

Generates the following response payload:

```json
{
	"code": 14,
	"error": "UNAVAILABLE",
	"message": "The service is currently unavailable"
}
```

### `GrpcBoom.dataLoss([message], [data])`

Returns a `15` Data Loss error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.dataLoss('Unrecoverable data loss or corruption');
```

Generates the following response payload:

```json
{
	"code": 15,
	"error": "DATA_LOSS",
	"message": "Unrecoverable data loss or corruption"
}
```

### `GrpcBoom.unauthenticated([message], [data])`

Returns a `16` Unauthenticated error where:

- `message` - optional message.
- `data` - optional additional error data.

```js
GrpcBoom.unauthenticated(
	'The request does not have valid authentication credentials for the operation'
);
```

Generates the following response payload:

```json
{
	"code": 16,
	"error": "UNAUTHENTICATED",
	"message": "The request does not have valid authentication credentials for the operation"
}
```
