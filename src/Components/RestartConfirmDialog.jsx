import '../Styles/RestartConfirmDialog.css';
import BackgroundOverlay from './BackgroundOverlay';
import { motion } from "motion/react";

function RestartConfirmDialog({restartGame, onClose}) {
    return (
        <>
            <BackgroundOverlay />

            <motion.div
                initial={{opacity: 0, transform: "translateY(2rem)", pointerEvents: 'none'}}
                animate={{opacity: 1, transform: "translateY(0)", pointerEvents: 'all'}}
                exit={{ opacity: 0, transform: "translateY(2rem)", pointerEvents: 'none' }}
                transition={{ duration: 0.2, ease: "linear" }}
                className="dialog centered centered-content"
            >
                <div>
                    <h2>Are you sure?</h2>
                    <span className="description">You will be given a new word to guess.</span>
                </div>
                <div className="dialog-btn-container">
                    <button className="dialog-btn dialog-cancel-btn" onClick={() => onClose()}>Cancel</button>
                    <button className="dialog-btn dialog-restart-btn" onClick={() => restartGame()}>Restart</button>
                </div>
            </motion.div>
        </>
    );
}

export default RestartConfirmDialog;