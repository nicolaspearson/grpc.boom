const codes: Map<number, string> = new Map([
	[0, 'OK'],
	[1, 'CANCELLED'],
	[2, 'UNKNOWN'],
	[3, 'INVALID_ARGUMENT'],
	[4, 'DEADLINE_EXCEEDED'],
	[5, 'NOT_FOUND'],
	[6, 'ALREADY_EXISTS'],
	[7, 'PERMISSION_DENIED'],
	[8, 'RESOURCE_EXHAUSTED'],
	[9, 'FAILED_PRECONDITION'],
	[10, 'ABORTED'],
	[11, 'OUT_OF_RANGE'],
	[12, 'UNIMPLEMENTED'],
	[13, 'INTERNAL'],
	[14, 'UNAVAILABLE'],
	[15, 'DATA_LOSS'],
	[16, 'UNAUTHENTICATED']
]);

export interface Options {
	/** code - the gRPC status code. */
	code?: number;
	/** additional error information. */
	metadata?: Metadata;
	/** constructor reference. */
	ctor?: (message: string, metadata?: Metadata) => any;
	/** message - the error message. */
	message?: string | Error;
}

export default class GrpcBoom extends Error {
	public isBoom: boolean;

	public metadata?: Metadata;

	/** code - the gRPC status code. */
	public code?: number;

	/** error - the gRPC status message. */
	public error?: string;

	/** message - the error message. */
	public message: string;

	public static [Symbol.hasInstance](instance: GrpcBoom) {
		return instance && instance.isBoom;
	}

	constructor(message: string, options?: Options) {
		super(message);

		// Parse the options
		const { code, ctor } = options ? options : { code: 13, ctor: GrpcBoom };
		const error: any = new Error(message ? message : undefined);

		// Set the defaults
		error.isBoom = true;
		error.code = code;
		error.message = message;
		error.reformat = this.reformat;
		error.initialize = this.initialize;

		if (options && options.metadata) {
			error.metadata = options.metadata;
		}

		error.reformat();

		// Filter the stack to our external API
		Error.captureStackTrace(error, ctor);
		return error;
	}

	public static boomify(error: any, options?: Options) {
		let message: string = error && error.message ? error.message : 'Unknown';
		if (options && options.message && !(options.message instanceof Error)) {
			message = options.message;
		}
		let code: number = error && error.code ? error.code : 13;
		if (options && options.code) {
			code = options.code;
		}
		if (error && error.isBoom) {
			error.message = message;
			error.code = code;
			return error;
		}

		const newOptions: Options = { code };

		if (options && options.metadata) {
			newOptions.metadata = options.metadata;
		}

		return new GrpcBoom(message, newOptions);
	}

