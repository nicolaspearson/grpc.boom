export interface Output {
	/** code - the gRPC status code. */
	code: number;
	/** payload - the formatted object used as the response payload (stringified).
	 * Can be directly manipulated but any changes will be lost if reformat() is
	 * called. Any content allowed and by default includes the following content:
	 */
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
	/** if false, the err provided is a Boom object, and a code or message are
	 * provided, the values are ignored. Defaults to true (apply the provided code
	 * and message options to the error regardless of its type, Error or Boom object).
	 */
	override?: boolean;
}

export default class GrpcBoom extends Error {
	public isBoom: boolean;

	public data: any;

	public output: Output;

	public codes: Map<number, string> = new Map([
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

	public static [Symbol.hasInstance](instance: GrpcBoom) {
		return GrpcBoom.isBoom(instance);
	}

	constructor(message: string, options?: Options) {
		super(message);
		const { code = 13, data = null, ctor = GrpcBoom } = options ? options : {};
		const error: any = new Error(message ? message : undefined);

		// Filter the stack to our external API
		Error.captureStackTrace(error, ctor);

		error.data = data;
		this.initialize(error, code);
		error.typeof = ctor;
		if (options && options.decorate) {
			Object.assign(error, options.decorate);
		}
		return error;
	}

	public static isBoom(err: GrpcBoom) {
		return err instanceof GrpcBoom && !!err.isBoom;
	}

	public static boomify(error: Error, options?: Options) {
		return GrpcBoom.boomifyClone(this.clone(error), options);
	}

	private static boomifyClone(err: GrpcBoom, options?: Options) {
		options = options || {};

		if (options.data !== undefined) {
			err.data = options.data;
		}

		if (options.decorate) {
			Object.assign(err, options.decorate);
		}

		if (!err.isBoom) {
			return err.initialize(err, options.code || 13, options.message);
		}

		if (
			options.override === false || // Defaults to true
			(!options.code && !options.message)
		) {
			return err;
		}

		return err.initialize(err, options.code || err.output.code, options.message);
	}

	/**
	 * Not an error; returned on success
	 */
	public static ok(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 0, data, ctor: GrpcBoom.ok });
	}

	/**
	 * The operation was cancelled (typically by the caller).
	 */

