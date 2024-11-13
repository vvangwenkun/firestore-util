const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const { wrap }  = require('firebase-functions-test')();
const triggers = require('../../lib/triggers/v1');
const { deleteCollection } = require('../helper');

const db = admin.firestore();

describe('1st gen cloud firestore triggers', () => {
    afterAll(async () => {
        await deleteCollection(db, 'firestore-events');
    })

    describe('onCreateOnce', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        const handler = jest.fn();
        const shouldHandleEvent = jest.fn(() => true);
        const onCreateOnceWrapped = wrap(triggers.onCreateOnce('users/{userId}', handler, { shouldHandleEvent }));

        const snapshot = {
            data: () => ({
                name: 'aric',
            }),
        };
        const context = {
            eventId: uuidv4(),
        };

        test('The same event ID only triggered once', async () => {
            await Promise.all([
                onCreateOnceWrapped(snapshot, context),
                onCreateOnceWrapped(snapshot, context),
                onCreateOnceWrapped(snapshot, context),
            ]);

            expect(shouldHandleEvent).toBeCalledWith(snapshot.data());

            expect(handler).toBeCalledTimes(1);
            expect(handler).toBeCalledWith(snapshot, expect.objectContaining(context));
        });

        test('The different event ID will triggered multiple times', async () => {
            await Promise.all([
                onCreateOnceWrapped(snapshot, {
                    ...context,
                    eventId: uuidv4(),
                }),
                onCreateOnceWrapped(snapshot, {
                    ...context,
                    eventId: uuidv4(),
                }),
                onCreateOnceWrapped(snapshot, {
                    ...context,
                    eventId: uuidv4(),
                }),
            ]);

            expect(shouldHandleEvent).toBeCalledWith(snapshot.data());

            expect(handler).toBeCalledTimes(3);
        });

        test('Not a target event', async () => {
            const  shouldHandleEvent = jest.fn(() => false);

            await wrap(triggers.onCreateOnce('users/{userId}', handler, { shouldHandleEvent }))(snapshot, {
                ...context,
                eventId: uuidv4(),
            });

            expect(shouldHandleEvent).toBeCalledWith(snapshot.data());

            expect(handler).not.toBeCalled();
        });
    });

    describe('onUpdateOnce', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        const handler = jest.fn();
        const shouldHandleEvent = jest.fn(() => true);
        const onUpdateOnceWrapped = wrap(triggers.onUpdateOnce('users/{userId}', handler, { shouldHandleEvent }));

        const change = {
            before: {
                data: () => ({
                    name: 'aric',
                }),
            },
            after: {
                data: () => ({
                    name: 'aric',
                }),
            },
        };
        const context = {
            eventId: uuidv4(),
        };

        test('The same event ID only triggered once', async () => {
            await Promise.all([
                onUpdateOnceWrapped(change, context),
                onUpdateOnceWrapped(change, context),
                onUpdateOnceWrapped(change, context),
            ]);

            expect(shouldHandleEvent).toBeCalledWith(change.after.data(), change.before.data());

            expect(handler).toBeCalledTimes(1);
            expect(handler).toBeCalledWith(change, expect.objectContaining(context));
        });

        test('The different event ID will triggered multiple times', async () => {
            await Promise.all([
                onUpdateOnceWrapped(change, {
                    ...context,
                    eventId: uuidv4(),
                }),
                onUpdateOnceWrapped(change, {
                    ...context,
                    eventId: uuidv4(),
                }),
                onUpdateOnceWrapped(change, {
                    ...context,
                    eventId: uuidv4(),
                }),
            ]);

            expect(shouldHandleEvent).toBeCalledWith(change.after.data(), change.before.data());

            expect(handler).toBeCalledTimes(3);
        });

        test('Not a target event', async () => {
            const  shouldHandleEvent = jest.fn(() => false);

            await wrap(triggers.onUpdateOnce('users/{userId}', handler, { shouldHandleEvent }))(change, {
                ...context,
                eventId: uuidv4(),
            });

            expect(shouldHandleEvent).toBeCalledWith(change.after.data(), change.before.data());

            expect(handler).not.toBeCalled();
        });
    });

    describe('onDeleteOnce', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        const handler = jest.fn();
        const shouldHandleEvent = jest.fn(() => true);
        const onDeleteOnceWrapped = wrap(triggers.onDeleteOnce('users/{userId}', handler, { shouldHandleEvent }));

        const snapshot = {
            data: () => ({
                name: 'aric',
            }),
        };
        const context = {
            eventId: uuidv4(),
        };

        test('The same event ID only triggered once', async () => {
            await Promise.all([
                onDeleteOnceWrapped(snapshot, context),
                onDeleteOnceWrapped(snapshot, context),
                onDeleteOnceWrapped(snapshot, context),
            ]);

            expect(shouldHandleEvent).toBeCalledWith(snapshot.data());

            expect(handler).toBeCalledTimes(1);
            expect(handler).toBeCalledWith(snapshot, expect.objectContaining(context));
        });

        test('The different event ID will triggered multiple times', async () => {
            await Promise.all([
                onDeleteOnceWrapped(snapshot, {
                    ...context,
                    eventId: uuidv4(),
                }),
                onDeleteOnceWrapped(snapshot, {
                    ...context,
                    eventId: uuidv4(),
                }),
                onDeleteOnceWrapped(snapshot, {
                    ...context,
                    eventId: uuidv4(),
                }),
            ]);

            expect(shouldHandleEvent).toBeCalledWith(snapshot.data());

            expect(handler).toBeCalledTimes(3);
        });

        test('Not a target event', async () => {
            const  shouldHandleEvent = jest.fn(() => false);

            await wrap(triggers.onDeleteOnce('users/{userId}', handler, { shouldHandleEvent }))(snapshot, {
                ...context,
                eventId: uuidv4(),
            });

            expect(shouldHandleEvent).toBeCalledWith(snapshot.data());

            expect(handler).not.toBeCalled();
        });
    });

    describe('onWriteOnce', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        const handler = jest.fn();
        const shouldHandleEvent = jest.fn(() => true);
        const onWriteOnceWrapped = wrap(triggers.onWriteOnce('users/{userId}', handler, { shouldHandleEvent }));

        const change = {
            before: {
                data: () => ({
                    name: 'aric',
                }),
            },
            after: {
                data: () => ({
                    name: 'aric',
                }),
            },
        };
        const context = {
            eventId: uuidv4(),
        };

        test('The same event ID only triggered once', async () => {
            await Promise.all([
                onWriteOnceWrapped(change, context),
                onWriteOnceWrapped(change, context),
                onWriteOnceWrapped(change, context),
            ]);

            expect(shouldHandleEvent).toBeCalledWith(change.after.data(), change.before.data());

            expect(handler).toBeCalledTimes(1);
            expect(handler).toBeCalledWith(change, expect.objectContaining(context));
        });

        test('The different event ID will triggered multiple times', async () => {
            await Promise.all([
                onWriteOnceWrapped(change, {
                    ...context,
                    eventId: uuidv4(),
                }),
                onWriteOnceWrapped(change, {
                    ...context,
                    eventId: uuidv4(),
                }),
                onWriteOnceWrapped(change, {
                    ...context,
                    eventId: uuidv4(),
                }),
            ]);

            expect(shouldHandleEvent).toBeCalledWith(change.after.data(), change.before.data());

            expect(handler).toBeCalledTimes(3);
        });

        test('Not a target event', async () => {
            const  shouldHandleEvent = jest.fn(() => false);

            await wrap(triggers.onWriteOnce('users/{userId}', handler, { shouldHandleEvent }))(change, {
                ...context,
                eventId: uuidv4(),
            });

            expect(shouldHandleEvent).toBeCalledWith(change.after.data(), change.before.data());

            expect(handler).not.toBeCalled();
        });
    });
});
