import { useEffect, useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { showErrorToast, showSuccessToast } from "../helper/constants";
import Colors from "../helper/Colors";

const JoinScreen = (props) => {
    const [meetingVal, setMeetingVal] = useState("");

    const [nameVal, setNameVal] = useState("");
    useEffect(() => {
        props.setName(nameVal)
    }, [nameVal])
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: Colors.WHITE,
                justifyContent: "center",
                paddingHorizontal: 6 * 10,
            }}
        >
            <TextInput
                value={nameVal}
                onChangeText={setNameVal}
                placeholder={"Enter your name"}
                placeholderTextColor={Colors.TEXT_GRAY}
                style={{
                    marginBottom: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderRadius: 6,
                    color: Colors.TEXT_BLACK
                }}
            />
            <TouchableOpacity
                onPress={() => {
                    if (!nameVal) {
                        showErrorToast("Please enter your name")
                    } else {
                        props.setIsHost(true)
                        props.getMeetingId();
                        props.setName(nameVal)
                    }
                }}
                style={{ backgroundColor: Colors.BLUE, padding: 12, borderRadius: 6 }}
            >
                <Text style={{ color: Colors.WHITE, alignSelf: "center", fontSize: 18 }}>
                    Create Meeting
                </Text>
            </TouchableOpacity>

            <Text
                style={{
                    alignSelf: "center",
                    fontSize: 22,
                    marginVertical: 16,
                    color: Colors.TEXT_BLACK
                }}
            >
                ---------- OR ----------
            </Text>
            <TextInput
                value={meetingVal}
                onChangeText={setMeetingVal}
                // placeholder={"XXXX-XXXX-XXXX"}
                placeholder={"Meeting Id"}
                placeholderTextColor={Colors.TEXT_GRAY}
                style={{
                    padding: 12,
                    borderWidth: 1,
                    borderRadius: 6,
                    color: Colors.TEXT_BLACK
                }}
            />
            <TouchableOpacity
                style={{
                    backgroundColor: Colors.BLUE,
                    padding: 12,
                    marginTop: 14,
                    borderRadius: 6,
                }}
                onPress={() => {
                    if (!nameVal) {
                        showErrorToast("Please enter your name")
                    } else if (!meetingVal) {
                        showErrorToast("Please enter meeting id")
                    } else {
                        props.setIsHost(false);
                        props.getMeetingId(meetingVal);
                        props.setName(nameVal)
                    }
                }}
            >
                <Text style={{ color: Colors.WHITE, alignSelf: "center", fontSize: 18 }}>
                    Join Meeting
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default JoinScreen