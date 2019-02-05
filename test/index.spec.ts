import Metadata from '../src/example/metadata';
import GrpcBoom, { Status } from '../src/index';

// tslint:disable no-console

describe('Test Public Functions', () => {
	it('should be able to create an error object from the constructor', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('constructed', 'true');
		const grpcBoom = new GrpcBoom('Constructor Example!', { code: Status.CANCELLED, metadata });

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Constructor Example!');
		expect(grpcBoom.code).toEqual(1);
		expect(grpcBoom.error).toEqual('CANCELLED');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('constructed');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create an error object using boomify', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('boomified', 'true');
		const grpcBoom = GrpcBoom.boomify(new Error('Boomify Example!'), {
			code: Status.UNKNOWN,
			metadata
		});

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Boomify Example!');
		expect(grpcBoom.code).toEqual(2);
		expect(grpcBoom.error).toEqual('UNKNOWN');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('boomified');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create an error object using a custom error', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('customised', 'true');
		const grpcBoom = GrpcBoom.boomify(new Error('Custom Example!'), {
			code: 200,
			metadata,
			error: 'CUSTOM_EXAMPLE'
		});

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Custom Example!');
		expect(grpcBoom.code).toEqual(200);
		expect(grpcBoom.error).toEqual('CUSTOM_EXAMPLE');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('customised');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create an error object using the invalid argument convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('name', 'Cannot be more than 10 characters');
		const grpcBoom = GrpcBoom.invalidArgument('Validation failed', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Validation failed');
		expect(grpcBoom.code).toEqual(3);
		expect(grpcBoom.error).toEqual('INVALID_ARGUMENT');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('name');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('Cannot be more than 10 characters');
		}
		done();
	});

});
