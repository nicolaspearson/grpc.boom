# gRPC Boom

A `gRPC` implementation of the awesome [Boom](https://github.com/hapijs/boom) library to help create gRPC-friendly error objects. It supports gRPC `Metadata`, and can be `customised` as desired. See [Usage](#usage) examples below for more details.

This library has **zero** external dependencies.

## Installation

```
npm install grpc-boom --save
```

## Table of Contents

<!-- toc -->

- [Overview](#overview)
  - [Usage](#usage)
    - [`gRPC Callback`](#grpc-callback)
    - [`Constructor`](#constructor)
    - [`Boomify`](#boomify)
    - [`Convenience`](#convenience)
    - [`Custom`](#custom)
  - [Helper Methods](#helper-methods)
    - [`new GrpcBoom(message, [options])`](#new-grpcboommessage-options)
    - [`boomify(error, [options])`](#boomifyerror-options)
  - [Convenience Methods](#convenience-methods)
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

## Overview

**gRPC Boom** provides a set of utilities for returning gRPC-friendly errors. Each utility returns a `GrpcBoom`
error response object which includes the following properties:

- `isBoom` - if `true`, indicates this is a `GrpcBoom` object instance.
- `metadata` - an optional gRPC `Metadata` object.
- `code` - the gRPC status code.
- `error` - the gRPC status message (e.g. 'INVALID_ARGUMENTS', 'INTERNAL').
- `message` - the error message.

## Usage

Below are some general usage examples:

### `gRPC Callback`

```typescript
import GrpcBoom from 'grpc-boom';

function sayHelloStrict(call, callback) {
  if (call.request.getName().length > 10) {
    return callback(GrpcBoom.invalidArgument('Length of "Name" cannot be more than 10 characters'), null);
  }
  callback(null, { Result: 'Hey, ' + call.request.getName() + '!' });
}
```

Generates the following response payload if "Name" is more than 10 characters:

```json
{
  "code": 3,
  "error": "INVALID_ARGUMENT",
  "message": "Length of 'Name' cannot be more than 10 characters"
}
```

### `Constructor`

See [`new GrpcBoom(message, [options])`](#new-grpcboommessage-options) for details.

```typescript
import { Metadata } from 'grpc';
import GrpcBoom, { Status } from 'grpc-boom';

function example(): GrpcBoom {
  const metadata: Metadata = new Metadata();
  metadata.set('constructed', 'true');
  return new GrpcBoom('Constructor Example!', { 
    code: Status.CANCELLED,
    metadata
  });
}
```

Returns a gRPC Boom object with the following properties:

```json
isBoom: true
message: Constructor Example!
code: 1
error: CANCELLED
metadata: {"_internal_repr":{"constructed":["true"]}}
```

### `Boomify`

See [`boomify(error, [options])`](#boomifyerror-options) for details.

```typescript
import { Metadata } from 'grpc';
import GrpcBoom, { Status } from 'grpc-boom';

function example(): GrpcBoom {
  const metadata: Metadata = new Metadata();
  metadata.set('boomified', 'true');
  return GrpcBoom.boomify(new Error('Boomify Example!'), {
    code: Status.UNKNOWN,
    metadata
  });
}
```

Returns a gRPC Boom object with the following properties:

```json
isBoom: true
message: Boomify Example!
code: 2
error: UNKNOWN
metadata: {"_internal_repr":{"boomified":["true"]}}
```

### `Convenience`

See [Convenience Methods](#convenience-methods) for a list of available methods.

```typescript
import { Metadata } from 'grpc';
import GrpcBoom from 'grpc-boom';

function example(): GrpcBoom {
  const metadata: Metadata = new Metadata();
  metadata.set('name', 'Cannot be more than 10 characters');
  return GrpcBoom.invalidArgument('Validation failed', metadata);
}
```

Returns a gRPC Boom object with the following properties:

```json
isBoom: true
message: Validation failed
code: 3
error: INVALID_ARGUMENT
metadata: {"_internal_repr":{"name":["Cannot be more than 10 characters"]}}
```

### `Custom`

You can also customise the gRPC Boom object:

```typescript
import { Metadata } from 'grpc';
import GrpcBoom from 'grpc-boom';

function example(): GrpcBoom {
  const metadata: Metadata = new Metadata();
  metadata.set('customised', 'true');
  return GrpcBoom.boomify(new Error('Custom Example!'), {
    code: 200,
    metadata,
    error: 'CUSTOM_EXAMPLE'
  });
}
```

Returns a gRPC Boom object with the following properties:

```json
isBoom: true
message: Custom Example!
code: 200
error: CUSTOM_EXAMPLE
metadata: {"_internal_repr":{"customised":["true"]}}
```

## Helper Methods

The `GrpcBoom` object also supports the following helper methods:

### `new GrpcBoom(message, [options])`

Creates a new `GrpcBoom` object using the provided `message` and decorates the error with `GrpcBoom` properties, where:

- `message` - the error message.
- `options` - and optional object where: 
  - `code` - the gRPC status code. Defaults to `2` if no status code is set.
  - `metadata` - an optional gRPC `Metadata` object.
  - `error` - the gRPC status message (e.g. 'INVALID_ARGUMENTS', 'INTERNAL').

### `boomify(error, [options])`

Decorates an error with `GrpcBoom` properties where:

- `error` - the `Error / GrpcBoom` object to decorate.
- `options` - optional object with the following settings: 
  - `code` - the gRPC status code. Defaults to `2` if no status code is already set.
  - `message` - the error message string
  - `metadata` - an optional gRPC `Metadata` object.
  - `error` - the gRPC status message (e.g. 'INVALID_ARGUMENTS', 'INTERNAL').

```typescript
const error = new Error('Unexpected input');
GrpcBoom.boomify(error, { code: 3 });
```

Generates the following response payload:

```json
{
  "code": 3,
  "error": "INVALID_ARGUMENT",
  "message": "Unexpected input"
}
```

## Convenience Methods

Below is a list of convenience methods that can be used to easily generate `gRPC` errors:

### `GrpcBoom.cancelled([message], [metadata])`

Returns a `1` Cancelled error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.

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

### `GrpcBoom.unknown([message], [metadata])`

Returns a `2` Unknown error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.invalidArgument([message], [metadata])`

Returns a `3` Invalid Argument error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.deadlineExceeded([message], [metadata])`

Returns a `4` Deadline Exceeded error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.notFound([message], [metadata])`

Returns a `5` Not Found error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.alreadyExists([message], [metadata])`

Returns a `6` Already Exists error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.permissionDenied([message], [metadata])`

Returns a `7` Permission Denied error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.resourceExhausted([message], [metadata])`

Returns a `8` Resource Exhausted error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.failedPrecondition([message], [metadata])`

Returns a `9` Failed Precondition error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.aborted([message], [metadata])`

Returns a `10` Aborted error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.outOfRange([message], [metadata])`

Returns a `11` Out of Range error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.unimplemented([message], [metadata])`

Returns a `12` Unimplemented error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.internal([message], [metadata])`

Returns a `13` Internal error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.unavailable([message], [metadata])`

Returns a `14` Unavailable error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.dataLoss([message], [metadata])`

Returns a `15` Data Loss error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

### `GrpcBoom.unauthenticated([message], [metadata])`

Returns a `16` Unauthenticated error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object

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

## Contributing

Contributions are encouraged, please see further details below:

### Pull Requests

Here are some basic rules to follow to ensure timely addition of your request:

  1. Match coding style (braces, spacing, etc.).
  2. If it is a feature, bugfix, or anything please only change the minimum amount of code required to satisfy the change.
  3. Please keep PR titles easy to read and descriptive of changes, this will make them easier to merge :)
  4. Pull requests _must_ be made against `develop` branch. Any other branch (unless specified by the maintainers) will get rejected.
  5. Check for existing issues first, before filing a new issue.

## License

BSD-3 License