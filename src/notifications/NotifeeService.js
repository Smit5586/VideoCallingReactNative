import notifee, { AndroidImportance } from '@notifee/react-native';

const NotifeeService = {
    displayNotification: async (remoteMessage) => {
        await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
                channelId: 'default',
                importance: AndroidImportance.HIGH,
            },
            data: remoteMessage.data
        });
    },

    createChannel: async () => {
        await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
        });
    },

    cancelAllNotifications: async () => {
        await notifee.cancelAllNotifications();
    }
};

export default NotifeeService;
