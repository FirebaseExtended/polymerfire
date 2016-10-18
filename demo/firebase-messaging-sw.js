// temporary measure, will not be necessary with release version.
var window = self;

importScripts(
  'https://www.gstatic.com/firebasejs/staging/3.5.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/staging/3.5.0/firebase-messaging.js'
);

firebase.initializeApp({
  messagingSenderId: '153517668099'
});

var messaging = firebase.messaging();