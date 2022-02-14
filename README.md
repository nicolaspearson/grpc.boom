# gRPC Boom

[![License][license-image]][license-url]
[![Current Version](https://img.shields.io/npm/v/grpc-boom.svg)](https://www.npmjs.com/package/grpc-boom)
[![npm](https://img.shields.io/npm/dw/grpc-boom.svg)](https://www.npmjs.com/package/grpc-boom)
![](https://img.shields.io/bundlephobia/min/grpc-boom.svg?style=flat)
![Build Status](https://github.com/nicolaspearson/grpc.boom/workflows/Node%20CI/badge.svg)

[license-url]: https://opensource.org/licenses/BSD-3-Clause
[license-image]: https://img.shields.io/badge/License-BSD%203--Clause-blue.svg

A `gRPC` implementation of the awesome [Boom](https://github.com/hapijs/boom) library to help create gRPC-friendly error objects. It supports gRPC `Metadata`, and can be `customised` as desired. See [Usage](#usage) examples below for more details.

This library has **zero** external dependencies, but it is assumed that you are using the `@grpc/grpc-js` library.

## Notice (Deprecated)

The source code for this library has been moved to: [Kalos](https://github.com/nicolaspearson/kalos/tree/main/packages/grpc-boom).

## Installation

```
npm install grpc-boom --save
```

Install the `@grpc/grpc-js` library:

```
npm install @grpc/grpc-js --save
```

## Test Coverage

![Coverage lines](https://raw.githubusercontent.com/nicolaspearson/node.ts.ocr/master/coverage/badge-lines.svg?sanitize=true)
![Coverage functions](https://raw.githubusercontent.com/nicolaspearson/node.ts.ocr/master/coverage/badge-functions.svg?sanitize=true)
![Coverage branches](https://raw.githubusercontent.com/nicolaspearson/node.ts.ocr/master/coverage/badge-branches.svg?sanitize=true)
![Coverage statements](https://raw.githubusercontent.com/nicolaspearson/node.ts.ocr/master/coverage/badge-statements.svg?sanitize=true)

## Table of Contents

<!-- toc -->

- [Overview](#overview)
  - [Usage](#usage)
    - [`gRPC Callback`](#grpc-callback)
    - [`Constructor`](#constructor)
    - [`Boomify`](#boomify)
	- [`From Http Exception`](#from-http-exception)
    - [`Convenience`](#convenience)
    - [`Custom`](#custom)
  - [Helper Methods](#helper-methods)
    - [`new GrpcBoom(message, [options])`](#new-grpcboommessage-options)
    - [`boomify(error, [options])`](#boomifyerror-options)
  - [Convenience Methods](#convenience-methods)
    - [`GrpcBoom.cancelled([message], [metadata], [details])`](#grpcboomcancelledmessage-metadata-details)
    - [`GrpcBoom.unknown([message], [metadata], [details])`](#grpcboomunknownmessage-metadata-details)
    - [`GrpcBoom.invalidArgument([message], [metadata], [details])`](#grpcboominvalidargumentmessage-metadata-details)
    - [`GrpcBoom.deadlineExceeded([message], [metadata], [details])`](#grpcboomdeadlineexceededmessage-metadata-details)
    - [`GrpcBoom.notFound([message], [metadata], [details])`](#grpcboomnotfoundmessage-metadata-details)
    - [`GrpcBoom.alreadyExists([message], [metadata], [details])`](#grpcboomalreadyexistsmessage-metadata-details)
    - [`GrpcBoom.permissionDenied([message], [metadata], [details])`](#grpcboompermissiondeniedmessage-metadata-details)
    - [`GrpcBoom.resourceExhausted([message], [metadata], [details])`](#grpcboomresourceexhaustedmessage-metadata-details)
    - [`GrpcBoom.failedPrecondition([message], [metadata], [details])`](#grpcboomfailedpreconditionmessage-metadata-details)
    - [`GrpcBoom.aborted([message], [metadata], [details])`](#grpcboomabortedmessage-metadata-details)
    - [`GrpcBoom.outOfRange([message], [metadata], [details])`](#grpcboomoutofrangemessage-metadata-details)
    - [`GrpcBoom.unimplemented([message], [metadata], [details])`](#grpcboomunimplementedmessage-metadata-details)
    - [`GrpcBoom.internal([message], [metadata], [details])`](#grpcboominternalmessage-metadata-details)
    - [`GrpcBoom.unavailable([message], [metadata], [details])`](#grpcboomunavailablemessage-metadata-details)
    - [`GrpcBoom.dataLoss([message], [metadata], [details])`](#grpcboomdatalossmessage-metadata-details)
    - [`GrpcBoom.unauthenticated([message], [metadata], [details])`](#grpcboomunauthenticatedmessage-metadata-details)

<!-- tocstop -->

## Overview

**gRPC Boom** provides a set of utilities for returning gRPC-friendly errors. Each utility returns a `GrpcBoom`
error response object which includes the following properties:

- `isBoom` - if `true`, indicates this is a `GrpcBoom` object instance.
- `metadata` - an optional gRPC `Metadata` object..
- `code` - the gRPC status code.
- `error` - the gRPC status message (e.g. 'INVALID_ARGUMENTS', 'INTERNAL').
- `message` - the error message.
- `details` - optional error details.

## Usage

Below are some general usage examples:

### `gRPC Callback`

Can be used as the first argument of a gRPC callback method:

```typescript
import GrpcBoom from 'grpc-boom';

function sayHelloStrict(call, callback) {
	if (call.request.getName().length > 10) {
		return callback(
			GrpcBoom.invalidArgument('Length of "Name" cannot be more than 10 characters'),
			null
		);
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
import { Metadata } from '@grpc/grpc-js';
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
import { Metadata } from '@grpc/grpc-js';
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

### `From Http Exception`

This method attempts to convert an http exception to a grpc boom error, it will fail-over to an 
unknown grpc error if the error code cannot be inferred. This method supports *Boom* errors.

```typescript
import { Metadata } from '@grpc/grpc-js';
import GrpcBoom, { Status } from 'grpc-boom';

function example(): GrpcBoom {
	const metadata: Metadata = new Metadata();
	metadata.set('boomified', 'true');
	const httpException = {
		code: 400,
		message: 'Invalid input provided.',
		details: 'Password must be more than 6 characters.'
	};
	return GrpcBoom.fromHttpException(httpException, metadata);
}
```

Returns a gRPC Boom object with the following properties:

```json
isBoom: true,
code: 3,
error: 'INVALID_ARGUMENT',
message: 'Invalid input provided.',
details: 'Password must be more than 6 characters.',
metadata: {"_internal_repr":{"boomified":["true"]}}
```

### `Convenience`

See [Convenience Methods](#convenience-methods) for a list of available methods.

```typescript
import { Metadata } from '@grpc/grpc-js';
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
import { Metadata } from '@grpc/grpc-js';
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

The `gRPC` Boom object also supports the following helper methods:

### `new GrpcBoom(message, [options])`

Creates a new `GrpcBoom` object using the provided `message` and decorates the error with `GrpcBoom` properties, where:

- `message` - the error message.
- `options` - and optional object where:
  - `code` - the gRPC status code. Defaults to `2` if no status code is set.
  - `details` - optional error details.
  - `metadata` - an optional gRPC `Metadata` object..
  - `error` - the gRPC status message (e.g. 'INVALID_ARGUMENTS', 'INTERNAL').

### `boomify(error, [options])`

Decorates an error with `GrpcBoom` properties where:

- `error` - the `Error / GrpcBoom` object to decorate.
- `options` - optional object with the following settings:
  - `code` - the gRPC status code. Defaults to `2` if no status code is already set.
  - `details` - optional error details.
  - `message` - the error message string
  - `metadata` - an optional gRPC `Metadata` object..
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

### `GrpcBoom.cancelled([message], [metadata], [details])`

Returns a `1` Cancelled error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object..
- `details` - optional details.

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

### `GrpcBoom.unknown([message], [metadata], [details])`

Returns a `2` Unknown error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.invalidArgument([message], [metadata], [details])`

Returns a `3` Invalid Argument error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.deadlineExceeded([message], [metadata], [details])`

Returns a `4` Deadline Exceeded error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.notFound([message], [metadata], [details])`

Returns a `5` Not Found error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.alreadyExists([message], [metadata], [details])`

Returns a `6` Already Exists error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.permissionDenied([message], [metadata], [details])`

Returns a `7` Permission Denied error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.resourceExhausted([message], [metadata], [details])`

Returns a `8` Resource Exhausted error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.failedPrecondition([message], [metadata], [details])`

Returns a `9` Failed Precondition error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.aborted([message], [metadata], [details])`

Returns a `10` Aborted error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.outOfRange([message], [metadata], [details])`

Returns a `11` Out of Range error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.unimplemented([message], [metadata], [details])`

Returns a `12` Unimplemented error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.internal([message], [metadata], [details])`

Returns a `13` Internal error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.unavailable([message], [metadata], [details])`

Returns a `14` Unavailable error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.dataLoss([message], [metadata], [details])`

Returns a `15` Data Loss error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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

### `GrpcBoom.unauthenticated([message], [metadata], [details])`

Returns a `16` Unauthenticated error where:

- `message` - optional message.
- `metadata` - optional gRPC `Metadata` object.
- `details` - optional details.

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
