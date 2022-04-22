importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyBT9MdfY9YnqMbUYKx4z8023C-Bov5cpfk",
    authDomain: "mykidsplacestore.firebaseapp.com",
    projectId: "mykidsplacestore",
    storageBucket: "mykidsplacestore.appspot.com",
    messagingSenderId: "187849962423",
    appId: "1:187849962423:web:7a90952744f4234b9b6e32",
    measurementId: "G-QSPWF3G62E"
});
const messaging = firebase.messaging();
if ('serviceWorker' in navigator) {
    console.log('service');
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(function (registration) {
            console.log("Service Worker Registered");
            messaging.useServiceWorker(registration);
        });
}
messaging.onMessage(function (payload) {
    console.log("Message received. ", payload);
    // ...
});
messaging.setBackgroundMessageHandler(function (payload) {
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});