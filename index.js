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
import Incomingvideocall from './src/component/CallKeepComponent';
import { useEffect } from 'react';

// Initialize Video SDK
register();


const firebaseListener = async (remoteMessage) => {
    // const {
    //     displayIncomingCall,
    //     backToForeground,
    //     configure,
    //     endIncomingcallAnswer,
    // } = useIncomingCall();

    const incomingCallAnswer = ({ callUUID }) => {
        console.log('Incoming call answered');
        Incomingvideocall.backToForeground();
        Incomingvideocall.endIncomingcallAnswer(callUUID);
    };

    const endIncomingCall = () => {
        console.log('Incoming call ended');
        Incomingvideocall.endIncomingcallAnswer();
    };

    // const callInitialized = () => {
    Incomingvideocall.configure(incomingCallAnswer, endIncomingCall);
    Incomingvideocall.displayIncomingCall('John');
    Incomingvideocall.backToForeground()
    // };
};

messaging().setBackgroundMessageHandler(firebaseListener);

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }

    return <App />;
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);

// Register any additional background task (optional) for handling background call events
AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => async ({ name, callUUID, handle }) => {
    console.log('Received call in background', { name, callUUID, handle });
    // Perform any additional background logic if necessary
    return Promise.resolve();
});