# Google App Script (GAS)
Google App Script is a Javascript based language that allow the creation and deployment of scripts within the Google ecosystem. More interestingly, you can create document-bound scripts, which are embedded to a specific document (Google Doc, Sheet, Site, etc). In this project, we use this so that when someone makes a copy of the Google Sheet, this script is copied with it. Then, the owners can deploy the code themselves. This approach is beneficial because:
1. this provides full transparency and control over what the script does,
1. the document-bound script has more access and control over the document,
1. scalability (hosting and quotas) is no problem.

## Content
The [`appscript.json`](appscript.json) file contains the rules needed for this project to work. It sets the visibility of the app (if deployed) to public and to run as the user themselves, in order to write and read from the Google Sheet. It also states any authentication scopes the code needs in order to work, these currently include:
1. Spreadsheets - write and read from Google Spreadsheets,
1. External Requests - perform and receive HTTPS / REST requests, and
1. UI - add menu buttons to the UI and create popups

### The code
The [`Code.gs`](Code.gs) contains the code for the Google App Script which is bound to the document. It is extensively commented to explain each function, but here is a rundown:

- `onOpen()` is executed when the bound document is opened. It creates an additional menu to execute `setup()` and `addphone()`.
- `somethingChanged()` is called when - you guessed it - something changed. Different from the standard `onEdit()`, this method is also called when changes are made by a program, not only a user. We use this to detect whether new data came in or when some tabs of the Google Sheet are altered. If there is new data, it will trigger the `pingDatabase()` method.
- `doGet()` receives all HTTPS requests. It will validate the request and return the database identifier for the phone to listen to, as well as the background colours it should display at this moment.
- `updateDataSheet()` is called when something changed in the sheets (e.g. a new data source was created). It will then update the dashboard to reflect the new changes.
- `sortSheets()` will sort the sheets to ensure a logical and clean view for the user to interact with.
- `addphone()` offers to overwrite the current *phone* view with a new template. It will check which templates there are and offer you that choice through a popup.
- `customFormula()` can be used in the Google Sheet itself, and return the colour of a cell. This will ensure a live-preview of your created rules, and is triggered to recalculate when something changes on the referenced cells.
- `setup()` should only be called once, and creates an anonymous user for the Google Firestore database and stores the reference. It also activated the `somethingChanged()` listener.
- `prependRow()` is a tiny method to use instead of appendRow.
- `refreshDatabaseToken()` refreshes the authentication for the database once it expires (each 60 minutes).
- `pingDatabase()` updates the single field associated with the anonymous account with a new timestamp. If a phone is listening, it will see the change almost immediately and send a request for new background colours directly to the Google Sheet. In essence, it will 'contact' the `doGet()` method.
- `findSheets()` is a little helper method to find sheets with a specific name, e.g. to find all sheets starting with *[Template]*.

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
