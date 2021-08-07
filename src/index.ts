import { Metadata } from '@grpc/grpc-js';

/**
 * Enum of status codes that gRPC can return
 */
export enum Status {
	/**
	 * Not an error; returned on success
	 */
	OK = 0,
	/**
	 * The operation was cancelled (typically by the caller).
	 */
	CANCELLED = 1,
	/**
	 * Unknown error. An example of where this error may be returned is
	 * if a status value received from another address space belongs to
	 * an error-space that is not known in this address space. Also
	 * errors raised by APIs that do not return enough error information
	 * may be converted to this error.
	 */
	UNKNOWN = 2,
	/**
	 * Client specified an invalid argument. Note that this differs
	 * from FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments
	 * that are problematic regardless of the state of the system
	 * (e.g., a malformed file name).
	 */
	INVALID_ARGUMENT = 3,
	/**
	 * Deadline expired before operation could complete. For operations
	 * that change the state of the system, this error may be returned
	 * even if the operation has completed successfully. For example, a
	 * successful response from a server could have been delayed long
	 * enough for the deadline to expire.
	 */
	DEADLINE_EXCEEDED = 4,
	/**
	 * Some requested entity (e.g., file or directory) was not found.
	 */
	NOT_FOUND = 5,
	/**
	 * Some entity that we attempted to create (e.g., file or directory)
	 * already exists.
	 */
	ALREADY_EXISTS = 6,
	/**
	 * The caller does not have permission to execute the specified
	 * operation. PERMISSION_DENIED must not be used for rejections
	 * caused by exhausting some resource (use RESOURCE_EXHAUSTED
	 * instead for those errors). PERMISSION_DENIED must not be
	 * used if the caller can not be identified (use UNAUTHENTICATED
	 * instead for those errors).
	 */
	PERMISSION_DENIED = 7,
	/**
	 * Some resource has been exhausted, perhaps a per-user quota, or
	 * perhaps the entire file system is out of space.
	 */
	RESOURCE_EXHAUSTED = 8,
	/**
	 * Operation was rejected because the system is not in a state
	 * required for the operation's execution. For example, directory
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
	 *    the system state has been explicitly fixed. E.g., if an "rmdir"
	 *    fails because the directory is non-empty, FAILED_PRECONDITION
	 *    should be returned since the client should not retry unless
	 *    they have first fixed up the directory by deleting files from it.
	 *  - Use FAILED_PRECONDITION if the client performs conditional
	 *    REST Get/Update/Delete on a resource and the resource on the
	 *    server does not match the condition. E.g., conflicting
	 *    read-modify-write on the same resource.
	 */
	FAILED_PRECONDITION = 9,
	/**
	 * The operation was aborted, typically due to a concurrency issue
	 * like sequencer check failures, transaction aborts, etc.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 */
	ABORTED = 10,
	/**
	 * Operation was attempted past the valid range. E.g., seeking or
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
	 * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific
	 * error) when it applies so that callers who are iterating through
	 * a space can easily look for an OUT_OF_RANGE error to detect when
	 * they are done.
	 */
	OUT_OF_RANGE = 11,
	/**
	 * Operation is not implemented or not supported/enabled in this service.
	 */
	UNIMPLEMENTED = 12,
	/**
	 * Internal errors. Means some invariants expected by underlying
	 * system has been broken. If you see one of these errors,
	 * something is very broken.
	 */
	INTERNAL = 13,
	/**
	 * The service is currently unavailable. This is a most likely a
	 * transient condition and may be corrected by retrying with
	 * a back off.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 */
	UNAVAILABLE = 14,
	/**
	 * Unrecoverable data loss or corruption.
	 */
	DATA_LOSS = 15,
	/**
	 * The request does not have valid authentication credentials for the
	 * operation.
	 */
	UNAUTHENTICATED = 16,
}

export interface Options {
	/** code - the gRPC status code. */
	code?: number;
	/** additional error information. */
	metadata?: Metadata;
	/** constructor reference. */
	ctor?: (details: string, metadata?: Metadata) => any;
	/** error - the gRPC status message. */
	error?: string;
	/** details - the error details. */
	details?: string | Error;
}

