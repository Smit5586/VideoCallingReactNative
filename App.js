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
import { createMeeting, token, validateMeeting } from "./api";
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
        const name = remoteMessage?.data?.name;
        if (receivedMeetingId) {
          // setMeetingId(receivedMeetingId);
          handleIncomingCall()
          setIsHost(false)
          setName(name);
        }
      });

      FirebaseService.checkInitialNotification().then(initialMessage => {
        const { meetingId, name } = initialMessage?.data || {};
        if (meetingId) {
          // setMeetingId(meetingId);
          handleIncomingCall()
          setIsHost(false)
          setName(name)
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
        const name = notification?.data?.name;
        if (receivedMeetingId) {
          handleIncomingCall()
          // setMeetingId(receivedMeetingId);  // Automatically navigate to meeting
          setIsHost(false);
          setName(name);
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
    // const meetingId = id == null ? await createMeeting({ token }) : id;
    let meetingId = "";
    if (id == null) {
      meetingId = await createMeeting({ token })
      // console.log("meetingId meetingId", meetingId);
      // console.log("meetingId name", name);
      // for sending notification start
      // fetch(`http://192.168.1.63:3000/alarm`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     token: 'dmyQxOWRQOWcPns7WfKkF3:APA91bHgrB0nzNbYmJu4rTw90x-OYJUZ4EGqbCny26zXFJmz0NTGlFBJLBRq0xYzyMSnPLdJBC0HNO8456KTx2T_2tuxZeUtCHHv2c6nsMIOTVtyMCJ-KSWgAdbPp4T-PTb_-GKX3sOh',
      //     meetingId: meetingId,
      //     name: name
      //   })
      // });
      // for sending notification end 
    } else {
      // console.log("id.trim()", id.trim());
      let valid = await validateMeeting({
        meetingId: id.trim(),
        token: token,
      });
      if (valid) {
        meetingId = id;
      } else {
        showErrorToast("Please enter valid meeting id")
        return
      }
    }

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