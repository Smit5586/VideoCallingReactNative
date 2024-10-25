/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { register } from '@videosdk.live/react-native-sdk';

register();

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => async ({ name, callUUID, handle }) => {
    // Handle the background call event here, for example:
    console.log('Received call in background', { name, callUUID, handle });

    // You can perform your call logic here, such as answering or rejecting the call

    return Promise.resolve();
});
