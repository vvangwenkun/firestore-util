const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const firebaseFunctionTest  = require('firebase-functions-test')();
const triggers = require('../../lib/triggers/v2');
const { deleteCollection } = require('../helper');

const db = admin.firestore();

describe('2nd gen cloud firestore triggers', () => {
    afterAll(async () => {
        await deleteCollection(db, 'firestore-events');
    })

    describe('onCreateOnce', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        const handler = jest.fn();
        const shouldHandleEvent = jest.fn(() => true);
        const onCreateOnceWrapped = firebaseFunctionTest.wrap(triggers.onCreateOnce('users/{userId}', handler, { shouldHandleEvent }));

        const event = {
            id: uuidv4(),
            data: firebaseFunctionTest.firestore.makeDocumentSnapshot({ name: 'aric' }, `users/${uuidv4()}`),
        }

        test('The same event ID only triggered once', async () => {
            await Promise.all([
                onCreateOnceWrapped(event),
                onCreateOnceWrapped(event),
                onCreateOnceWrapped(event),
            ]);

            expect(shouldHandleEvent).nthCalledWith(1, expect.objectContaining(event.data.data()));

            expect(handler).toBeCalledTimes(1);
            expect(handler).toBeCalledWith(expect.objectContaining(event));
        });

        test('The different event ID will triggered multiple times', async () => {
            await Promise.all([
                onCreateOnceWrapped({
                    ...event,
                    id: uuidv4(),
                }),
                onCreateOnceWrapped({
                    ...event,
                    id: uuidv4(),
                }),
                onCreateOnceWrapped({
                    ...event,
                    id: uuidv4(),
                }),
            ]);

            expect(shouldHandleEvent).nthCalledWith(1, expect.objectContaining(event.data.data()));

            expect(handler).toBeCalledTimes(3);
        });

        test('Not a target event', async () => {
            const  shouldHandleEvent = jest.fn(() => false);

            await firebaseFunctionTest.wrap(triggers.onCreateOnce('users/{userId}', handler, { shouldHandleEvent }))({
                ...event,
                id: uuidv4(),
            });

            expect(shouldHandleEvent).toBeCalledWith(expect.objectContaining(event.data.data()));

            expect(handler).not.toBeCalled();
        });
    });

    describe('onUpdateOnce', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        const handler = jest.fn();
        const shouldHandleEvent = jest.fn(() => true);
        const onUpdateOnceWrapped = firebaseFunctionTest.wrap(triggers.onUpdateOnce('users/{userId}', handler, { shouldHandleEvent }));

        const event = {
            id: uuidv4(),
            data: {
                before: firebaseFunctionTest.firestore.makeDocumentSnapshot({ name: 'aric' }, `users/${uuidv4()}`),
                after: firebaseFunctionTest.firestore.makeDocumentSnapshot({ name: 'juice' }, `users/${uuidv4()}`),
            },
        };

        test('The same event ID only triggered once', async () => {
            await Promise.all([
                onUpdateOnceWrapped(Object.assign({}, event)),
                onUpdateOnceWrapped(Object.assign({}, event)),
                onUpdateOnceWrapped(Object.assign({}, event)),
            ]);

            expect(shouldHandleEvent).toBeCalledWith(expect.objectContaining(event.data.after.data()), expect.objectContaining(event.data.before.data()));

            expect(handler).toBeCalledTimes(1);
            expect(handler).toBeCalledWith(expect.objectContaining((event)));
        });

        test('The different event ID will triggered multiple times', async () => {
            await Promise.all([
                onUpdateOnceWrapped({
                    ...event,
                    id: uuidv4(),
                }),
                onUpdateOnceWrapped({
                    ...event,
                    id: uuidv4(),
                }),
                onUpdateOnceWrapped({
                    ...event,
                    id: uuidv4(),
                }),
            ]);

            expect(shouldHandleEvent).toBeCalledWith(event.data.after.data(), event.data.before.data());

            expect(handler).toBeCalledTimes(3);
        });

        test('Not a target event', async () => {
            const  shouldHandleEvent = jest.fn(() => false);

            await firebaseFunctionTest.wrap(triggers.onUpdateOnce('users/{userId}', handler, { shouldHandleEvent }))({
                ...event,
                id: uuidv4(),
            });

            expect(shouldHandleEvent).toBeCalledWith(expect.objectContaining(event.data.after.data()), expect.objectContaining(event.data.before.data()));

            expect(handler).not.toBeCalled();
        });
    });

    describe('onDeleteOnce', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        const handler = jest.fn();
        const shouldHandleEvent = jest.fn(() => true);
        const onDeleteOnceWrapped = firebaseFunctionTest.wrap(triggers.onDeleteOnce('users/{userId}', handler, { shouldHandleEvent }));

        const event = {
            id: uuidv4(),
            data: firebaseFunctionTest.firestore.makeDocumentSnapshot({ name: 'aric' }, `users/${uuidv4()}`),
        }

        test('The same event ID only triggered once', async () => {
            await Promise.all([
                onDeleteOnceWrapped(event),
                onDeleteOnceWrapped(event),
                onDeleteOnceWrapped(event),
            ]);

            expect(shouldHandleEvent).toBeCalledWith(expect.objectContaining(event.data.data()));

            expect(handler).toBeCalledTimes(1);
            expect(handler).toBeCalledWith(expect.objectContaining(event));
        });

        test('The different event ID will triggered multiple times', async () => {
            await Promise.all([
                onDeleteOnceWrapped({
                    ...event,
                    id: uuidv4(),
                }),
                onDeleteOnceWrapped({
                    ...event,
                    id: uuidv4(),
                }),
                onDeleteOnceWrapped({
                    ...event,
                    id: uuidv4(),
                }),
            ]);

            expect(shouldHandleEvent).toBeCalledWith(expect.objectContaining(event.data.data()));

            expect(handler).toBeCalledTimes(3);
        });

        test('Not a target event', async () => {
            const  shouldHandleEvent = jest.fn(() => false);

            await firebaseFunctionTest.wrap(triggers.onDeleteOnce('users/{userId}', handler, { shouldHandleEvent }))({
                ...event,
                id: uuidv4(),
            });

            expect(shouldHandleEvent).toBeCalledWith(expect.objectContaining(event.data.data()));

            expect(handler).not.toBeCalled();
        });
    });

    describe('onWriteOnce', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        const handler = jest.fn();
        const shouldHandleEvent = jest.fn(() => true);
        const onWriteOnceWrapped = firebaseFunctionTest.wrap(triggers.onWriteOnce('users/{userId}', handler, { shouldHandleEvent }));

        const documentPath = `users/${uuidv4()}`;

        const event = {
            id: uuidv4(),
            data: {
                before: firebaseFunctionTest.firestore.makeDocumentSnapshot({ name: 'aric' }, documentPath),
                after: firebaseFunctionTest.firestore.makeDocumentSnapshot({ name: 'juice' }, documentPath),
            },
        };

        test('The same event ID only triggered once', async () => {
            await Promise.all([
                onWriteOnceWrapped(Object.assign({}, event)),
                onWriteOnceWrapped(Object.assign({}, event)),
                onWriteOnceWrapped(Object.assign({}, event)),
            ]);

            expect(shouldHandleEvent).nthCalledWith(1, expect.objectContaining(event.data.after.data()), expect.objectContaining(event.data.before.data()));

            expect(handler).toBeCalledTimes(1);
            expect(handler).toBeCalledWith(expect.objectContaining(event));
        });

        test('The different event ID will triggered multiple times', async () => {
            await Promise.all([
                onWriteOnceWrapped({
                    ...event,
                    id: uuidv4(),
                }),
                onWriteOnceWrapped({
                    ...event,
                    id: uuidv4(),
                }),
                onWriteOnceWrapped({
                    ...event,
                    id: uuidv4(),
                }),
            ]);

            expect(shouldHandleEvent).nthCalledWith(1, event.data.after.data(), event.data.before.data());

            expect(handler).toBeCalledTimes(3);
        });

        test('Not a target event', async () => {
            const  shouldHandleEvent = jest.fn(() => false);

            await firebaseFunctionTest.wrap(triggers.onWriteOnce('users/{userId}', handler, { shouldHandleEvent }))({
                ...event,
                id: uuidv4(),
            });

            expect(shouldHandleEvent).toBeCalledWith(expect.objectContaining(event.data.after.data()), expect.objectContaining(event.data.before.data()));

            expect(handler).not.toBeCalled();
        });
    });
});
