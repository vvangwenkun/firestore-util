# Firestore Util

The Firestore tool functions.

## Installation

`npm install firestore-util`

## Usage

```javascript
  const firestoreUtil = require('firestore-util')


  // Trigger a function when a new user is created
  firestoreUtil.triggers.v1.onCreateOnce('/users/{userId}', async (snapshot, context) => {
    const { userId } = context.params
    const username = snapshot.data().name
  })
```

## Functions

### triggers

| Firestore Cloud Functions | Support version |
| --- | --- |
| onCreateOnce | v1, v2 | 
| onUpdateOnce | v1, v2 |
| onDeleteOnce | v1, v2 |
| onWriteOnce  | v1, v2 |

### db

| Operations | Description |
| --- | --- |
| setnx | Create document with the provided object values if document does not exist. |
| timeout | Sets a time limit on an firestore method. |

## License

This repository is licensed under the MIT license.
The license can be found [here](./LICENSE).