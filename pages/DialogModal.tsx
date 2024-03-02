import React, { useEffect } from 'react';

interface DialogModalProps {
    showDialog: boolean;
    onClose: () => void;
    dialogType: string; // Add prop for dialog type
    dialogMessage: string; // Add prop for dialog message
}

const DialogModal: React.FC<DialogModalProps> = ({ showDialog, onClose, dialogType, dialogMessage }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (showDialog && (event.key === 'Enter' || event.key === 'Escape')) {
                onClose();
            }
        };

        if (showDialog) {
            document.body.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.removeEventListener('keydown', handleKeyDown);
        };
    }, [showDialog, onClose]);
    
    return (
        <dialog open={showDialog}>
            <h2>{dialogType}</h2>
            <p>{dialogMessage}</p> {/* Display dynamic message */}
            <button onClick={onClose}>Close</button>
        </dialog>
    );
};

export default DialogModal;