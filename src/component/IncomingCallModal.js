import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../helper/Colors';

const IncomingCallModal = ({ visible, onAccept, onDecline, name, hideModal }) => {
    const scaleAnim = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0); // Reset scale when modal is closed
        }
    }, [visible]);

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={hideModal}
            animationType="slide"
        >
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.modalView,
                        { transform: [{ scale: scaleAnim }] },
                    ]}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <View style={{
                            height: 100,
                            width: 100,
                            backgroundColor: Colors.TEXT_GRAY,
                            borderRadius: 60,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <MaterialIcons
                                size={60}
                                color={Colors.WHITE}
                                name={"person"}
                            />
                        </View>
                        <Text style={styles.callText}>Incoming Video Call</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.acceptButton]}
                            onPress={onAccept}
                        >
                            <MaterialIcons
                                size={24}
                                color={Colors.WHITE}
                                name={"call"}
                            />
                            {/* <Text style={styles.buttonText}>Accept</Text> */}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.declineButton]}
                            onPress={onDecline}
                        >
                            <MaterialIcons
                                size={24}
                                color={Colors.WHITE}
                                name={"close"}
                            />
                            {/* <Text style={styles.buttonText}>Decline</Text> */}
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalView: {
        // marginTop: 20,
        width: '100%',
        height: '100%',
        padding: 16,
        // borderRadius: 10,
        backgroundColor: 'white',
        // alignItems: 'center',
        elevation: 5,
    },
    callText: {
        fontSize: 16,
        marginTop: 20,
        fontWeight: "bold"
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        width: '100%',
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        width: '30%',
    },
    acceptButton: {
        backgroundColor: '#28a745',
        borderRadius: 30,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    declineButton: {
        backgroundColor: '#dc3545',
        borderRadius: 30,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default IncomingCallModal;
