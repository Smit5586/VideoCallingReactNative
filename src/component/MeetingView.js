import { Constants, ReactNativeForegroundService, useMeeting } from "@videosdk.live/react-native-sdk";
import { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";
import ParticipantList from "./ParticipantList";
import ControlsContainer from "./ControlsContainer";
import { showErrorToast } from "../helper/constants";

let isUsingFrontCamera = true;
const MeetingView = ({ setMeetingId, isHostTwo, setParticipants, name }) => {
    const {
        join,
        leave,
        toggleMic,
        participants,
        end,
        localMicOn,
        localWebcamOn,
        enableWebcam,
        disableWebcam,
        muteMic,
        unmuteMic,
        localParticipant,
        getWebcams,
        meeting,
        changeWebcam,
        enableScreenShare,
        disableScreenShare,
        recordingState,
        startRecording,
        stopRecording,
        toggleScreenShare,
        localScreenShareOn

    } = useMeeting({
        onMeetingLeft,
        onParticipantLeft,
        onError: (data) => {
            const { code, message } = data;
            showErrorToast(`Error: ${code}: ${message}`)
        },
    });
    const participantsArrId = [...participants.keys()];
    const [isJoined, setIsJoined] = useState(false);
    const isHost = localParticipant?.metaData?.role === 'host';
    const [isScreenShare, setIsScreenShare] = useState(false)
    const handleJoin = () => {
        join();
        setIsJoined(true);
    };

    useEffect(() => {
        return () => {
            leave();
            ReactNativeForegroundService.stopAll();
        };
    }, []);

    useEffect(() => {
        setParticipants([...participants.keys()])
    }, [participants])

    useEffect(() => {
        if (localScreenShareOn) {
            setIsScreenShare(true)
        } else {
            setIsScreenShare(false)
        }
    }, [localScreenShareOn])

    useEffect(() => {
        if (Platform.OS == "ios") {
            VideosdkRPK.addListener("onScreenShare", (event) => {
                if (event === "START_BROADCAST") {
                    enableScreenShare();
                } else if (event === "STOP_BROADCAST") {
                    disableScreenShare();
                }
            });

            return () => {
                VideosdkRPK.removeSubscription("onScreenShare");
            };
        }
    }, []);

    //Event to determine if the meeting has been left
    function onMeetingLeft() {
        console.log("onMeetingLeft");
        setMeetingId(null);
    }

    //Event to determine if some other participant has left
    function onParticipantLeft(participant) {
        console.log(" onParticipantLeft", participant);
    }

    const handleLeaveOrEnd = () => {
        console.log("isHostTwo", isHostTwo);
        console.log("isJoined", isJoined);

        // if (isJoined && isHost) {
        if (isJoined && isHostTwo) {
            // leave();
            // setIsJoined(false);
            end();
            setMeetingId(null);
            setIsJoined(false);
        } else if (isJoined) {
            leave();
            setIsJoined(false);
            setMeetingId(null);
        } else {
            end();
            setMeetingId(null);
            setIsJoined(false);
        }
    };

    const handleLeaveForHost = () => {
        leave();
        setIsJoined(false);
        setMeetingId(null);
    }

    const handleVideoOnOff = () => {
        if (localWebcamOn) {
            disableWebcam()
        } else {
            enableWebcam()
        }
    }

    const handleMicOnOff = () => {
        if (localMicOn) {
            muteMic()
        } else {
            unmuteMic()
        }
    }

    const handleToggleScreenShare = () => {
        // if (isScreenShare) {
        //     disableScreenShare()
        // } else {
        //     enableScreenShare()
        // }
        // setIsScreenShare(!isScreenShare)
        Platform.OS === "android"
            ? toggleScreenShare()
            : VideosdkRPK.startBroadcast();
    };

    const toggleCamera = async () => {
        const cameras = await getWebcams(); // Get all available webcams (front & back)
        let selectedCamera;
        console.log("cameras", cameras);

        // Check the current camera and switch
        if (isUsingFrontCamera) {
            // If currently using the front camera, switch to the back camera
            selectedCamera = Array.from(cameras.values()).find(camera => camera.facingMode === 'environment');
        } else {
            // If currently using the back camera, switch to the front camera
            selectedCamera = Array.from(cameras.values()).find(camera => camera.facingMode === 'front');
        }
        console.log("selectedCamera", selectedCamera);

        if (selectedCamera) {
            console.log("selectedCamera.deviceId", selectedCamera.deviceId);

            // Wait for the camera to switch before updating the state
            await changeWebcam(selectedCamera.deviceId);

            // Update the state after the switch is successful
            isUsingFrontCamera = !isUsingFrontCamera;
            console.log('Switched to camera:', selectedCamera.label);
        } else {
            console.error('No camera found to switch to');
        }
    }


    const handleRecording = () => {
        console.log("recordingState", recordingState);

        if (
            !recordingState ||
            recordingState === Constants.recordingEvents.RECORDING_STOPPED ||
            recordingState === Constants.recordingEvents.RECORDING_STOPPING
        ) {
            // Configuration for post transcription
            let transcription = {
                enabled: true,
                summary: {
                    enabled: true,
                    prompt:
                        "Write summary in sections like Title, Agenda, Speakers, Action Items, Outlines, Notes and Summary",
                },
            };

            // Start Recording
            // If you don't have a `webhookUrl` or `awsDirPath`, you should pass null.
            startRecording(
                null,
                null,
                null,
                transcription
            );
            // startRecording();
        } else if (
            recordingState === Constants.recordingEvents.RECORDING_STARTED ||
            recordingState === Constants.recordingEvents.RECORDING_STARTING
        ) {
            stopRecording();
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <ParticipantList participants={participantsArrId} localMicOn={localMicOn} name={name} />
            <ControlsContainer
                isJoined={isJoined}
                isHostTwo={isHostTwo}
                localMicOn={localMicOn}
                localWebcamOn={localWebcamOn}
                join={handleJoin}
                leaveOrEnd={handleLeaveOrEnd}
                leaveForHolst={handleLeaveForHost}
                toggleWebcam={handleVideoOnOff}
                toggleMic={handleMicOnOff}
                isHost={isHost}
                toggleCamera={toggleCamera}
                handleToggleScreenShare={handleToggleScreenShare}
                isScreenShare={isScreenShare}
                handleRecording={handleRecording}
                isRecording={(recordingState === Constants.recordingEvents.RECORDING_STARTED ||
                    recordingState === Constants.recordingEvents.RECORDING_STOPPING ||
                    recordingState === Constants.recordingEvents.RECORDING_STARTING) ? true : false}
            />
        </View>
    );
};

export default MeetingView;
