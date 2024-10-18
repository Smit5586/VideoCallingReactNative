import {
    useMeeting,
    useParticipant,
    RTCView,
    MediaStream
} from "@videosdk.live/react-native-sdk";
import { Text, View } from "react-native";

const ParticipantView = ({ participantId }) => {
    const { webcamStream, webcamOn, isLocal, isMainParticipant, participant,
        screenShareStream, screenShareOn
    } = useParticipant(participantId);
    console.log("(webcamOn && webcamStream) || (screenShareOn && screenShareStream)", screenShareOn);

    return ((webcamOn && webcamStream) || (screenShareOn && screenShareStream)) ? (
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
    ) : (
        <View
            style={{
                backgroundColor: "grey",
                height: 300,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 16 }}>NO MEDIA</Text>
        </View>
    );
}

export default ParticipantView