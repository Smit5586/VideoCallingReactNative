import { View, TouchableOpacity, Text } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from "../helper/Colors";
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
            <Text style={{ color: Colors.WHITE, fontSize: 12 }}>{buttonText}</Text>
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
                <Button onPress={join} buttonText={"Join"} backgroundColor={Colors.BLUE} />
            ) : (
                <>
                    <TouchableOpacity
                        onPress={toggleMic}
                        style={{
                            backgroundColor: localMicOn ? Colors.BLUE : Colors.RED,
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 4,
                            marginTop: 5,
                        }}
                    >
                        <Icon
                            size={24}
                            color={Colors.WHITE}
                            name={localMicOn ? "microphone" : "microphone-off"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={toggleCamera}
                        style={{
                            backgroundColor: Colors.BLUE,
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 4,
                            marginTop: 5,
                        }}
                    >
                        <Icon
                            size={24}
                            color={Colors.WHITE}
                            name={"camera-flip"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={toggleWebcam}
                        style={{
                            backgroundColor: localWebcamOn ? Colors.BLUE : Colors.RED,
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 4,
                            marginTop: 5,
                        }}
                    >
                        <Icon
                            size={24}
                            color={Colors.WHITE}
                            name={localWebcamOn ? "video" : "video-off"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleToggleScreenShare}
                        style={{
                            backgroundColor: isScreenShare ? Colors.BLUE : Colors.RED,
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 4,
                            marginTop: 5,
                        }}
                    >
                        <MaterialIcons
                            size={24}
                            color={Colors.WHITE}
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
                    backgroundColor={Colors.RED}
                />
            }
            <Button
                onPress={leaveOrEnd}
                // buttonText={isJoined ? "Leave" : "End"}
                buttonText={!isHostTwo ? "Leave" : "End"}
                backgroundColor={Colors.RED}
            />
        </View>
    );
};

export default ControlsContainer;
