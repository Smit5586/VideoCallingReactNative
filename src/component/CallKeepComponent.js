import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import RNCallKeep from "react-native-callkeep";
import uuid from "react-native-uuid";
// import VoipPushNotification from "react-native-voip-push-notification";

const useIncomingCall = (incomingcallAnswer, endIncomingCall) => {
    const currentCallId = useRef(null);

    const setupCallKeep = () => {
        try {
            RNCallKeep.setup({
                ios: {
                    appName: "videoAppDemo",
                    supportsVideo: false,
                    maximumCallGroups: "1",
                    maximumCallsPerCallGroup: "1",
                },
                android: {
                    alertTitle: "Permissions required",
                    alertDescription: "This application needs to access your phone accounts",
                    cancelButton: "Cancel",
                    okButton: "Ok",
                },
            });
            Platform.OS === "android" && RNCallKeep.setAvailable(true);
        } catch (error) {
            console.error("initializeCallKeep error:", error?.message);
        }
    };

    const getCurrentCallId = () => {
        if (!currentCallId.current) {
            currentCallId.current = uuid.v4();
        }
        return currentCallId.current;
    };

    const startCall = ({ handle, localizedCallerName }) => {
        RNCallKeep.startCall(getCurrentCallId(), handle, localizedCallerName);
    };

    const displayIncomingCall = (callerName) => {
        Platform.OS === "android" && RNCallKeep.setAvailable(false);
        RNCallKeep.displayIncomingCall(
            getCurrentCallId(),
            callerName,
            callerName,
            "number",
            true,
            null
        );
    };

    const reportEndCallWithUUID = (callUUID, reason) => {
        RNCallKeep.reportEndCallWithUUID(callUUID, reason);
    };

    const endIncomingcallAnswer = () => {
        RNCallKeep.endCall(currentCallId.current);
        currentCallId.current = null;
        removeEvents();
    };

    const removeEvents = () => {
        RNCallKeep.removeEventListener("answerCall");
        RNCallKeep.removeEventListener("endCall");
    };

    const endAllCalls = () => {
        RNCallKeep.endAllCalls();
        currentCallId.current = null;
        removeEvents();
    };

    const backToForeground = () => {
        RNCallKeep.backToForeground();
    };

    const configure = (incomingCallAnswer, endIncomingCall) => {
        setupCallKeep();

        RNCallKeep.addEventListener("answerCall", incomingCallAnswer);
        RNCallKeep.addEventListener("endCall", endIncomingCall);

        return () => {
            removeEvents();
        };
    };

    // useEffect(() => {
    //     console.log("callleddddd");

    //     setupCallKeep();

    //     RNCallKeep.addEventListener("answerCall", incomingcallAnswer);
    //     RNCallKeep.addEventListener("endCall", endIncomingCall);

    //     return () => {
    //         removeEvents();
    //     };
    // }, [incomingcallAnswer, endIncomingCall]);

    return {
        displayIncomingCall,
        startCall,
        reportEndCallWithUUID,
        endIncomingcallAnswer,
        endAllCalls,
        backToForeground,
        configure
    };
};

export default useIncomingCall;
