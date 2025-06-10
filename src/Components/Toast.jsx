import '../Styles/Toast.css';
import { useEffect } from 'react';
import { motion } from "motion/react";

function Toast({type, onClose, currentRowIndex = 0, answer = "default", duration = 2000}) {
    const isDark = ["copyGameID", "copyGameLink"].includes(type);
    useEffect(() => {
        const killTimer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
        clearTimeout(killTimer);
        };
    }, [duration, onClose]);

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
        } else if (type.includes("copyGameID")) {
            return "Copied game ID to clipboard!"
        } else if (type.includes("copyGameLink")) {
            return "Copied game link to clipboard!"
        }
    }

    return (
        <motion.span
            className={`toast prevent-select ${isDark ? "dark" : ""}`}
            initial={{ opacity: 0, transform: 'translateY(1.5rem)' }}
            animate={{ opacity: 1, transform: 'translateY(0)' }}
            exit={{ opacity: 0, transform: 'translateY(1.5rem)' }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            {getMessage()}
        </motion.span>
    );
}

export default Toast;