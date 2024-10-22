import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import Colors from './Colors';

export const toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: Colors.COLOR_SUCCESS,
                borderLeftWidth: 3,
            }}
            text1NumberOfLines={3}
            text2NumberOfLines={3}
        />
    ),
    error: (props) => (
        <ErrorToast
            {...props}
            style={{
                borderLeftColor: Colors.COLOR_ERROR,
                borderLeftWidth: 3,
            }}
            text1NumberOfLines={5}
            text2NumberOfLines={3}
        />
    ),
};

export function showErrorToast(msg) {
    return Toast.show({ type: "error", text1: msg });
}

export function showSuccessToast(msg) {
    return Toast.show({ type: "success", text1: msg });
}