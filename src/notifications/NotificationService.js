import messaging from '@react-native-firebase/messaging';
import FirebaseService from './FirebaseService';
import NotifeeService from './NotifeeService';
import notifee from '@notifee/react-native';
const NotificationService = {
    initialize: async () => {
        try {
            const notifeePermissionStatus = await notifee.requestPermission();
            const { authorizationStatus } = notifeePermissionStatus;

            if (authorizationStatus === 0) {  // Denied
                console.log("User denied notification permission via Notifee.");
                return false;
            } else if (authorizationStatus === 1) {  // Granted
                console.log("User granted notification permission via Notifee.");
            }
            // Request permission and check the status
            const permissionGranted = await FirebaseService.requestPermission();
            if (!permissionGranted) {
                console.log("Notification permission denied.");
                return false; // Permission not granted
            }
            console.log("permissionGranted", permissionGranted);

            // If permission is granted, listen to background and foreground notifications
            // NotificationService.listenBackgroundMessages();
            // NotificationService.listenForegroundMessages();
            // FirebaseService.onNotificationOpenedApp();
            // FirebaseService.checkInitialNotification();


            return true;
        } catch (error) {
            console.error('Error initializing notification service:', error);
            return false; // Handle errors by returning false
        }
    },

    listenBackgroundMessages: () => {
        // Background messages handler
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
        });
    },

    listenForegroundMessages: () => {
        // Foreground notifications handler
        FirebaseService.onForegroundNotification(remoteMessage => {
            NotifeeService.displayNotification(remoteMessage);
        });
    }
};

export default NotificationService;
