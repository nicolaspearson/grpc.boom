import { Metadata as IMetadata, MetadataValue } from '../index';

// A simple class implementing very basic functionality that
// mimics using the MetaData class from the grpc package.
// Do not use this implementation, it is simply for illustrative
// purposes. You should be using the provided implementation
// from the grpc package.

// tslint:disable variable-name
export default class Metadata implements IMetadata {
	private _internal_repr: any = {};

	constructor() {
		this._internal_repr = {};
	}

	public set = (key: string, value: MetadataValue) => {
		this._internal_repr[key] = [value];
	};

	public add = (key: string, value: MetadataValue) => {
		if (!this._internal_repr[key]) {
			this._internal_repr[key] = [];
		}
		this._internal_repr[key].push(value);
	};

	public remove = (key: string) => {
		if (Object.prototype.hasOwnProperty.call(this._internal_repr, key)) {
			delete this._internal_repr[key];
		}
	};

	public get = (key: string) => {
		if (Object.prototype.hasOwnProperty.call(this._internal_repr, key)) {
			return this._internal_repr[key];
		} else {
			return [];
		}
	};

	public getMap = (): { [key: string]: MetadataValue } => {
		const result: any = {};
		Object.keys(this._internal_repr).forEach((key) => {
			const values = this._internal_repr[key];
			if (values.length > 0) {
				result[key] = values[0];
			}
		});
		return result;
	};

	public clone = (): IMetadata => {
		// Not implemented
		return this;
	};
}
