const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const { setnx, timeout } = require('../lib/db');
const { deleteCollection } = require('./helper');

const db = admin.firestore();

function sum(...values) {
    return values.reduce((sum, value) => sum + value, 0);
}

describe('db', () => {
    const collectionPath = 'pets';

    beforeEach(async () => {
        const snapshot = await db.collection(collectionPath).get();

        await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()))
    });

    afterAll(async () => {
        await deleteCollection(db, collectionPath);
    })

    describe('setnx', () => {
        test('Return 1 if the document was create', async () => {
            const result = await Promise.all([
                setnx(collectionPath, uuidv4(), { name: 'juice' }),
                setnx(collectionPath, uuidv4(), { name: 'aric' }),
                setnx(collectionPath, uuidv4(), { name: 'miko' }),
            ]);

            expect(sum(...result)).toEqual(3);
        });

        test('Return 0 if the document exists', async () => {
            const documentPath = uuidv4();

            const result = await Promise.all([
                setnx(collectionPath, documentPath, { name: 'juice' }),
                setnx(collectionPath, documentPath, { name: 'aric' }),
                setnx(collectionPath, documentPath, { name: 'miko' }),
            ]);

            expect(sum(...result)).toEqual(1);
        });

        test('Throw an exception if the error is unexpected', async () => {
            await expect(setnx(collectionPath, null, { name: 'aric' })).rejects.toThrow();
        });
    });

    describe('timeout', () => {
        test('Return result', async () => {
            const wrapped = timeout(() => db.collection(collectionPath).where('name', '==', 'aric').get(), 1000);

            await expect(wrapped()).resolves.toBeDefined();
        });

        test('Throw an exception if timeout', async () => {
            function delayGet() {
                return new Promise((resolve) => {
                    setTimeout(async () => {
                        const snapshot = await db.collection(collectionPath).where('name', '==', 'aric').get();

                        resolve(snapshot);
                    }, 500);
                });
            }

            const wrapped = timeout(delayGet, 100);

            await expect(wrapped()).rejects.toThrow('Function execution took more than 100 ms');
        });
    });
});
