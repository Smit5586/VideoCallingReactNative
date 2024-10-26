// ModalContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { setModalRef } from './ModalManager';

export const ModalContext = createContext();

let setMeetingIdExternal;
export const ModalProvider = ({ children }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [meetingId, setMeetingId] = useState(null);
    setMeetingIdExternal = setMeetingId;
    // Register the modal visibility function with ModalManager
    useEffect(() => {
        setModalRef(setModalVisible);  // Register setModalVisible as the global ref
    }, []);

    const hideModal = () => setModalVisible(false);

    return (
        <ModalContext.Provider value={{ isModalVisible, hideModal, meetingId, setMeetingId }}>
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
