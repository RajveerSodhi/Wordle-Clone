import '../Styles/Toast.css';
import { useState, useEffect } from 'react';

function Toast({type, onClose, currentRowIndex = 0, answer = "default", duration = 2000, exitMs = 300}) {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const exitTimer = setTimeout(() => setExiting(true), duration - exitMs);

        const killTimer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
        clearTimeout(exitTimer);
        clearTimeout(killTimer);
        };
    }, [duration, exitMs, onClose]);

    function getMessage() {
        if (type === "word-dne") {
            return "Not in word list";
        } else if (type === "user-won") {
            switch (currentRowIndex) {
                case 1: return "Genius";
                case 2: return "Magnificent";
                case 3: return "Impressive";
                case 4: return "Splendid";
                case 5: return "Great";
                case 6: return "Phew";
                default: return "Splendid";
            }
        } else if (type === "user-lost") {
            return answer.toUpperCase();
        } else if (type === "unavailablePast0") {
            return "Only available at the start of a game";
        } else if (type.includes("hardMode")) {
            let missingLetter = type.split("_")[1].toUpperCase();
            return `Guess must contain ${missingLetter}`;
        }
    }

    return (
        <span className={`toast prevent-select ${exiting ? 'toast--exit' : ''}`}>
            {getMessage()}
        </span>
    );
}

export default Toast;