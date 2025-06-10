import '../Styles/CreateGameDialog.css';
import { ImCross } from "react-icons/im";
import { MdOutlineContentCopy } from "react-icons/md";
import { motion } from "motion/react";
import BackgroundOverlay from './BackgroundOverlay';
import Toast from "../Components/Toast.jsx"
// import { useState } from "react";

function CreateGameDialog({onClose, setToastType}) {
    // const [createGameToastType, setCreateGameToastType] = useState("");
    const gameExamples = ["HBDAY", "BFF", "SCHOOL", "WELCOME", "SWITCH", "RAJVEER", "PRANK", "FISH", "ASH", "SQUIRTLE", "TRUMP", "JAPAN", "ILOVEYOU"];

    return (
        <>
            <BackgroundOverlay isCreateGameDialog = {true} />

            <motion.div
                className="dialog centered center-content"
                initial={{opacity: 0, transform: "translateY(2rem)", pointerEvents: 'none'}}
                animate={{opacity: 1, transform: "translateY(0)", pointerEvents: 'all'}}
                exit={{ opacity: 0, transform: "translateY(2rem)", pointerEvents: 'none' }}
                transition={{ duration: 0.2, ease: "linear" }}
            >
                <div>
                    <div className="back-btn-container">
                        <button className="back-btn" onClick={() => {onClose()}}><ImCross className="back-btn-icon" /></button>
                    </div>
                    <h2 className='dialog-title'>Create Game</h2>

                    <span className="description">Share a personalized puzzle with your friends — or just a really tough one!</span>
                        <div className="custom-game-input-container">
                            <div className="input-inner-container">
                                <label className="input-label">Enter puzzle answer</label>
                                <input autoFocus className="input-box" type="text" placeholder={`How about... '${gameExamples[Math.floor(Math.random() * gameExamples.length)].toUpperCase()}'`}/>
                            </div>

                            <div className="char-limit-desc">
                                <span className="min-lim">3 ≤</span>
                                <span className="curr-chars">5</span>
                                <span className="max-lim">≤ 8</span>
                            </div>
                        </div>
                </div>

                <button onClick={() => setToastType()} className="main-btn copy-custom-link-btn">Copy Custom Link <MdOutlineContentCopy className="btn-icon"/></button>
            </motion.div>
        </>
    );
}

export default CreateGameDialog;