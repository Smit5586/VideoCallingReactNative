import messaging from '@react-native-firebase/messaging';
import { Platform, Alert } from 'react-native';

const FirebaseService = {
    requestPermission: async () => {
        const authStatus = await messaging().requestPermission();
        const isGranted = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (isGranted) {
            console.log('Notification permission granted:', authStatus);
            return true;
        } else {
            Alert.alert('Notification permission denied.');
            return false;
        }
    },

    getToken: async () => {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        return token;
    },

    onForegroundNotification: (callback) => {
        messaging().onMessage(async remoteMessage => {
            console.log('Foreground message:', remoteMessage);
            callback(remoteMessage);
        });
    },

    onNotificationOpenedApp: (callback) => {
        messaging().onNotificationOpenedApp(remoteMessage => {
            if (remoteMessage) {
                console.log('App opened from notification:', remoteMessage);
                callback(remoteMessage);
            }
        });
    },

    checkInitialNotification: async () => {
        const initialMessage = await messaging().getInitialNotification();
        if (initialMessage) {
            console.log('App opened from notification:', initialMessage);
            return initialMessage;
        }
        return null;
    }
};

export default FirebaseService;
