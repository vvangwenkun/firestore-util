async function deleteCollection(db, collectionPath) {
  const snapshot = await db.collection(collectionPath).get();

  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  })

  await batch.commit();
}

module.exports = {
  deleteCollection,
}
