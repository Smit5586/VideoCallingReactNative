import { View, TouchableOpacity, Text } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const Button = ({ onPress, buttonText, backgroundColor }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor,
                justifyContent: "center",
                alignItems: "center",
                padding: 12,
                borderRadius: 4,
                marginTop: 5,
            }}
        >
            <Text style={{ color: "white", fontSize: 12 }}>{buttonText}</Text>
        </TouchableOpacity>
    );
};

const ControlsContainer = ({
    isJoined,
    isHostTwo,
    localMicOn,
    localWebcamOn,
    join,
    leaveOrEnd,
    leaveForHolst,
    toggleWebcam,
    toggleMic,
    isHost,
    toggleCamera,
    handleToggleScreenShare,
    isScreenShare,
    isRecording,
    handleRecording
}) => {
    return (
        <View
            style={{
                padding: 24,
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
            }}
        >
            {!isJoined ? (
                <Button onPress={join} buttonText={"Join"} backgroundColor={"#1178F8"} />
            ) : (
                <>
                    <TouchableOpacity
                        onPress={toggleMic}
                        style={{
                            backgroundColor: localMicOn ? "#1178F8" : "#FF0000",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 4,
                            marginTop: 5,
                        }}
                    >
                        <Icon
                            size={24}
                            color="white"
                            name={localMicOn ? "microphone" : "microphone-off"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={toggleCamera}
                        style={{
                            backgroundColor: "#1178F8",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 4,
                            marginTop: 5,
                        }}
                    >
                        <Icon
                            size={24}
                            color="white"
                            name={"camera-flip"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={toggleWebcam}
                        style={{
                            backgroundColor: localWebcamOn ? "#1178F8" : "#FF0000",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 4,
                            marginTop: 5,
                        }}
                    >
                        <Icon
                            size={24}
                            color="white"
                            name={localWebcamOn ? "video" : "video-off"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleToggleScreenShare}
                        style={{
                            backgroundColor: isScreenShare ? "#1178F8" : "#FF0000",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 4,
                            marginTop: 5,
                        }}
                    >
                        <MaterialIcons
                            size={24}
                            color="white"
                            name={"present-to-all"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleRecording}
                        style={{
                            backgroundColor: isRecording ? "#1178F8" : "#FF0000",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 4,
                            marginTop: 5,
                        }}
                    >
                        <Icon
                            size={24}
                            color="white"
                            name={"record-circle"}
                        />
                    </TouchableOpacity>

                </>
            )}
            {(isHostTwo && isJoined) &&
                <Button
                    onPress={leaveForHolst}
                    // buttonText={isJoined ? "Leave" : "End"}
                    buttonText={"Leave"}
                    backgroundColor={"#FF0000"}
                />
            }
            <Button
                onPress={leaveOrEnd}
                // buttonText={isJoined ? "Leave" : "End"}
                buttonText={!isHostTwo ? "Leave" : "End"}
                backgroundColor={"#FF0000"}
            />
        </View>
    );
};

export default ControlsContainer;
