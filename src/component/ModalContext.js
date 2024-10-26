// ModalContext.js
import React, { createContext, useState, useEffect } from 'react';
import { setModalRef } from './ModalManager';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isModalVisible, setModalVisible] = useState(false);

    // Register the modal visibility function with ModalManager
    useEffect(() => {
        setModalRef(setModalVisible);  // Register setModalVisible as the global ref
    }, []);

    const hideModal = () => setModalVisible(false);

    return (
        <ModalContext.Provider value={{ isModalVisible, hideModal }}>
            {children}
        </ModalContext.Provider>
    );
};
