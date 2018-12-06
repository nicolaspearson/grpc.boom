export = GrpcBoom;

declare namespace GrpcBoom {
	export interface GrpcBoomError extends Error {
		/** isBoom - if true, indicates this is a GrpcBoom object instance. */
		isBoom: boolean;
		/** additional error information. */
		metadata?: Metadata;
		/** code - the gRPC status code. */
		code?: number;
		/** error - the gRPC status message. */
		error?: string;
		/** message - the error message. */
		message: string;
	}

	export interface Options {
		/** code - the gRPC status code. */
		code?: number;
		/** additional error information. */
		metadata?: Metadata;
		/** constructor reference. */
		ctor?: (message: string, metadata: any) => any;
		/** message - the error message derived from error.message. */
		message?: string | Error;
	}

	/**
	 * Decorates a grpc boom error with the boom properties
	 * @param error the error object to wrap.
	 * @param options optional additional options
	 */
	export function boomify(
		error: any,
		options?: { code?: number; message?: string }
	): GrpcBoomError;

	/**
	 * Not an error; returned on success
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function ok(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * The operation was cancelled (typically by the caller).
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function cancelled(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * Unknown error.  An example of where this error may be returned is
	 * if a status value received from another address space belongs to
	 * an error-space that is not known in this address space.  Also
	 * errors raised by APIs that do not return enough error information
	 * may be converted to this error.
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function unknown(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * Client specified an invalid argument.  Note that this differs
	 * from FAILED_PRECONDITION.  INVALID_ARGUMENT indicates arguments
	 * that are problematic regardless of the state of the system
	 * (e.g., a malformed file name).
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function invalidArgument(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * Deadline expired before operation could complete.  For operations
	 * that change the state of the system, this error may be returned
	 * even if the operation has completed successfully.  For example, a
	 * successful response from a server could have been delayed long
	 * enough for the deadline to expire.
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function deadlineExceeded(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * Some requested entity (e.g., file or directory) was not found.
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function notFound(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * Some entity that we attempted to create (e.g., file or directory)
	 * already exists.
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function alreadyExists(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * The caller does not have permission to execute the specified
	 * operation.  PERMISSION_DENIED must not be used for rejections
	 * caused by exhausting some resource (use RESOURCE_EXHAUSTED
	 * instead for those errors).  PERMISSION_DENIED must not be
	 * used if the caller can not be identified (use UNAUTHENTICATED
	 * instead for those errors).
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function permissionDenied(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * Some resource has been exhausted, perhaps a per-user quota, or
	 * perhaps the entire file system is out of space.
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function resourceExhausted(message?: string, metadata?: Metadata): GrpcBoomError;

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
	 * @param metadata optional additional error metadata.
	 */
	export function failedPrecondition(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * The operation was aborted, typically due to a concurrency issue
	 * like sequencer check failures, transaction aborts, etc.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function aborted(message?: string, metadata?: Metadata): GrpcBoomError;

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
	 * @param metadata optional additional error metadata.
	 */
	export function outOfRange(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * Operation is not implemented or not supported/enabled in this service.
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function unimplemented(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * Internal errors. Means some invariants expected by underlying
	 * system has been broken. If you see one of these errors,
	 * something is very broken.
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function internal(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * The service is currently unavailable.  This is a most likely a
	 * transient condition and may be corrected by retrying with
	 * a back off.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function unavailable(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * Unrecoverable data loss or corruption.
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function dataLoss(message?: string, metadata?: Metadata): GrpcBoomError;

	/**
	 * The request does not have valid authentication credentials for the
	 * operation.
	 * @param message optional message.
	 * @param metadata optional additional error metadata.
	 */
	export function unauthenticated(message?: string, metadata?: Metadata): GrpcBoomError;

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
}
