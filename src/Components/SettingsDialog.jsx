import '../Styles/SettingsDialog.css';
import { ImCross } from "react-icons/im";
import { motion } from "motion/react";
import BackgroundOverlay from './BackgroundOverlay';

function SettingsDialog({ onClose, max_guesses, ans_size, setAnsSize, setMaxGuesses, isHardMode, setIsHardMode, isKeyboardDisabled, setIsKeyboardDisabled }) {
    return (
        <>
            <BackgroundOverlay />

            <motion.div
                className="dialog centered center-content"
                initial={{opacity: 0, transform: "translateY(2rem)", pointerEvents: 'none'}}
                animate={{opacity: 1, transform: "translateY(0)", pointerEvents: 'all'}}
                exit={{ opacity: 0, transform: "translateY(2rem)", pointerEvents: 'none' }}
                transition={{ duration: 0.2, ease: "linear" }}
            >
                <div className="back-btn-container">
                    <button className="back-btn" onClick={() => {onClose()}}><ImCross className="back-btn-icon" /></button>
                </div>

                <h2 className="dialog-title">Settings</h2>

                <section className="setting">
                    <div className="setting-name-desc-container">
                        <p className="setting-name">Hard Mode</p>
                        <p className="setting-desc">Any revealed hints must be used in subsequent guesses.</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={isHardMode} onChange={(e) => setIsHardMode(e.target.checked)}/>
                        <span className="slider round"></span>
                    </label>
                </section>

                <hr/>

                <section className="setting">
                    <div className="setting-name-desc-container">
                        <p className="setting-name">Word Length</p>
                        <p className="setting-desc">Change the number of letters to be guessed. A new word will be generated.</p>
                    </div>
                    <select name="ans_length" id="ans_length" className="select" value={ans_size.toString()} onChange={(e) => setAnsSize(parseInt(e.target.value))}>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                    </select>
                </section>

                <hr/>

                <section className="setting">
                    <div className="setting-name-desc-container">
                        <p className="setting-name">Guesses</p>
                        <p className="setting-desc">Change the amount of tries you get to guess the answer</p>
                    </div>
                    <select name="max_tries" id="max_tries" className="select" value={max_guesses.toString()} onChange={(e) => setMaxGuesses(parseInt(e.target.value))}>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                    </select>
                </section>

                <hr className="divider"/>

                {/* <section className="setting">
                    <div className="setting-name-desc-container">
                        <p className="setting-name">Dark Theme</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox"/>
                        <span className="slider round"></span>
                    </label>
                </section>

                <hr/> */}

                {/* <section className="setting">
                    <div className="setting-name-desc-container">
                        <p className="setting-name">High Contrast Mode</p>
                        <p className="setting-desc">Contrast and colorblindness improvements</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox"/>
                        <span className="slider round"></span>
                    </label>
                </section>

                <hr/> */}

                <section className="setting">
                    <div className="setting-name-desc-container">
                        <p className="setting-name">Onscreen Keyboard Input Only</p>
                        <p className="setting-desc">Ignore key input except from the onscreen keyboard. Most helpful for users using speech recognition or other assistive devices.</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={isKeyboardDisabled} onChange={(e) => setIsKeyboardDisabled(e.target.checked)}/>
                        <span className="slider round"></span>
                    </label>
                </section>

                <hr/>

                <p className="settings-footer"><a href="https://www.nytimes.com/games/wordle/index.html" target = "_blank" rel="noreferrer">Wordle</a> Clone made by <a href="https://www.rajveersodhi.com" target = "_blank" rel="noreferrer">Rajveer Sodhi</a></p>
            </motion.div>
        </>
    );
}

export default SettingsDialog;