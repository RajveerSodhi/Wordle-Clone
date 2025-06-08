import '../Styles/HelpDialog.css';
import { motion } from "motion/react";
import { ImCross } from "react-icons/im";
import BackgroundOverlay from './BackgroundOverlay';

function HelpDialog({ onClose }) {
    return (
        <>
            <BackgroundOverlay />

            <motion.div
                className="dialog centered"
                initial={{opacity: 0, transform: "translateY(2rem)", pointerEvents: 'none'}}
                animate={{opacity: 1, transform: "translateY(0)", pointerEvents: 'all'}}
                exit={{ opacity: 0, transform: "translateY(2rem)", pointerEvents: 'none' }}
                transition={{ duration: 0.2, ease: "linear" }}
            >
                <div className="back-btn-container">
                    <button className="back-btn" onClick={() => {onClose()}}><ImCross className="back-btn-icon" /></button>
                </div>
                <h2>How To Play</h2>
                <p className="subtitle"> Guess the Wordle in 6 tries.</p>

                <ul>
                    <li>Each guess must be a valid 5-letter word.</li>
                    <li>The color of the tiles will change to show how close your guess was to the word.</li>
                </ul>

                <h4>Examples</h4>
                <div className="eg">
                    <div className="guess-eg">
                        <span className="correct-colored">W</span>
                        <span>O</span>
                        <span>R</span>
                        <span>D</span>
                        <span>Y</span>
                    </div>
                    <p><strong>W</strong> is in the word and the correct spot.</p>
                </div>

                <div className="eg">
                    <div className="guess-eg">
                        <span>L</span>
                        <span className="almost-correct-colored">I</span>
                        <span>G</span>
                        <span>H</span>
                        <span>T</span>
                    </div>
                    <p><strong>I</strong> is in the word but in the wrong spot.</p>
                </div>

                <div className="eg">
                    <div className="guess-eg">
                        <span>R</span>
                        <span>O</span>
                        <span>G</span>
                        <span className="incorrect-colored">U</span>
                        <span>E</span>
                    </div>
                    <p><strong>U</strong> is not in the word in any spot.</p>
                </div>

                <p className="note">Check out the settings to mess around with word length or maximum number of tries.
                    Or create a custom wordle puzzle to send to your friends!</p>
            </motion.div>
        </>
    );
}

export default HelpDialog;