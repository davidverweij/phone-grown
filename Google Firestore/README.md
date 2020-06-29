# Firestore Rules
Below is a copy of the security rules used in the Google Firestore database in this project. This merely shows the strictness of the database, and is copied here for reference and transparency.

In its current state, anyone can read any document in the `anonymous` collection. No authentication is required, which was chosen in order to simplify the user experience. In essence, no sensitive data is (or can be) stored in this document, so it should be relatively safe. This approach might be altered if vulnerabilities are determined.


```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // only the 'anonymous' collection can be accessed and edited
    match /anonymous/{userId} {

    	// a user can only create or update document when:
      // 1: it is an authenticated request
      // 2: the document bears the same name as the authenticated user
      // 3: the document only contains one field
      // 4: that field is named 'ping' and is an integer
    	allow update, create : if request.auth != null
      	&& request.auth.uid == userId
      	&& request.resource.data.size() == 1
        && request.resource.data.ping is int;

      // deleting a document is only possible when:
      // 1: it is an authenticated request
      // 2: the document bears the same name as the authenticated user
      allow delete : if request.auth != null
      	&& request.auth.uid == userId;

			// reading data is only possible through a get command,
      // lists (getting multiple documents) is not allowed.
      allow list: if false;
      allow get: if true;
    }
  }
}
```

## Result
The resulting database looks as follows, with more documents being added based on new anonymous users.
![Screenshot of the Database](database.png)
