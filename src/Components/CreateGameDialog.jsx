import '../Styles/CreateGameDialog.css';
import { ImCross } from "react-icons/im";
import { MdOutlineContentCopy } from "react-icons/md";
import { motion } from "motion/react";
import BackgroundOverlay from './BackgroundOverlay';
import { useState } from "react";

function CreateGameDialog({onClose, setToastType, showLobbyScreen}) {
    const [customChars, setCustomChars] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const gameExamples = ["HBDAY", "BFF", "SCHOOL", "POTTER", "WELCOME", "SWITCH", "RAJVEER", "PRANK", "FISH", "FIFA", "JUHI", "ARSH", "ASH", "PIKACHU", "TRUMP", "JAPAN", "ILOVEU", "SIMRAN"];

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        setCustomChars(value.length);
    };

    function getCustomLink() {
        function encrypt(word) {
            const chars = "AaBbCcDdEeFfGgHhIiJjKlLkMmOnNoPpQqRrSsTtUuVvWwXxYyZz";
            let result = "";
            let shift = word.length;
            let charsLength = chars.length;
            
            for(let char of word.toUpperCase()) {
                let newCharCode = char.charCodeAt(0) + shift - charsLength;
                result += chars[newCharCode];
            }
            return result;
        }

        const baseURL = window.location.href.split("/").slice(0, -1).join("/");
        // const baseURL = "https://wordle.rajveersodhi.com";
        let code = encrypt(inputValue);
        let customURL = `${baseURL}/${code}?custom=true`

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(customURL)
            .then(() => {
                setToastType(`${showLobbyScreen ? "lobby-" : ""}copyCustomLink`);
            }).catch(err => {
                console.error("Clipboard write failed", err);
            });
        } else {
            setToastType(`${showLobbyScreen ? "lobby-" : ""}copyError`);
        }
    }

    return (
        <>
            <BackgroundOverlay isCreateGameDialog = {true} />

            <motion.div
                className={`dialog centered center-content moved-up ${showLobbyScreen ? "dialog-on-lobby" : ""}`}
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
                                <input maxLength="20" autoFocus value={inputValue} onChange={handleInputChange} className="input-box" type="text" placeholder={`How about... '${gameExamples[Math.floor(Math.random() * gameExamples.length)].toUpperCase()}'`}/>
                            </div>

                            <div className="char-limit-desc">
                                <span className="min-lim">3 ≤</span>
                                <span className={`curr-chars ${customChars >= 3 && customChars <= 7 ? "" : "show-invalid"}`}>{customChars}</span>
                                <span className="max-lim">≤ 7</span>
                            </div>
                        </div>
                </div>

                <button onClick={getCustomLink} disabled={!(customChars >= 3 && customChars <= 7 && /^[a-z]+$/i.test(inputValue))} className="main-btn copy-custom-link-btn">Copy Custom Link <MdOutlineContentCopy className="btn-icon"/></button>
            </motion.div>
        </>
    );
}

export default CreateGameDialog;