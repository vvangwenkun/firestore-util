/**
 * 2nd gen cloud firestore triggers
 */

const functions = require('firebase-functions/v2');
const { setnx } = require('../db');

const DEFAULT_OPTIONS = {
    firestoreEventsPath: 'firestore-events',
};

/**
 * Validates arguments and throws if validation fails.
 */
function assertArgs(path, handler, options) {
    if (!path || typeof path !== 'string') {
        throw new Error('"path" must be a non-empty string');
    }

    if (!handler || typeof handler !== 'function') {
        throw new Error('"handler" must be of type function');
    }

    if (options?.fireEventsPath && typeof options.fireEventsPath !== 'string') {
        throw new Error('"options.fireEventsPath" must be a string');
    }

    if (options?.shouldHandleEvent && typeof options.shouldHandleEvent !== 'function') {
        throw new Error('"options.shouldHandleEvent" must be of type function');
    }
}

/**
 * Triggered when a document is written to for the first time, and ensured to be triggered only once.
 * @param {string} path Full database path to listen to.
 * @param {(event: object) => Promise} handler The Event Trigger handler.
 * @param {object} options
 * @param {(data: object) => Promise<boolean|number>} options.shouldHandleEvent Returns truly if the event should be handled.
 * @param {string} [options.firestoreEventsPath=firestore-events] Collection path of triggered events.
 * @returns {Function} Returns a Cloud Firestore function trigger
 */
function onCreateOnce(path, handler, options) {
    assertArgs(path, handler, options);

    const {
        shouldHandleEvent, firestoreEventsPath,
    } = Object.assign(DEFAULT_OPTIONS, options);

    return functions
        .firestore
        .onDocumentCreated(path, async (event) => {
            const { id: eventId, type: eventType, data: snapshot } = event;

            if (shouldHandleEvent) {
                const should = await shouldHandleEvent(snapshot.data());
                if (!should) {
                    return;
                }
            }

            const ok = await setnx(firestoreEventsPath, eventId, { eventType });
            if (!ok) {
                return;
            }


            await handler(event);
        })
}

/**
 * Triggered when a document already exists and has any value changed, and ensured to be triggered only once.
 * @param {string} path Full database path to listen to.
 * @param {(event: object) => Promise} handler The Event Trigger handler.
 * @param {object} options
 * @param {(after: object, before: object) => Promise<boolean|number>} options.shouldHandleEvent Returns truly if the event should be handled.
 * @param {string} [options.firestoreEventsPath=firestore-events] Collection path of triggered events.
 * @returns {Function} Returns a Cloud Firestore function trigger
 */
function onUpdateOnce(path, handler, options) {
    assertArgs(path, handler, options);

    const {
        shouldHandleEvent, firestoreEventsPath,
    } = Object.assign(DEFAULT_OPTIONS, options);

    return functions
        .firestore
        .onDocumentUpdated(path, async (event) => {
            const { id: eventId, type: eventType, data: change } = event;

            if (shouldHandleEvent) {
                const should = await shouldHandleEvent(change.after.data(), change.before.data());
                if (!should) {
                    return;
                }
            }

            const ok = await setnx(firestoreEventsPath, eventId, { eventType });
            if (!ok) {
                return;
            }

            await handler(event);
        })
}

/**
 * Triggered when a document is deleted, and ensured to be triggered only once.
 * @param {string} path Full database path to listen to.
 * @param {(event: object) => Promise} handler The Event Trigger handler.
 * @param {object} options
 * @param {(data: object) => Promise<boolean|number>} options.shouldHandleEvent Returns truly if the event should be handled.
 * @param {string} [options.firestoreEventsPath=firestore-events] Collection path of triggered events.
 * @returns {Function} Returns a Cloud Firestore function trigger
 */
function onDeleteOnce(path, handler, options) {
    assertArgs(path, handler, options);

    const {
        shouldHandleEvent, firestoreEventsPath,
    } = Object.assign(DEFAULT_OPTIONS, options);

    return functions
        .firestore
        .onDocumentDeleted(path, async (event) => {
            const { id: eventId, type: eventType, data: snapshot } = event;

            if (shouldHandleEvent) {
                const should = await shouldHandleEvent(snapshot.data());
                if (!should) {
                    return;
                }
            }

            const ok = await setnx(firestoreEventsPath, eventId, { eventType });
            if (!ok) {
                return;
            }

            await handler(event);
        })
}

/**
 * Triggered when onDocumentCreated, onDocumentUpdated or onDocumentDeleted is triggered, and ensured to be triggered only once.
 * @param {string} path Full database path to listen to.
 * @param {(event: object) => Promise} handler The Event Trigger handler.
 * @param {object} options
 * @param {(after: object, before: object) => Promise<boolean|number>} options.shouldHandleEvent Returns truly if the event should be handled.
 * @param {string} [options.firestoreEventsPath=firestore-events] Collection path of triggered events.
 * @returns {Function} Returns a Cloud Firestore function trigger
 */
function onWriteOnce(path, handler, options) {
    assertArgs(path, handler, options);

    const {
        shouldHandleEvent, firestoreEventsPath,
    } = Object.assign(DEFAULT_OPTIONS, options);

    return functions
        .firestore
        .onDocumentWritten(path, async (event) => {
            const { id: eventId, type: eventType, data: change } = event;

            if (shouldHandleEvent) {
                const should = await shouldHandleEvent(change.after.data(), change.before.data());
                if (!should) {
                    return;
                }
            }

            const ok = await setnx(firestoreEventsPath, eventId, { eventType });
            if (!ok) {
                return;
            }

            await handler(event);
        })
}

module.exports = {
    onCreateOnce,
    onUpdateOnce,
    onDeleteOnce,
    onWriteOnce,
}
