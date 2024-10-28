// ModalContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { setModalRef } from './ModalManager';

export const ModalContext = createContext();

let setMeetingIdExternal;
export const ModalProvider = ({ children }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [meetingId, setMeetingId] = useState(null);
    const [tempMeetingId, setTempMeetingId] = useState(null)
    setMeetingIdExternal = setMeetingId;
    // Register the modal visibility function with ModalManager
    useEffect(() => {
        // Register the ref with a function that updates both visibility and meetingId
        setModalRef((visible, id) => {
            console.log("visible", visible);

            setTempMeetingId(null)
            setModalVisible(visible);
            if (id !== undefined) {
                setTempMeetingId(id)
            } else {
                setTempMeetingId(null)
            }
        });
    }, []);

    const hideModal = () => {
        setModalVisible(false)
        // setTempMeetingId(null)
    };

    return (
        <ModalContext.Provider
            value={{
                isModalVisible,
                hideModal,
                meetingId,
                setMeetingId,
                tempMeetingId,
                setTempMeetingId
            }}>
            {children}
        </ModalContext.Provider>
    );
};

export const updateMeetingIdExternally = (id) => {
    if (setMeetingIdExternal) {
        setMeetingIdExternal(id);
    }
};

export const useMeeting = () => useContext(ModalContext);
