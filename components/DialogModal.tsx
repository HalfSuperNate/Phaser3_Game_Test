import React, { useEffect } from 'react';

interface DialogModalProps {
    showDialog: boolean;
    onClose: () => void;
    dialogues: { dialogType: string; title: string; message: string }[];
    currentDialogueIndex: number; // Add currentDialogueIndex prop
    onNext: () => void;
}

const DialogModal: React.FC<DialogModalProps> = ({ showDialog, onClose, dialogues, currentDialogueIndex, onNext }) => {
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

    // Check if dialogues array is empty or currentDialogueIndex is out of bounds
    if (!dialogues.length || currentDialogueIndex < 0 || currentDialogueIndex >= dialogues.length) {
        return null; // Return null if no dialogues or invalid currentDialogueIndex
    }

    const currentDialogue = dialogues[currentDialogueIndex];
    
    return (
        <dialog className="dialogBox" open={showDialog}>
            <div>
                <h2>{currentDialogue.title}</h2>
                <p>{currentDialogue.message}</p>
            </div>
            {currentDialogueIndex < dialogues.length - 1 && ( // Show next button if there are more messages
                <button onClick={onNext}>Next</button>
            )}
            <button onClick={onClose}>Close</button>
        </dialog>
    );
};

export default DialogModal;