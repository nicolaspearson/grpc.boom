export = GrpcBoom;

declare namespace GrpcBoom {
	export interface GrpcBoomError<Data = any> extends Error {
		/** isBoom - if true, indicates this is a GrpcBoom object instance. */
		isBoom: boolean;
		/** output - the formatted response. Can be directly manipulated after object construction to return a custom error response. Allowed root keys: */
		output: Output;
		/** reformat() - rebuilds error.output using the other object properties. */
		reformat: () => string;
		/** additional error information. */
		data: Data;
	}

	export interface Output {
		/** code - the gRPC status code. */
		code: number;
		/** payload - the formatted object used as the response payload (stringified). Can be directly manipulated but any changes will be lost if reformat() is called. Any content allowed and by default includes the following content: */
		payload: Payload;
	}

	export interface Payload {
		/** code - the gRPC status code, derived from error.output.code. */
		code?: number;
		/** error - the gRPC status message. */
		error?: string;
		/** message - the error message derived from error.message. */
		message?: string;
	}

	export interface Options {
		/** code - the gRPC status code, derived from error.output.code. */
		code?: number;
		/** additional error information. */
		data?: any;
		/** constructor reference. */
		ctor?: (message: string, data: any) => any;
		/** an option with extra properties to set on the error object. */
		decorate?: any;
		/** message - the error message derived from error.message. */
		message?: string | Error;
		/** if false, the err provided is a GrpcBoom object, and a code or message are provided, the values are ignored. Defaults to true (apply the provided code and message options to the error regardless of its type, Error or Boom object). */
		override?: boolean;
	}

	/**
	 * Identifies whether an error is a `GrpcBoom` object. Same as calling `instanceof GrpcBoom`.
	 * @param error the error object.
	 */
	export function isBoom(error: Error): boolean;

	/**
	 * Decorates a grpc boom error with the boom properties
	 * @param error the error object to wrap. If error is already a boom object, it defaults to overriding the object with the new status code and message.
	 * @param options optional additional options
	 */
	export function boomify(
		error: Error,
		options?: { code?: number; message?: string; override?: boolean }
	): GrpcBoomError<null>;

	/**
	 * Not an error; returned on success
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function ok<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * The operation was cancelled (typically by the caller).
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function cancelled<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * Unknown error.  An example of where this error may be returned is
	 * if a status value received from another address space belongs to
	 * an error-space that is not known in this address space.  Also
	 * errors raised by APIs that do not return enough error information
	 * may be converted to this error.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function unknown<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * Client specified an invalid argument.  Note that this differs
	 * from FAILED_PRECONDITION.  INVALID_ARGUMENT indicates arguments
	 * that are problematic regardless of the state of the system
	 * (e.g., a malformed file name).
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function invalidArgument<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * Deadline expired before operation could complete.  For operations
	 * that change the state of the system, this error may be returned
	 * even if the operation has completed successfully.  For example, a
	 * successful response from a server could have been delayed long
	 * enough for the deadline to expire.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function deadlineExceeded<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * Some requested entity (e.g., file or directory) was not found.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function notFound<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * Some entity that we attempted to create (e.g., file or directory)
	 * already exists.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function alreadyExists<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * The caller does not have permission to execute the specified
	 * operation.  PERMISSION_DENIED must not be used for rejections
	 * caused by exhausting some resource (use RESOURCE_EXHAUSTED
	 * instead for those errors).  PERMISSION_DENIED must not be
	 * used if the caller can not be identified (use UNAUTHENTICATED
	 * instead for those errors).
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function permissionDenied<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * Some resource has been exhausted, perhaps a per-user quota, or
	 * perhaps the entire file system is out of space.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function resourceExhausted<Data = null>(
		message?: string,
		data?: Data
	): GrpcBoomError<Data>;

	/**
	 * Operation was rejected because the system is not in a state
	 * required for the operation's execution.  For example, directory
	 * to be deleted may be non-empty, an rmdir operation is applied to
	 * a non-directory, etc.
	 *
	 * A litmus test that may help a service implementor in deciding
	 * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
	 *
	 *  - Use UNAVAILABLE if the client can retry just the failing call.
	 *  - Use ABORTED if the client should retry at a higher-level
	 *    (e.g., restarting a read-modify-write sequence).
	 *  - Use FAILED_PRECONDITION if the client should not retry until
	 *    the system state has been explicitly fixed.  E.g., if an "rmdir"
	 *    fails because the directory is non-empty, FAILED_PRECONDITION
	 *    should be returned since the client should not retry unless
	 *    they have first fixed up the directory by deleting files from it.
	 *  - Use FAILED_PRECONDITION if the client performs conditional
	 *    REST Get/Update/Delete on a resource and the resource on the
	 *    server does not match the condition. E.g., conflicting
	 *    read-modify-write on the same resource.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function failedPrecondition<Data = null>(
		message?: string,
		data?: Data
	): GrpcBoomError<Data>;

	/**
	 * The operation was aborted, typically due to a concurrency issue
	 * like sequencer check failures, transaction aborts, etc.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function aborted<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * Operation was attempted past the valid range.  E.g., seeking or
	 * reading past end of file.
	 *
	 * Unlike INVALID_ARGUMENT, this error indicates a problem that may
	 * be fixed if the system state changes. For example, a 32-bit file
	 * system will generate INVALID_ARGUMENT if asked to read at an
	 * offset that is not in the range [0,2^32-1], but it will generate
	 * OUT_OF_RANGE if asked to read from an offset past the current
	 * file size.
	 *
	 * There is a fair bit of overlap between FAILED_PRECONDITION and
	 * OUT_OF_RANGE.  We recommend using OUT_OF_RANGE (the more specific
	 * error) when it applies so that callers who are iterating through
	 * a space can easily look for an OUT_OF_RANGE error to detect when
	 * they are done.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function outOfRange<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * Operation is not implemented or not supported/enabled in this service.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function unimplemented<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * Internal errors. Means some invariants expected by underlying
	 * system has been broken. If you see one of these errors,
	 * something is very broken.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function internal<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * The service is currently unavailable.  This is a most likely a
	 * transient condition and may be corrected by retrying with
	 * a back off.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function unavailable<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * Unrecoverable data loss or corruption.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function dataLoss<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;

	/**
	 * The request does not have valid authentication credentials for the
	 * operation.
	 * @param message optional message.
	 * @param data optional additional error data.
	 */
	export function unauthenticated<Data = null>(message?: string, data?: Data): GrpcBoomError<Data>;
}
