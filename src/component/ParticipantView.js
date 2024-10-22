import {
    useMeeting,
    useParticipant,
    RTCView,
    MediaStream
} from "@videosdk.live/react-native-sdk";
import { Text, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from "../helper/Colors";

const ParticipantView = ({ participantId }) => {
    const {
        webcamStream,
        webcamOn,
        isLocal,
        isMainParticipant,
        participant,
        screenShareStream,
        screenShareOn,
        displayName,
        isActiveSpeaker,
        micOn
    } = useParticipant(participantId);

    return ((webcamOn && webcamStream) || (screenShareOn && screenShareStream)) ? (
        <View>
            <RTCView
                streamURL={screenShareOn ? new MediaStream([screenShareStream.track]).toURL() : new MediaStream([webcamStream.track]).toURL()}
                objectFit={screenShareOn ? "contain" : "cover"}
                style={{
                    height: 300,
                    marginVertical: 8,
                    marginHorizontal: 8,
                }}
            // mirror={isLocal ? true : false}
            />
            <View style={{
                backgroundColor: (micOn || isLocal) ? Colors.BLUE : Colors.RED,
                position: "absolute",
                borderRadius: 20,
                bottom: 10,
                left: 10,
                flexDirection: "row",
                paddingHorizontal: 12,
                paddingVertical: 6,
            }}>
                <Text style={{ fontSize: 12, alignSelf: "center", color: Colors.WHITE }}>
                    {isLocal ? "You" : displayName || ""}
                </Text>
                {!isLocal && <Icon
                    size={20}
                    color={Colors.WHITE}
                    style={{ marginStart: 10 }}
                    name={micOn ? "microphone" : "microphone-off"}
                />}
            </View>
        </View>
    ) : (
        <View
            style={{
                backgroundColor: Colors.TEXT_GRAY,
                height: 300,
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 8,
                marginHorizontal: 8,
            }}
        >
            <Text style={{ fontSize: 16 }}>NO MEDIA</Text>
        </View>
    );
}

export default ParticipantView