const admin = require('firebase-admin');

const db = admin.firestore();

const ENTITY_ALREADY_EXISTS_ERR_CODE = 6;

/**
 * Create document with the provided object values if document does not exist.
 * @param {string} collectionPath
 * @param {string} documentPath
 * @param {object} data
 * @returns  1 if the document was create, otherwise 0.
 */
async function setnx(collectionPath, documentPath, data) {
    if (!collectionPath) {
        throw new Error('"collectionPath" is not allowed to be empty')
    }

    if (!documentPath) {
        throw new Error('"documentPath" is not allowed to be empty')
    }

    try {
        await db.collection(collectionPath).doc(documentPath).create(data);

        return 1;
    } catch (e) {
        if (e.code === ENTITY_ALREADY_EXISTS_ERR_CODE) {
            return 0;
        }

        throw e;
    }
}

/**
 * Sets a time limit on an firestore method.
 * @param {Function} fn The firestore method to limit in time.
 * @param {number} milliseconds The specified time limit.
 * @returns {Function} Returns a wrapped function.
 */
function timeout(fn, milliseconds) {
    if (!fn || typeof fn !== 'function') {
        throw new Error('"fn" must be of type function')
    }

    const ms = milliseconds || 1000;

    function wrapped(...args) {
        return Promise.race([
            fn(...args),
            (() => new Promise((resolve, reject) => setTimeout(() => reject(new Error(`Function execution took more than ${ms} ms`)), ms)))(),
        ])
    }

    return wrapped;
}

module.exports = {
    setnx,
    timeout,
}