	/**
	 * Not an error; returned on success
	 */
	public static ok(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 0, metadata, this.ok);
	}

	/**
	 * The operation was cancelled (typically by the caller).
	 */

	public static cancelled(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 1, metadata, this.cancelled);
	}

	/**
	 * Unknown error.  An example of where this error may be returned is
	 * if a status value received from another address space belongs to
	 * an error-space that is not known in this address space.  Also
	 * errors raised by APIs that do not return enough error information
	 * may be converted to this error.
	 */

	public static unknown(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 2, metadata, this.unknown);
	}

	/**
	 * Client specified an invalid argument.  Note that this differs
	 * from FAILED_PRECONDITION.  INVALID_ARGUMENT indicates arguments
	 * that are problematic regardless of the state of the system
	 * (e.g., a malformed file name).
	 */

	public static invalidArgument(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 3, metadata, this.invalidArgument);
	}

	/**
	 * Deadline expired before operation could complete.  For operations
	 * that change the state of the system, this error may be returned
	 * even if the operation has completed successfully.  For example, a
	 * successful response from a server could have been delayed long
	 * enough for the deadline to expire.
	 */
	public static deadlineExceeded(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 4, metadata, this.deadlineExceeded);
	}

	/**
	 * Some requested entity (e.g., file or directory) was not found.
	 */
	public static notFound(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 5, metadata, this.notFound);
	}

	/**
	 * Some entity that we attempted to create (e.g., file or directory)
	 * already exists.
	 */
	public static alreadyExists(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 6, metadata, this.alreadyExists);
	}

	/**
	 * The caller does not have permission to execute the specified
	 * operation.  PERMISSION_DENIED must not be used for rejections
	 * caused by exhausting some resource (use RESOURCE_EXHAUSTED
	 * instead for those errors).  PERMISSION_DENIED must not be
	 * used if the caller can not be identified (use UNAUTHENTICATED
	 * instead for those errors).
	 */
	public static permissionDenied(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 7, metadata, this.permissionDenied);
	}

	/**
	 * Some resource has been exhausted, perhaps a per-user quota, or
	 * perhaps the entire file system is out of space.
	 */
	public static resourceExhausted(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 8, metadata, this.resourceExhausted);
	}

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
	 */
	public static failedPrecondition(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 9, metadata, this.failedPrecondition);
	}

	/**
	 * The operation was aborted, typically due to a concurrency issue
	 * like sequencer check failures, transaction aborts, etc.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 */
	public static aborted(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 10, metadata, this.aborted);
	}

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
	 */
	public static outOfRange(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 11, metadata, this.outOfRange);
	}

	/**
	 * Operation is not implemented or not supported/enabled in this service.
	 */
	public static unimplemented(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 12, metadata, this.unimplemented);
	}

	/**
	 * Internal errors. Means some invariants expected by underlying
	 * system has been broken. If you see one of these errors,
	 * something is very broken.
	 */
	public static internal(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 13, metadata, this.internal);
	}

	/**
	 * The service is currently unavailable.  This is a most likely a
	 * transient condition and may be corrected by retrying with
	 * a back off.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 */
	public static unavailable(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 14, metadata, this.unavailable);
	}

	/**
	 * Unrecoverable data loss or corruption.
	 */
	public static dataLoss(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 15, metadata, this.dataLoss);
	}

	/**
	 * The request does not have valid authentication credentials for the
	 * operation.
	 */
	public static unauthenticated(message: string, metadata?: Metadata): GrpcBoom {
		return this.create(message, 16, metadata, this.unauthenticated);
	}

	public static create(
		message: string,
		code: number,
		metadata?: Metadata,
		ctor?: (message: string, metadata?: Metadata) => any
	): GrpcBoom {
		const grpcBoom: GrpcBoom = new GrpcBoom(message, {
			code,
			metadata,
			ctor
		});
		return grpcBoom.initialize(grpcBoom, code, message, metadata);
	}

	public initialize(err: GrpcBoom, code: number, message?: string | Error, metadata?: Metadata) {
		this.isBoom = true;

		if (metadata) {
			this.metadata = metadata;
		}

		this.code = code;

		if (!message && !err.message) {
			this.reformat();
			message = this.error;
		}

		this.reformat();
		return this;
	}

	public reformat(debug?: boolean) {
		if (this.code) {
			this.error = codes.get(this.code) || 'Unknown';
		}

		if (this.code === 13 && debug !== true) {
			this.message = 'An internal server error occurred'; // Hide actual error from user
		}
	}
}

/**
 * A representation of the Metadata class in the grpc package
 */
export interface Metadata {
	/**
	 * Sets the given value for the given key by replacing any other values
	 * associated with that key. Normalizes the key.
	 * @param key The key to whose value should be set.
	 * @param value The value to set. Must be a buffer if and only
	 *   if the normalized key ends with '-bin'.
	 */
	set(key: string, value: MetadataValue): void;

	/**
	 * Adds the given value for the given key by appending to a list of previous
	 * values associated with that key. Normalizes the key.
	 * @param key The key for which a new value should be appended.
	 * @param value The value to add. Must be a buffer if and only
	 *   if the normalized key ends with '-bin'.
	 */
	add(key: string, value: MetadataValue): void;

	/**
	 * Removes the given key and any associated values. Normalizes the key.
	 * @param key The key whose values should be removed.
	 */
	remove(key: string): void;

	/**
	 * Gets a list of all values associated with the key. Normalizes the key.
	 * @param key The key whose value should be retrieved.
	 * @return A list of values associated with the given key.
	 */
	get(key: string): MetadataValue[];

	/**
	 * Gets a plain object mapping each key to the first value associated with it.
	 * This reflects the most common way that people will want to see metadata.
	 * @return A key/value mapping of the metadata.
	 */
	getMap(): { [key: string]: MetadataValue };

	/**
	 * Clones the metadata object.
	 * @return The newly cloned object.
	 */
	clone(): Metadata;
}

export type MetadataValue = string | Buffer;
