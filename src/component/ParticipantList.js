import { FlatList, Text, View } from "react-native";
import ParticipantView from "./ParticipantView";
import Colors from "../helper/Colors";


const ParticipantList = ({ participants, localMicOn, name }) => {
    return participants.length > 0 ? (
        <FlatList
            data={participants}
            renderItem={({ item }) => {
                return <ParticipantView participantId={item} />;
            }}
        />
    ) : (
        <View
            style={{
                flex: 1,
                backgroundColor: Colors.WHITE,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 20, color: Colors.TEXT_BLACK }}>Press Join button to enter meeting.</Text>
        </View>
    );
}

export default ParticipantList