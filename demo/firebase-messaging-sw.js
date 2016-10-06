// temporary measure, will not be necessary with release version.
const window = self;

importScripts('https://www.gstatic.com/firebasejs/staging/3.5.0-rc.2/firebase.js');

firebase.initializeApp({
  messagingSenderId: '153517668099'
});

const messaging = firebase.messaging();
// messaging.setBackgroundMessageHandler(data => {
//   console.log("received background message " + data);
//   // Show notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: 'https://dummyimage.com/600x600/000/fff.jpg&text=PlaceHolder',
//   };

//   return self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });
