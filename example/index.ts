import { Metadata } from 'grpc';

import GrpcBoom, { Status } from '../src/index';

// tslint:disable no-console
export default class Example {
	public constructorExample() {
		console.log('-------------------------');
		console.log('Constructor Example:');
		console.log('-------------------------');
		const metadata: Metadata = new Metadata();
		metadata.set('constructed', 'true');
		const grpcBoom = new GrpcBoom('Constructor Example!', { code: Status.CANCELLED, metadata });
		console.log(`isBoom: ${grpcBoom.isBoom}`);
		console.log(`message: ${grpcBoom.message}`);
		console.log(`code: ${grpcBoom.code}`);
		console.log(`error: ${grpcBoom.error}`);
		console.log(`metadata: ${JSON.stringify(grpcBoom.metadata)}`);
	}

	public boomifyExample() {
		console.log('-------------------------');
		console.log('Boomify Example:');
		console.log('-------------------------');
		const metadata: Metadata = new Metadata();
		metadata.set('boomified', 'true');
		const grpcBoom = GrpcBoom.boomify(new Error('Boomify Example!'), {
			code: Status.UNKNOWN,
			metadata
		});
		console.log(`isBoom: ${grpcBoom.isBoom}`);
		console.log(`message: ${grpcBoom.message}`);
		console.log(`code: ${grpcBoom.code}`);
		console.log(`error: ${grpcBoom.error}`);
		console.log(`metadata: ${JSON.stringify(grpcBoom.metadata)}`);
	}

	public convenienceExample() {
		console.log('-------------------------');
		console.log('Convenience Example:');
		console.log('-------------------------');
		const metadata: Metadata = new Metadata();
		metadata.set('name', 'Cannot be more than 10 characters');
		const grpcBoom = GrpcBoom.invalidArgument('Validation failed', metadata);
		console.log(`isBoom: ${grpcBoom.isBoom}`);
		console.log(`message: ${grpcBoom.message}`);
		console.log(`code: ${grpcBoom.code}`);
		console.log(`error: ${grpcBoom.error}`);
		console.log(`metadata: ${JSON.stringify(grpcBoom.metadata)}`);
	}

	public customExample() {
		console.log('-------------------------');
		console.log('Custom Example:');
		console.log('-------------------------');
		const metadata: Metadata = new Metadata();
		metadata.set('customised', 'true');
		const grpcBoom = GrpcBoom.boomify(new Error('Custom Example!'), {
			code: 200,
			metadata,
			error: 'CUSTOM_EXAMPLE'
		});
		console.log(`isBoom: ${grpcBoom.isBoom}`);
		console.log(`message: ${grpcBoom.message}`);
		console.log(`code: ${grpcBoom.code}`);
		console.log(`error: ${grpcBoom.error}`);
		console.log(`metadata: ${JSON.stringify(grpcBoom.metadata)}`);
	}
}

const example = new Example();
example.constructorExample();
example.boomifyExample();
example.convenienceExample();
example.customExample();
