import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
} from 'react-native';

const IncomingCallModal = ({ visible, onAccept, onDecline }) => {
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
            animationType="fade"
            visible={visible}
        >
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.modalView,
                        { transform: [{ scale: scaleAnim }] },
                    ]}
                >
                    <Text style={styles.callText}>Incoming Video Call</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.acceptButton]}
                            onPress={onAccept}
                        >
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.declineButton]}
                            onPress={onDecline}
                        >
                            <Text style={styles.buttonText}>Decline</Text>
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
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        elevation: 5,
    },
    callText: {
        fontSize: 24,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        padding: 15,
        borderRadius: 5,
        width: '45%',
    },
    acceptButton: {
        backgroundColor: '#28a745',
    },
    declineButton: {
        backgroundColor: '#dc3545',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default IncomingCallModal;
