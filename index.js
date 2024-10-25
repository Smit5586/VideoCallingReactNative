// /**
//  * @format
//  */

// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import { register } from '@videosdk.live/react-native-sdk';
// import messaging from '@react-native-firebase/messaging';
// import RNCallKeep from 'react-native-callkeep';

// // Background message handler
// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//     console.log('Message handled in the background!', remoteMessage);

//     // Use RNCallKeep to bring the app to the foreground
//     RNCallKeep.backToForeground();
// });

// // Register the headless task
// // AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask', () =>
// //     messaging().setBackgroundMessageHandler
// // );

// register();

// AppRegistry.registerComponent(appName, () => App);

// AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => async ({ name, callUUID, handle }) => {
//     // Handle the background call event here, for example:
//     messaging().setBackgroundMessageHandler
//     console.log('Received call in background', { name, callUUID, handle });

//     // You can perform your call logic here, such as answering or rejecting the call

//     return Promise.resolve();
// });


import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { register } from '@videosdk.live/react-native-sdk';
import messaging from '@react-native-firebase/messaging';
import RNCallKeep from 'react-native-callkeep';

// Initialize Video SDK
register();

RNCallKeep.setup({
    ios: {
        appName: 'videoAppDemo',
        supportsVideo: true,
    },
    android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This app needs access to your phone state',
        cancelButton: 'Cancel',
        okButton: 'OK',
    },
});

// Background message handler to bring app to foreground when a notification arrives
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);

    // Use RNCallKeep to bring the app to the foreground
    // RNCallKeep.backToForeground();
    // RNCallKeep.displayIncomingCall(callUUID, callerName, callerName, 'generic', true);
    RNCallKeep.displayIncomingCall('d8sr-dds5-gv54', 'manish', 'manish', 'generic', true);
    // RNCallKeep.backToForeground();
});

// Register the main application component
AppRegistry.registerComponent(appName, () => App);

// Register any additional background task (optional) for handling background call events
AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => async ({ name, callUUID, handle }) => {
    console.log('Received call in background', { name, callUUID, handle });
    // Perform any additional background logic if necessary
    return Promise.resolve();
});