import { FlatList, Text, View } from "react-native";
import ParticipantView from "./ParticipantView";


const ParticipantList = ({ participants }) => {
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
                backgroundColor: "#F6F6FF",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 20, color: 'black' }}>Press Join button to enter meeting.</Text>
        </View>
    );
}

export default ParticipantList