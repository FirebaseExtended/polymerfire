
<!---

This README is automatically generated from the comments in these files:
firebase-app.html  firebase-auth.html  firebase-document.html  firebase-query.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

The bot does some handling of markdown. Please file a bug if it does the wrong
thing! https://github.com/PolymerLabs/tedium/issues

-->

[![Build status](https://travis-ci.org/firebase/polymerfire.svg?branch=master)](https://travis-ci.org/firebase/polymerfire)


##&lt;firebase-app&gt;

The firebase-app element is used for initializing and configuring your
connection to firebase.



##&lt;firebase-auth&gt;

`firebase-auth` is a wrapper around the Firebase authentication API. It notifies
successful authentication, provides user information, and handles different
types of authentication including anonymous, email / password, and several OAuth
workflows.

Example Usage:

```html
<firebase-app
  auth-domain="polymerfire-test.firebaseapp.com"
  database-url="https://polymerfire-test.firebaseio.com/"
  api-key="AIzaSyDTP-eiQezleFsV2WddFBAhF_WEzx_8v_g"
  storage-bucket="polymerfire-test.appspot.com"
  messaging-sender-id="544817973908">
</firebase-app>
<firebase-auth id="auth" user="{{user}}" provider="google" on-error="handleError">
</firebase-auth>
```

The `firebase-app` element initializes `app` in `firebase-auth` (see
`firebase-app` documentation for more information), but an app name can simply
be specified at `firebase-auth`'s `app-name` property instead.

JavaScript sign-in calls can then be made to the `firebase-auth` object to
attempt authentication, e.g.:

```javascript
this.$.auth.signInWithPopup()
    .then(function(response) {// successful authentication response here})
    .catch(function(error) {// unsuccessful authentication response here});
```

This popup sign-in will then attempt to sign in using Google as an OAuth
provider since there was no provider argument specified and since `"google"` was
defined as the default provider.



##&lt;firebase-document&gt;

The firebase-document element is an easy way to interact with a firebase
location as an object and expose it to the Polymer databinding system.

For example:

```html
<firebase-document
  path="/users/{{userId}}/notes/{{noteId}}"
  data="{{noteData}}">
</firebase-document>
```

This fetches the `noteData` object from the firebase location at
`/users/${userId}/notes/${noteId}` and exposes it to the Polymer
databinding system. Changes to `noteData` will likewise be, sent back up
and stored.

`<firebase-document>` needs some information about how to talk to Firebase.
Set this configuration by adding a `<firebase-app>` element anywhere in your
app.



##&lt;firebase-query&gt;

`firebase-query` combines the given properties into query options that generate
a query, a request for a filtered, ordered, immutable set of Firebase data. The
results of this Firebase query are then synchronized into the `data` parameter.

Example usage:

```html
<firebase-query
    id="query"
    app-name="notes"
    path="/notes/[[uid]]"
    data="{{data}}">
</firebase-query>

<template is="dom-repeat" items="{{data}}" as="note">
  <sticky-note note-data="{{note}}"></sticky-note>
</template>

<script>
Polymer({
  properties: {
    uid: String,
    data: {
      type: Object,
      observer: 'dataChanged'
    }
  },

  dataChanged: function (newData, oldData) {
    // do something when the query returns values
  }
});
</script>
```


