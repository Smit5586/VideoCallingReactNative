import React, { useEffect, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  RTCView,
  MediaStream,
} from "@videosdk.live/react-native-sdk";
import { Alert, Button, Clipboard, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import MeetingView from "./src/component/MeetingView";
import { createMeeting, token } from "./api";
import JoinScreen from "./src/component/JoinScreen";
import { FirebaseService, NotifeeService, NotificationService } from "./src/notifications";
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from "react-native-toast-message";
import { showErrorToast, showSuccessToast, toastConfig } from "./src/helper/constants";
import Colors from "./src/helper/Colors";
import IncomingCallModal from "./src/component/IncomingCallModal";

const App = () => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [participants, setParticipants] = useState([]);

  const [isHost, setIsHost] = useState(false);
  const [name, setName] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const handleIncomingCall = () => {
    setTimeout(() => {
      setModalVisible(true);
    }, 1000);
  };

  const handleAcceptCall = () => {
    setModalVisible(false);
    // Handle accept call logic here
  };

  const handleDeclineCall = () => {
    setModalVisible(false);
    // Handle decline call logic here
  };
  useEffect(() => {
    const initializeNotifications = async () => {
      const permissionGranted = await NotificationService.initialize();
      setIsNotificationEnabled(permissionGranted);

      // Create Notifee notification channel
      await NotifeeService.createChannel();
    };

    const handleNotifications = () => {
      // FirebaseService.onForegroundNotification(remoteMessage => {
      //   const receivedMeetingId = remoteMessage?.data?.meetingId;
      //   if (receivedMeetingId) {
      //     setMeetingId(receivedMeetingId);
      //   }
      // });

      NotificationService.listenForegroundMessages()
      // Handle notification opened while app is in background
      FirebaseService.onNotificationOpenedApp(remoteMessage => {
        const receivedMeetingId = remoteMessage?.data?.meetingId;
        if (receivedMeetingId) {
          // setMeetingId(receivedMeetingId);
          handleIncomingCall()
          setIsHost(false)
        }
      });

      FirebaseService.checkInitialNotification().then(initialMessage => {
        const { meetingId } = initialMessage?.data || {};
        if (meetingId) {
          // setMeetingId(meetingId);
          handleIncomingCall()
          setIsHost(false)
          // Alert.alert("Notification", `App opened from notification. Meeting ID: ${meetingId}`);
        }
      });
    };

    initializeNotifications();
    FirebaseService.getToken();
    handleNotifications();
  }, []);

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
      const { notification } = detail;

      if (type === EventType.PRESS) {
        console.log('Notification pressed:', notification);
        // Handle notification tap, navigate to a specific screen
        // You can extract the meetingId from the notification and set it
        const receivedMeetingId = notification?.data?.meetingId;
        if (receivedMeetingId) {
          handleIncomingCall()
          // setMeetingId(receivedMeetingId);  // Automatically navigate to meeting
          setIsHost(false);
        }
        await notifee.cancelNotification(notification.id);
      } else if (type === EventType.DISMISSED) {
        console.log('Notification dismissed:', notification);
      }
    });

    return () => {
      // Unsubscribe from foreground event when component is unmounted
      unsubscribe();
    };
  }, []);

  const handleEnableNotifications = async () => {
    const permissionGranted = await NotificationService.initialize();
    setIsNotificationEnabled(permissionGranted);

    if (!permissionGranted) {
      Alert.alert('Notification permission was denied.');
    }
  };

  const getMeetingId = async (id) => {
    const meetingId = id == null ? await createMeeting({ token }) : id;
    //for sending notification start
    // fetch(`http://192.168.1.37:3000/alarm`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     // token: 'ed7J916-RA-AvCrBgYIJI-:APA91bGAvyf_XROthpiAeTzhtDXVjU3kTF-06nTNQ3ZFd68AnzJVVfG_IgEL6xuiwppvNpTeoZxsYXMNfVaWB-JdopQXA-tN0pSfxrWQObXiQuzG351f2Na5W2KS8bfWfissGMjqNP6I',
    //     token: 'dJ7OdVKgQribywNVzKesY8:APA91bHCGjh8PT3LJtMlc0JgWCHG4WIobl4s9DItV9aLeDBgXzhNMo4cl7UR8hJa-27Y6XQ6YgJ1bHsNy_0m0dFld0R3k5NrcHK4G3gECoPSbcU5gfO9vjTDUMq1K3F2zM881A2m-ulX',
    //     meetingId: meetingId
    //   })
    // });
    //for sending notification end 

    setMeetingId(meetingId);
  };

  const handleNotifications = () => {
    // const notificationData = {
    //   callerName: 'John Doe', // Name of the caller
    //   callerId: '1234567890', // ID or phone number of the caller
    //   callId: 'call123', // Unique identifier for the call
    // };

    // // Show the incoming call notification
    // IncomingCall.showNotification(notificationData)
    //   .then(() => {
    //     console.log('Incoming call notification shown');
    //   })
    //   .catch((error) => {
    //     console.error('Error showing incoming call notification:', error);
    //   });
  }

  return <View style={{ flex: 1 }}>
    {meetingId ?
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
        {isNotificationEnabled === false && (
          <View style={{ marginBottom: 20 }}>
            <Text>Notifications are currently disabled.</Text>
            <Button title="Enable Notifications" onPress={handleEnableNotifications} />
          </View>
        )}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => {
            Clipboard.setString(meetingId);
            showSuccessToast(`Meeting Id copied Successfully`)
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              fontSize: 16,
              marginVertical: 16,
              color: Colors.TEXT_BLACK,
            }}
          >Meeting Id : {meetingId}</Text>
          <Icon
            size={20}
            color={Colors.TEXT_BLACK}
            style={{ marginStart: 10 }}
            name={'content-copy'}
          />
        </TouchableOpacity>
        {/* {"Member" + participants.length} */}
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: false,
            webcamEnabled: true,
            name: name,
            notification: {
              title: "Video SDK Meeting",
              message: "Meeting is running.",
            },
            defaultCamera: "front"
          }}
          token={token}
        >
          <MeetingView
            meetingId={meetingId}
            setMeetingId={setMeetingId}
            isHostTwo={isHost}
            name={name}
            setParticipants={setParticipants}
          />
        </MeetingProvider>
        <Toast position='top' config={toastConfig} topOffset={10} />
      </SafeAreaView>
      :
      <View style={{ flex: 1 }}>
        <JoinScreen getMeetingId={getMeetingId} setIsHost={setIsHost} setName={setName} />
        <Toast position='top' config={toastConfig} topOffset={44} />
        {/* <Button title="Show notification" onPress={handleNotifications} /> */}
      </View>
    }
    <IncomingCallModal
      visible={isModalVisible}
      onAccept={handleAcceptCall}
      onDecline={handleDeclineCall}
    />
  </View>
};
export default App;