	public static cancelled(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 1, data, ctor: GrpcBoom.cancelled });
	}

	/**
	 * Unknown error.  An example of where this error may be returned is
	 * if a status value received from another address space belongs to
	 * an error-space that is not known in this address space.  Also
	 * errors raised by APIs that do not return enough error information
	 * may be converted to this error.
	 */

	public static unknown(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 2, data, ctor: GrpcBoom.unknown });
	}

	/**
	 * Client specified an invalid argument.  Note that this differs
	 * from FAILED_PRECONDITION.  INVALID_ARGUMENT indicates arguments
	 * that are problematic regardless of the state of the system
	 * (e.g., a malformed file name).
	 */

	public static invalidArgument(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 3, data, ctor: GrpcBoom.invalidArgument });
	}

	/**
	 * Deadline expired before operation could complete.  For operations
	 * that change the state of the system, this error may be returned
	 * even if the operation has completed successfully.  For example, a
	 * successful response from a server could have been delayed long
	 * enough for the deadline to expire.
	 */
	public static deadlineExceeded(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 4, data, ctor: GrpcBoom.deadlineExceeded });
	}

	/**
	 * Some requested entity (e.g., file or directory) was not found.
	 */
	public static notFound(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 5, data, ctor: GrpcBoom.notFound });
	}

	/**
	 * Some entity that we attempted to create (e.g., file or directory)
	 * already exists.
	 */
	public static alreadyExists(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 6, data, ctor: GrpcBoom.alreadyExists });
	}

	/**
	 * The caller does not have permission to execute the specified
	 * operation.  PERMISSION_DENIED must not be used for rejections
	 * caused by exhausting some resource (use RESOURCE_EXHAUSTED
	 * instead for those errors).  PERMISSION_DENIED must not be
	 * used if the caller can not be identified (use UNAUTHENTICATED
	 * instead for those errors).
	 */
	public static permissionDenied(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 7, data, ctor: GrpcBoom.permissionDenied });
	}

	/**
	 * Some resource has been exhausted, perhaps a per-user quota, or
	 * perhaps the entire file system is out of space.
	 */
	public static resourceExhausted(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 8, data, ctor: GrpcBoom.resourceExhausted });
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
	public static failedPrecondition(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 9, data, ctor: GrpcBoom.failedPrecondition });
	}

	/**
	 * The operation was aborted, typically due to a concurrency issue
	 * like sequencer check failures, transaction aborts, etc.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 */
	public static aborted(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 10, data, ctor: GrpcBoom.aborted });
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
	public static outOfRange(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 11, data, ctor: GrpcBoom.outOfRange });
	}

	/**
	 * Operation is not implemented or not supported/enabled in this service.
	 */
	public static unimplemented(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 12, data, ctor: GrpcBoom.unimplemented });
	}

	/**
	 * Internal errors. Means some invariants expected by underlying
	 * system has been broken. If you see one of these errors,
	 * something is very broken.
	 */
	public static internal(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 13, data, ctor: GrpcBoom.internal });
	}

	/**
	 * The service is currently unavailable.  This is a most likely a
	 * transient condition and may be corrected by retrying with
	 * a back off.
	 *
	 * See litmus test above for deciding between FAILED_PRECONDITION,
	 * ABORTED, and UNAVAILABLE.
	 */
	public static unavailable(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 14, data, ctor: GrpcBoom.unavailable });
	}

	/**
	 * Unrecoverable data loss or corruption.
	 */
	public static dataLoss(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 15, data, ctor: GrpcBoom.dataLoss });
	}

	/**
	 * The request does not have valid authentication credentials for the
	 * operation.
	 */
	public static unauthenticated(message: string, data: any): GrpcBoom {
		return new GrpcBoom(message, { code: 16, data, ctor: GrpcBoom.unauthenticated });
	}

	public initialize(err: GrpcBoom, code: number, message?: string | Error) {
		err.isBoom = true;

		if (!err.hasOwnProperty('data')) {
			err.data = null;
		}

		err.output = {
			code,
			payload: {}
		};

		err.reformat = this.reformat;

		if (!message && !err.message) {
			err.reformat();
			message = err.output.payload.error;
		}

		if (message) {
			err.message = message + (err.message ? ': ' + err.message : '');
			err.output.payload.message = err.message;
		}

		err.reformat();
		return err;
	}

	public reformat(debug?: boolean) {
		this.output.payload.code = this.output.code;
		this.output.payload.error = this.codes.get(this.output.code) || 'Unknown';

		if (this.output.code === 13 && debug !== true) {
			this.output.payload.message = 'An internal server error occurred'; // Hide actual error from user
		} else if (this.message) {
			this.output.payload.message = this.message;
		}
	}

	public serverError(
		message: string,
		data: any,
		code: number,
		ctor: (message: string, data: any) => any
	) {
		if (data instanceof GrpcBoom && !data.isBoom) {
			return GrpcBoom.boomifyClone(data, { code, message });
		}

		return new GrpcBoom(message, { code, data, ctor });
	}

	private static clone(obj: any, options = {}) {
		if (typeof obj !== 'object' || obj === null) {
			return obj;
		}

		const seen = new Map();
		const lookup = seen.get(obj);
		if (lookup) {
			return lookup;
		}

		let newObj;
		let cloneDeep = false;
		const isArray = Array.isArray(obj);

		if (!isArray) {
			if (Buffer.isBuffer(obj)) {
				newObj = Buffer.from(obj);
			} else if (obj instanceof Date) {
				newObj = new Date(obj.getTime());
			} else if (obj instanceof RegExp) {
				newObj = new RegExp(obj);
			} else {
				const proto = Object.getPrototypeOf(obj);
				if (proto && proto.isImmutable) {
					newObj = obj;
				} else {
					newObj = Object.create(proto);
					cloneDeep = true;
				}
			}
		} else {
			newObj = [];
			cloneDeep = true;
		}

		seen.set(obj, newObj);

		if (cloneDeep) {
			const keys = this.keys(obj, options);
			for (const key of keys) {
				if (isArray && key === 'length') {
					continue;
				}

				const descriptor = Object.getOwnPropertyDescriptor(obj, key);
				if (descriptor && (descriptor.get || descriptor.set)) {
					Object.defineProperty(newObj, key, descriptor);
				} else {
					Object.defineProperty(newObj, key, {
						enumerable: descriptor ? descriptor.enumerable : true,
						writable: true,
						configurable: true,
						value: exports.clone(obj[key], options, seen)
					});
				}
			}

			if (isArray) {
				newObj.length = obj.length;
			}
		}

		return newObj;
	}

	private static keys(obj: any, options: { symbols?: any } = {}) {
		return options.symbols ? Reflect.ownKeys(obj) : Object.getOwnPropertyNames(obj);
	}
}
