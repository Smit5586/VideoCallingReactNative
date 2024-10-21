import React, { useEffect, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  RTCView,
  MediaStream,
} from "@videosdk.live/react-native-sdk";
import { Alert, Button, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import MeetingView from "./src/component/MeetingView";
import { createMeeting, token } from "./api";
import JoinScreen from "./src/component/JoinScreen";
import { FirebaseService, NotifeeService, NotificationService } from "./src/notifications";
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

const App = () => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(null);
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
          setMeetingId(receivedMeetingId);
        }
      });

      FirebaseService.checkInitialNotification().then(initialMessage => {
        const { meetingId } = initialMessage?.data || {};
        if (meetingId) {
          setMeetingId(meetingId);
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
          setMeetingId(receivedMeetingId);  // Automatically navigate to meeting
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
  const [meetingId, setMeetingId] = useState(null);
  const [participants, setParticipants] = useState([]);

  const [isHost, setIsHost] = useState(false);
  const [name, setName] = useState("");

  const getMeetingId = async (id) => {
    const meetingId = id == null ? await createMeeting({ token }) : id;

    //for sending notification start
    fetch(`http://192.168.1.37:3000/alarm`, {
      method: 'POST',
      body: JSON.stringify({
        token: 'ed7J916-RA-AvCrBgYIJI-:APA91bGAvyf_XROthpiAeTzhtDXVjU3kTF-06nTNQ3ZFd68AnzJVVfG_IgEL6xuiwppvNpTeoZxsYXMNfVaWB-JdopQXA-tN0pSfxrWQObXiQuzG351f2Na5W2KS8bfWfissGMjqNP6I',
        meetingId: meetingId
      })
    });
    //for sending notification end 

    setMeetingId(meetingId);
  };

  return meetingId ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F6FF" }}>
      {isNotificationEnabled === false && (
        <View style={{ marginBottom: 20 }}>
          <Text>Notifications are currently disabled.</Text>
          <Button title="Enable Notifications" onPress={handleEnableNotifications} />
        </View>
      )}
      <Text
        style={{
          alignSelf: "center",
          fontSize: 22,
          marginVertical: 16,
          fontStyle: "italic",
          color: "grey",
        }}
      >{meetingId} {"Member" + participants.length}</Text>
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: false,
          webcamEnabled: true,
          name: "Test User",
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
    </SafeAreaView>
  ) : (
    <JoinScreen getMeetingId={getMeetingId} setIsHost={setIsHost} setName={setName} />
  );
};
export default App;