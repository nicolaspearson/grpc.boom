import { Metadata } from '../example/metadata';
import GrpcBoom, { Status } from '../src/index';

// tslint:disable no-console

describe('Test Public Functions', () => {
	it('should be able to create a boom object from the constructor', async (done) => {
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

	it('should be able to create a boom object using boomify', async (done) => {
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

	it('should be able to create a boom object using a custom error', async (done) => {
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

	it('should be able to create a boom object using the ok convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.ok('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(0);
		expect(grpcBoom.error).toEqual('OK');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the cancelled convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.cancelled('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(1);
		expect(grpcBoom.error).toEqual('CANCELLED');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the unknown convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.unknown('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(2);
		expect(grpcBoom.error).toEqual('UNKNOWN');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the invalid argument convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.invalidArgument('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(3);
		expect(grpcBoom.error).toEqual('INVALID_ARGUMENT');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the deadline exceeded convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.deadlineExceeded('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(4);
		expect(grpcBoom.error).toEqual('DEADLINE_EXCEEDED');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the not found convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.notFound('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(5);
		expect(grpcBoom.error).toEqual('NOT_FOUND');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the already exists convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.alreadyExists('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(6);
		expect(grpcBoom.error).toEqual('ALREADY_EXISTS');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the permission denied convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.permissionDenied('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(7);
		expect(grpcBoom.error).toEqual('PERMISSION_DENIED');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the resource exhausted convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.resourceExhausted('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(8);
		expect(grpcBoom.error).toEqual('RESOURCE_EXHAUSTED');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the failed precondition convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.failedPrecondition('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(9);
		expect(grpcBoom.error).toEqual('FAILED_PRECONDITION');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the aborted convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.aborted('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(10);
		expect(grpcBoom.error).toEqual('ABORTED');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the out of range convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.outOfRange('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(11);
		expect(grpcBoom.error).toEqual('OUT_OF_RANGE');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the unimplemented convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.unimplemented('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(12);
		expect(grpcBoom.error).toEqual('UNIMPLEMENTED');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the internal convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.internal('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(13);
		expect(grpcBoom.error).toEqual('INTERNAL');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the unavailable convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.unavailable('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(14);
		expect(grpcBoom.error).toEqual('UNAVAILABLE');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the dataLoss convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.dataLoss('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(15);
		expect(grpcBoom.error).toEqual('DATA_LOSS');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});

	it('should be able to create a boom object using the unauthenticated convenience method', async (done) => {
		const metadata: Metadata = new Metadata();
		metadata.set('convenience', 'true');
		const grpcBoom = GrpcBoom.unauthenticated('Convenience', metadata);

		expect(grpcBoom.isBoom).toEqual(true);
		expect(grpcBoom.message).toEqual('Convenience');
		expect(grpcBoom.code).toEqual(16);
		expect(grpcBoom.error).toEqual('UNAUTHENTICATED');
		expect(grpcBoom.name).toEqual('Error');

		expect(grpcBoom.metadata).toBeDefined();
		if (grpcBoom.metadata) {
			const metadataValue = grpcBoom.metadata.get('convenience');
			expect(metadataValue.length).toBeGreaterThan(0);
			expect(metadataValue[0]).toEqual('true');
		}
		done();
	});
});
