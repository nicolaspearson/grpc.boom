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
	UNAUTHENTICATED = 16
}

export interface Options {
	/** code - the gRPC status code. */
	code?: number;
	/** additional error information. */
	metadata?: Metadata;
	/** constructor reference. */
	ctor?: (message: string, metadata?: Metadata) => any;
	/** error - the gRPC status message. */
	error?: string;
	/** message - the error message. */
	message?: string | Error;
}

export default class GrpcBoom extends Error {
	/** isBoom - if true, indicates this is a GrpcBoom object instance. */
	public isBoom: boolean;
	/** additional error information. */
	public metadata?: Metadata;
	/** code - the gRPC status code. */
	public code?: number;
	/** error - the gRPC status message. */
	public error?: string;
	/** message - the error message. */
	public message: string;

	constructor(message: string, options?: Options);

	/**
	 * Decorates an error / grpc boom object with boom properties
	 * @param error the error / grpc boom object to wrap.
	 * @param options optional settings
	 */
	public static boomify(error: any, options?: Options): GrpcBoom;

	/**
	 * Not an error; returned on success
	 * @param message the message.
	 * @param metadata optional grpc metadata.
	 */
	public static ok(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * The operation was cancelled (typically by the caller).
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static cancelled(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * Unknown error. An example of where this error may be returned is
	 * if a status value received from another address space belongs to
	 * an error-space that is not known in this address space. Also
	 * errors raised by APIs that do not return enough error information
	 * may be converted to this error.
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static unknown(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * Client specified an invalid argument. Note that this differs
	 * from FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments
	 * that are problematic regardless of the state of the system
	 * (e.g., a malformed file name).
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static invalidArgument(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * Deadline expired before operation could complete. For operations
	 * that change the state of the system, this error may be returned
	 * even if the operation has completed successfully. For example, a
	 * successful response from a server could have been delayed long
	 * enough for the deadline to expire.
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static deadlineExceeded(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * Some requested entity (e.g., file or directory) was not found.
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static notFound(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * Some entity that we attempted to create (e.g., file or directory)
	 * already exists.
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static alreadyExists(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * The caller does not have permission to execute the specified
	 * operation. PERMISSION_DENIED must not be used for rejections
	 * caused by exhausting some resource (use RESOURCE_EXHAUSTED
	 * instead for those errors). PERMISSION_DENIED must not be
	 * used if the caller can not be identified (use UNAUTHENTICATED
	 * instead for those errors).
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static permissionDenied(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * Some resource has been exhausted, perhaps a per-user quota, or
	 * perhaps the entire file system is out of space.
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static resourceExhausted(message: string, metadata?: Metadata): GrpcBoom;

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
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static failedPrecondition(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * The operation was aborted, typically due to a concurrency issue
	 * like sequencer check failures, transaction aborts, etc.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static aborted(message: string, metadata?: Metadata): GrpcBoom;

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
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static outOfRange(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * Operation is not implemented or not supported/enabled in this service.
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static unimplemented(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * Internal errors. Means some invariants expected by underlying
	 * system has been broken. If you see one of these errors,
	 * something is very broken.
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static internal(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * The service is currently unavailable. This is a most likely a
	 * transient condition and may be corrected by retrying with
	 * a back off.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static unavailable(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * Unrecoverable data loss or corruption.
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static dataLoss(message: string, metadata?: Metadata): GrpcBoom;

	/**
	 * The request does not have valid authentication credentials for the
	 * operation.
	 * @param message the error message.
	 * @param metadata optional grpc metadata.
	 */
	public static unauthenticated(message: string, metadata?: Metadata): GrpcBoom;
}

/**
 * A representation of the Metadata class in the grpc package
 */
interface Metadata {
	/**
	 * Sets the given value for the given key by replacing any other values
	 * associated with that key. Normalizes the key.
	 * @param key The key to whose value should be set.
	 * @param value The value to set. Must be a buffer if and only
	 *  if the normalized key ends with '-bin'.
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

	// For compatibility with the other Metadata implementation
	_getCoreRepresentation(): Map<string, MetadataValue[]>;
}

type MetadataValue = string | Buffer;
type MetadataObject = Map<string, MetadataValue[]>;