export default class GrpcBoom extends Error {
	public isBoom: boolean;

	public metadata?: Metadata;

	/** code - the gRPC status code. */
	public code?: number;

	/** error - the gRPC status message. */
	public error?: string;

	/** details - the error details. */
	public details: string;

	public static [Symbol.hasInstance](instance: GrpcBoom) {
		return instance && instance.isBoom;
	}

	private static fallbackStatus: number = Status.UNKNOWN;
	private static fallbackMessage: string = 'An unknown error occurred';

	constructor(details: string, options?: Options) {
		super(details);

		// Parse the options
		const code = options && options.code !== undefined ? options.code : GrpcBoom.fallbackStatus;
		const ctor = options && options.ctor !== undefined ? options.ctor : GrpcBoom;
		const error = options && options.error !== undefined ? options.error : undefined;
		const errorInstance: any = new Error(details !== undefined ? details : undefined);

		// Set the defaults
		errorInstance.isBoom = true;
		errorInstance.code = code;
		errorInstance.error = error;
		errorInstance.details = details;
		errorInstance.reformat = this.reformat;
		errorInstance.initialize = this.initialize;

		if (options && options.metadata !== undefined) {
			errorInstance.metadata = options.metadata;
		}

		errorInstance.reformat();

		// Filter the stack to our external API
		Error.captureStackTrace(errorInstance, ctor);
		return errorInstance;
	}

	public static boomify(errorInstance: any, options?: Options) {
		let details: string =
			errorInstance.message ?? errorInstance.details ?? GrpcBoom.fallbackMessage;
		if (options && options.details && !(options.details instanceof Error)) {
			details = options.details;
		}
		let code: number =
			errorInstance && errorInstance.code ? errorInstance.code : GrpcBoom.fallbackStatus;
		if (options && options.code) {
			code = options.code;
		}
		let error;
		if (options && options.error) {
			error = options.error;
		}
		if (errorInstance && errorInstance.isBoom) {
			errorInstance.details = details;
			errorInstance.code = code;
			errorInstance.error = error;
			return errorInstance;
		}

		const newOptions: Options = { code, error };

		if (options && options.metadata) {
			newOptions.metadata = options.metadata;
		}

		return new GrpcBoom(details, newOptions);
	}

