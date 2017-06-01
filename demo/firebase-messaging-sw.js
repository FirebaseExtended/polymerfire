// temporary measure, will not be necessary with release version.
var window = self;

importScripts(
  '../../firebase/firebase-app.js',
  '../../firebase/firebase-messaging.js'
);

firebase.initializeApp({
  messagingSenderId: '153517668099'
});

var messaging = firebase.messaging();
