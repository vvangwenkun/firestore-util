const { initializeApp  } = require('firebase-admin/app');

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIRESTORE_PROJECT_ID = 'firestore-util';

initializeApp({
  projectId: 'firestore-util',
});