	/**
	 * Not an error; returned on success
	 */
	public static ok(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.OK, metadata, this.ok);
	}

	/**
	 * The operation was cancelled (typically by the caller).
	 */

	public static cancelled(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.CANCELLED, metadata, this.cancelled);
	}

	/**
	 * Unknown error. An example of where this error may be returned is
	 * if a status value received from another address space belongs to
	 * an error-space that is not known in this address space. Also
	 * errors raised by APIs that do not return enough error information
	 * may be converted to this error.
	 */

	public static unknown(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.UNKNOWN, metadata, this.unknown);
	}

	/**
	 * Client specified an invalid argument. Note that this differs
	 * from FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments
	 * that are problematic regardless of the state of the system
	 * (e.g., a malformed file name).
	 */

	public static invalidArgument(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.INVALID_ARGUMENT, metadata, this.invalidArgument);
	}

	/**
	 * Deadline expired before operation could complete. For operations
	 * that change the state of the system, this error may be returned
	 * even if the operation has completed successfully. For example, a
	 * successful response from a server could have been delayed long
	 * enough for the deadline to expire.
	 */
	public static deadlineExceeded(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.DEADLINE_EXCEEDED, metadata, this.deadlineExceeded);
	}

	/**
	 * Some requested entity (e.g., file or directory) was not found.
	 */
	public static notFound(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.NOT_FOUND, metadata, this.notFound);
	}

	/**
	 * Some entity that we attempted to create (e.g., file or directory)
	 * already exists.
	 */
	public static alreadyExists(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.ALREADY_EXISTS, metadata, this.alreadyExists);
	}

	/**
	 * The caller does not have permission to execute the specified
	 * operation. PERMISSION_DENIED must not be used for rejections
	 * caused by exhausting some resource (use RESOURCE_EXHAUSTED
	 * instead for those errors). PERMISSION_DENIED must not be
	 * used if the caller can not be identified (use UNAUTHENTICATED
	 * instead for those errors).
	 */
	public static permissionDenied(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.PERMISSION_DENIED, metadata, this.permissionDenied);
	}

	/**
	 * Some resource has been exhausted, perhaps a per-user quota, or
	 * perhaps the entire file system is out of space.
	 */
	public static resourceExhausted(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.RESOURCE_EXHAUSTED, metadata, this.resourceExhausted);
	}

	/**
	 * Operation was rejected because the system is not in a state
	 * required for the operation's execution. For example, directory
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
	 *    the system state has been explicitly fixed. E.g., if an "rmdir"
	 *    fails because the directory is non-empty, FAILED_PRECONDITION
	 *    should be returned since the client should not retry unless
	 *    they have first fixed up the directory by deleting files from it.
	 *  - Use FAILED_PRECONDITION if the client performs conditional
	 *    REST Get/Update/Delete on a resource and the resource on the
	 *    server does not match the condition. E.g., conflicting
	 *    read-modify-write on the same resource.
	 */
	public static failedPrecondition(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.FAILED_PRECONDITION, metadata, this.failedPrecondition);
	}

	/**
	 * The operation was aborted, typically due to a concurrency issue
	 * like sequencer check failures, transaction aborts, etc.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 */
	public static aborted(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.ABORTED, metadata, this.aborted);
	}

	/**
	 * Operation was attempted past the valid range. E.g., seeking or
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
	 * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific
	 * error) when it applies so that callers who are iterating through
	 * a space can easily look for an OUT_OF_RANGE error to detect when
	 * they are done.
	 */
	public static outOfRange(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.OUT_OF_RANGE, metadata, this.outOfRange);
	}

	/**
	 * Operation is not implemented or not supported/enabled in this service.
	 */
	public static unimplemented(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.UNIMPLEMENTED, metadata, this.unimplemented);
	}

	/**
	 * Internal errors. Means some invariants expected by underlying
	 * system has been broken. If you see one of these errors,
	 * something is very broken.
	 */
	public static internal(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.INTERNAL, metadata, this.internal);
	}

	/**
	 * The service is currently unavailable. This is a most likely a
	 * transient condition and may be corrected by retrying with
	 * a back off.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 */
	public static unavailable(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.UNAVAILABLE, metadata, this.unavailable);
	}

	/**
	 * Unrecoverable data loss or corruption.
	 */
	public static dataLoss(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.DATA_LOSS, metadata, this.dataLoss);
	}

	/**
	 * The request does not have valid authentication credentials for the
	 * operation.
	 */
	public static unauthenticated(details: string, metadata?: Metadata): GrpcBoom {
		return this.create(details, Status.UNAUTHENTICATED, metadata, this.unauthenticated);
	}

	private static create(
		details: string,
		code: number,
		metadata?: Metadata,
		ctor?: (details: string, metadata?: Metadata) => any
	): GrpcBoom {
		const grpcBoom: GrpcBoom = new GrpcBoom(details, {
			code,
			metadata,
			ctor,
		});
		return grpcBoom.initialize(grpcBoom, code, details, metadata);
	}

	private initialize(
		errorInstance: GrpcBoom,
		code: number,
		details?: string | Error,
		metadata?: Metadata
	) {
		this.isBoom = true;

		if (metadata) {
			this.metadata = metadata;
		}

		this.code = code;

		if (details === undefined && errorInstance.details === undefined) {
			this.reformat();
			details = this.error;
		}

		this.reformat();
		return this;
	}

	private reformat(debug?: boolean) {
		if (this.code === undefined) {
			this.code = GrpcBoom.fallbackStatus;
		}

		if (this.error === undefined) {
			this.error = Status[this.code];
		}

		if (this.details === undefined) {
			this.details = GrpcBoom.fallbackMessage;
		}
	}
}
