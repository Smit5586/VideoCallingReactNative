// ModalManager.js
import { useRef } from 'react';

// Create a ref for controlling the modal
const modalRef = { current: null };

export const setModalRef = (ref) => {
    modalRef.current = ref;
};

export const showModal = () => {
    console.log("current 1");

    if (modalRef.current) {
        console.log("current 2");
        modalRef.current(true);  // Set modal to visible
    }
};

export const hideModal = () => {
    if (modalRef.current) {
        modalRef.current(false);  // Set modal to hidden
    }
};
