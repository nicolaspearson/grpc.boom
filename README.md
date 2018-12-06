# gRPC Boom

An implementation of the awesome [Boom](https://github.com/hapijs/boom) library to help create gRPC-friendly error objects. It also supports gRPC `Metadata`, see examples below for more details.

### Installation

```
npm install grpc-boom --save
```

### Example

```typescript
import GrpcBoom from 'grpc-boom';

function sayHelloStrict(call, callback) {
	if (call.request.Name.length >= 10) {
		return callback(GrpcBoom.invalidArgument('Length of "Name" cannot be more than 10 characters'), null);
	}
	callback(null, { Result: 'Hey, ' + call.request.Name + '!' });
}
```

Generates the following response payload:

```json
{
	"code": 3,
	"details": "INVALID_ARGUMENT",
	"message": "Length of 'Name' cannot be more than 10 characters"
}
```

<!-- toc -->

- [GrpcBoom](#boom)
  - [`reformat(debug)`](#reformatdebug)
  - [Helper Methods](#helper-methods)
    - [`new GrpcBoom(message, [options])`](#new-boommessage-options)
    - [`boomify(err, [options])`](#boomifyerr-options)
  - [Supported gRPC Errors](#supported-grpc-errors)
    - [`GrpcBoom.cancelled([message], [metadata])`](#grpcboomcancelledmessage-metadata)
	- [`GrpcBoom.unknown([message], [metadata])`](#grpcboomunknownmessage-metadata)
	- [`GrpcBoom.invalidArgument([message], [metadata])`](#grpcboominvalidargumentmessage-metadata)
	- [`GrpcBoom.deadlineExceeded([message], [metadata])`](#grpcboomdeadlineexceededmessage-metadata)
	- [`GrpcBoom.notFound([message], [metadata])`](#grpcboomnotfoundmessage-metadata)
	- [`GrpcBoom.alreadyExists([message], [metadata])`](#grpcboomalreadyexistsmessage-metadata)
	- [`GrpcBoom.permissionDenied([message], [metadata])`](#grpcboompermissiondeniedmessage-metadata)
	- [`GrpcBoom.resourceExhausted([message], [metadata])`](#grpcboomresourceexhaustedmessage-metadata)
	- [`GrpcBoom.failedPrecondition([message], [metadata])`](#grpcboomfailedpreconditionmessage-metadata)
	- [`GrpcBoom.aborted([message], [metadata])`](#grpcboomabortedmessage-metadata)
	- [`GrpcBoom.outOfRange([message], [metadata])`](#grpcboomoutofrangemessage-metadata)
	- [`GrpcBoom.unimplemented([message], [metadata])`](#grpcboomunimplementedmessage-metadata)
	- [`GrpcBoom.internal([message], [metadata])`](#grpcboominternalmessage-metadata)
	- [`GrpcBoom.unavailable([message], [metadata])`](#grpcboomunavailablemessage-metadata)
	- [`GrpcBoom.dataLoss([message], [metadata])`](#grpcboomdatalossmessage-metadata)
	- [`GrpcBoom.unauthenticated([message], [metadata])`](#grpcboomunauthenticatedmessage-metadata)

<!-- tocstop -->

**gRPC Boom** provides a set of utilities for returning gRPC errors. Each utility returns a `GrpcBoom`
error response object which includes the following properties:

- `isBoom` - if `true`, indicates this is a `GrpcBoom` object instance. Note that this boolean should
  only be used if the error is an instance of `Error`.
- `metadata` - additional error information.
- `code` - the gRPC status code.
- `details` - the gRPC status message (e.g. 'INVALID_ARGUMENTS', 'INTERNAL').
- `message` - the error message.
- `typeof` - the constructor used to create the error (e.g. `GrpcBoom.invalidArgument`).
- inherited `Error` properties.

The `GrpcBoom` object also supports the following method:

## Helper Methods

### `new GrpcBoom(message, [options])`

Creates a new `GrpcBoom` object using the provided `message` and then calling
[`boomify()`](#boomifyerr-options) to decorate the error with the `GrpcBoom` properties, where:

- `message` - the error message. If `message` is an error, it is the same as calling
  [`boomify()`](#boomifyerr-options) directly.
- `options` - and optional object where: - `code` - the gRPC status code. Defaults to `13` if no status code is already set.
  - `metadata` - additional error information (assigned to `error.metadata`).
  - `ctor` - constructor reference used to crop the exception call stack output.
  - if `message` is an error object, also supports the other [`boomify()`](#boomifyerr-options)
    options.

### `boomify(err, [options])`

Decorates an error with the `GrpcBoom` properties where:

- `err` - the `Error` object to decorate.
- `options` - optional object with the following optional settings: 
	- `code` - the gRPC status code. Defaults to `13` if no status code is already set and `err` is not a `GrpcBoom` object. 
	- `message` - error message string. If the error already has a message, the provided `message` is added as a prefix.
	Defaults to no message.
	- `metadata` - additional error information (assigned to 
	- `ctor` - constructor reference used to crop the exception call stack output.

```typescript
const error = new Error('Unexpected input');
GrpcBoom.boomify(error, { code: 3 });
```

## Supported gRPC Errors

### `GrpcBoom.cancelled([message], [metadata])`

Returns a `1` Cancelled error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.cancelled('Operation was cancelled');
```

Generates the following response payload:

```json
{
	"code": 1,
	"details": "CANCELLED",
	"message": "Operation was cancelled"
}
```

### `GrpcBoom.unknown([message], [metadata])`

Returns a `2` Unknown error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.unknown('Unknown error');
```

Generates the following response payload:

```json
{
	"code": 2,
	"details": "UNKNOWN",
	"message": "Unknown error"
}
```

### `GrpcBoom.invalidArgument([message], [metadata])`

Returns a `3` Invalid Argument error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.invalidArgument('Invalid query');
```

Generates the following response payload:

```json
{
	"code": 3,
	"details": "INVALID_ARGUMENT",
	"message": "Invalid query"
}
```

### `GrpcBoom.deadlineExceeded([message], [metadata])`

Returns a `4` Deadline Exceeded error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.deadlineExceeded('Deadline expired before operation could complete');
```

Generates the following response payload:

```json
{
	"code": 4,
	"details": "DEADLINE_EXCEEDED",
	"message": "Deadline expired before operation could complete"
}
```

### `GrpcBoom.notFound([message], [metadata])`

Returns a `5` Not Found error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.notFound('Requested entity was not found');
```

Generates the following response payload:

```json
{
	"code": 5,
	"details": "NOT_FOUND",
	"message": "Requested entity was not found"
}
```

### `GrpcBoom.alreadyExists([message], [metadata])`

Returns a `6` Already Exists error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.alreadyExists('Requested entity already exists');
```

Generates the following response payload:

```json
{
	"code": 6,
	"details": "ALREADY_EXISTS",
	"message": "Requested entity already exists"
}
```

### `GrpcBoom.permissionDenied([message], [metadata])`

Returns a `7` Permission Denied error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.permissionDenied('The caller does not have permission to execute the specified operation');
```

Generates the following response payload:

```json
{
	"code": 7,
	"details": "PERMISSION_DENIED",
	"message": "The caller does not have permission to execute the specified operation"
}
```

### `GrpcBoom.resourceExhausted([message], [metadata])`

Returns a `8` Resource Exhausted error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.resourceExhausted('Resource has been exhausted');
```

Generates the following response payload:

```json
{
	"code": 8,
	"details": "RESOURCE_EXHAUSTED",
	"message": "Resource has been exhausted"
}
```

### `GrpcBoom.failedPrecondition([message], [metadata])`

Returns a `9` Failed Precondition error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.failedPrecondition(
	'Operation was rejected because the system is not in a state required for the operations execution'
);
```

Generates the following response payload:

```json
{
	"code": 9,
	"details": "FAILED_PRECONDITION",
	"message": "Operation was rejected because the system is not in a state required for the operations execution"
}
```

### `GrpcBoom.aborted([message], [metadata])`

Returns a `10` Aborted error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.aborted('The operation was aborted');
```

Generates the following response payload:

```json
{
	"code": 10,
	"details": "ABORTED",
	"message": "The operation was aborted"
}
```

### `GrpcBoom.outOfRange([message], [metadata])`

Returns a `11` Out of Range error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.outOfRange('Operation was attempted past the valid range');
```

Generates the following response payload:

```json
{
	"code": 11,
	"details": "OUT_OF_RANGE",
	"message": "Operation was attempted past the valid range"
}
```

### `GrpcBoom.unimplemented([message], [metadata])`

Returns a `12` Unimplemented error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.unimplemented('Operation is not implemented or not supported/enabled');
```

Generates the following response payload:

```json
{
	"code": 12,
	"details": "UNIMPLEMENTED",
	"message": "Operation is not implemented or not supported/enabled"
}
```

### `GrpcBoom.internal([message], [metadata])`

Returns a `13` Internal error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.internal('Internal errors');
```

Generates the following response payload:

```json
{
	"code": 13,
	"details": "INTERNAL",
	"message": "Internal errors"
}
```

### `GrpcBoom.unavailable([message], [metadata])`

Returns a `14` Unavailable error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.unavailable('The service is currently unavailable');
```

Generates the following response payload:

```json
{
	"code": 14,
	"details": "UNAVAILABLE",
	"message": "The service is currently unavailable"
}
```

### `GrpcBoom.dataLoss([message], [metadata])`

Returns a `15` Data Loss error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.dataLoss('Unrecoverable data loss or corruption');
```

Generates the following response payload:

```json
{
	"code": 15,
	"details": "DATA_LOSS",
	"message": "Unrecoverable data loss or corruption"
}
```

### `GrpcBoom.unauthenticated([message], [metadata])`

Returns a `16` Unauthenticated error where:

- `message` - optional message.
- `metadata` - optional additional error metadata.

```js
GrpcBoom.unauthenticated(
	'The request does not have valid authentication credentials for the operation'
);
```

Generates the following response payload:

```json
{
	"code": 16,
	"details": "UNAUTHENTICATED",
	"message": "The request does not have valid authentication credentials for the operation"
}
```