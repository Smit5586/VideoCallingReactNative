import React, { useEffect, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  RTCView,
  MediaStream,
} from "@videosdk.live/react-native-sdk";
import { Alert, Button, Clipboard, PermissionsAndroid, Platform, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
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
import RNCallKeep from "react-native-callkeep";
import useIncomingCall from "./src/component/CallKeepComponent";

const options = {
  ios: {
    appName: 'videoAppDemo',
    supportsVideo: true, // Enable video call support
    maximumCallGroups: 1, // Limit of ongoing call groups
    maximumCallsPerCallGroup: 1, // Limit of ongoing calls in each group
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'OK',
    imageName: 'phone_account_icon',
    additionalPermissions: [
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    ],
    foregroundService: {
      channelId: 'com.videoAppDemo',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running in the background',
      notificationIcon: 'ic_notification', // Make sure the icon is added in your project
    },
  }
};

// CallKeep Setup
RNCallKeep.setup(options).then((accepted) => {
  console.log('RNCallKeep setup accepted:', accepted);
});

const App = () => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [meetingIdNotification, setMeetingIdNotification] = useState(null);
  const [participants, setParticipants] = useState([]);

  const [isHost, setIsHost] = useState(false);
  const [name, setName] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const handleIncomingCall = () => {
    // setTimeout(() => {
    setModalVisible(true);
    // }, 1000);
  };

  const handleAcceptCall = () => {
    setMeetingId(meetingIdNotification);
    setModalVisible(false);
    // Handle accept call logic here
  };

  const handleDeclineCall = () => {
    setModalVisible(false);
    setMeetingId(null)
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

      // NotificationService.listenBackgroundMessages(callInitialized);
      NotificationService.listenForegroundMessages(callInitialized)
      // Handle notification opened while app is in background
      FirebaseService.onNotificationOpenedApp(remoteMessage => {
        const receivedMeetingId = remoteMessage?.data?.meetingId;
        const name = remoteMessage?.data?.name;
        if (receivedMeetingId) {
          // setMeetingId(receivedMeetingId);
          setMeetingIdNotification(receivedMeetingId);
          handleIncomingCall()
          setIsHost(false)
          setName(name);
        }
      });

      FirebaseService.checkInitialNotification().then(initialMessage => {
        const { meetingId, name } = initialMessage?.data || {};
        if (meetingId) {
          // setMeetingId(meetingId);
          setMeetingIdNotification(meetingId);
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

  // useEffect(() => {
  //   const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
  //     const { notification } = detail;

  //     if (type === EventType.PRESS) {
  //       console.log('Notification pressed:', notification);
  //       // Handle notification tap, navigate to a specific screen
  //       // You can extract the meetingId from the notification and set it
  //       const receivedMeetingId = notification?.data?.meetingId;
  //       const name = notification?.data?.name;
  //       if (receivedMeetingId) {
  //         handleIncomingCall()
  //         // setMeetingId(receivedMeetingId);  // Automatically navigate to meeting
  //         setMeetingIdNotification(receivedMeetingId);  // Automatically navigate to meeting
  //         setIsHost(false);
  //         setName(name);
  //       }
  //       await notifee.cancelNotification(notification.id);
  //     } else if (type === EventType.DISMISSED) {
  //       console.log('Notification dismissed:', notification);
  //     }
  //   });

  //   return () => {
  //     // Unsubscribe from foreground event when component is unmounted
  //     unsubscribe();
  //   };
  // }, []);

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
      console.log("meetingId name", name);
      // for sending notification start
      // fetch(`http://192.168.1.63:3000/alarm`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     // token: 'dCI7pOYvQEmo7tmf7gNR-4:APA91bG93lYLdsNbUZOgo0WQuNxpL3-tnhEfs_0Y_QGaAa97VqT8HHLkPR2jwcAL55okyc-PU9nT7DCoo3HCTHM_pmYv7QmKB57NZ4kmItf0Ytz1QjwuMyU53Vy9shDyi8fffJRNIjpR',
      //     token: 'cJEOC7VKSrS1LItyFCDXDa:APA91bEqfkdel5DFXEQ7RJoHiKR1qU594YUk2CDKPcgNDhOe9d8WDUQcB4VzI0VsGBWaRLtZWkt9DyuEZF-GtyWcDx9zA0aNRD_xu-SfzNsr8OA75Q-2EE36h9J9JKIIymvJzurp5aOz',
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

  const onIncomingCall = (callerName, callUUID) => {
    RNCallKeep.displayIncomingCall(
      '3elb-qdz1-q9cl',     // UUID for the call
      '1234567890',     // Handle (could be phone number, email, etc.)
      'John Doe',             // Localized name of the caller (optional)
      'number',                // Handle type (e.g., 'number', 'email')
      true,
      null
    );
  };

  const {
    displayIncomingCall,
    startCall,
    reportEndCallWithUUID,
    endIncomingcallAnswer,
    endAllCalls,
    backToForeground,
    configure
  } = useIncomingCall();

  const incomingCallAnswer = ({ callUUID }) => {
    console.log("incomingCallAnswer");

    backToForeground();
    endIncomingcallAnswer(callUUID);
    setModalVisible(true)
  }

  const endIncomingCall = () => {
    console.log("endIncomingCall");
    endIncomingcallAnswer();
  }

  const callInitialized = () => {
    configure(incomingCallAnswer, endIncomingCall);
    displayIncomingCall("John");
    backToForeground();
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
      <View style={{ flex: 1, paddingHorizontal: 30, backgroundColor: Colors.WHITE }}>
        <JoinScreen getMeetingId={getMeetingId} setIsHost={setIsHost} setName={setName} />
        <Toast position='top' config={toastConfig} topOffset={44} />
        <Button title="Show notification" onPress={() => onIncomingCall("Manish", "3elb-qdz1-q9cl")} />
        <View>
          <Text>Incoming Call Screen</Text>
          <Button title="Display Incoming Call" onPress={() => callInitialized()} />
          <Button title="Start Call" onPress={() => startCall({ handle: "123456789", localizedCallerName: "Caller Name" })} />
          <Button title="End Call" onPress={endIncomingcallAnswer} />
          <Button title="End All Calls" onPress={endAllCalls} />
        </View>
      </View>
    }
    <IncomingCallModal
      visible={isModalVisible}
      onAccept={handleAcceptCall}
      onDecline={handleDeclineCall}
      name={name}
    />
  </View>
};
export default App;