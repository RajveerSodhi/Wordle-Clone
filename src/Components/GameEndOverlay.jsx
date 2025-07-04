import '../Styles/GameEndOverlay.css';
import { IoShareSocialOutline, IoPlayOutline } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { MdOutlineStarPurple500, MdOutlineContentCopy } from "react-icons/md";
import { motion } from "motion/react";

function GameEndOverlay({rows, didUserWin, onClose, currentRowIndex, code, isCustom, restartGameFn, setToastType}) {
    function copyGameLink() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(window.location.href)
            .then(() => {
                setToastType("gameEnd-copyGameLink");
            }).catch(err => {
                console.error("Clipboard write failed", err);
            });
        } else {
            setToastType("copyError");
        }
    }
    
    function getSharableResult(rows) {
        let max_tries = rows.length;
        let ans_length = rows[0].length;
        let result = "";

        result += `Wordle '${code}' ${isCustom ? "(Custom) " : ""} ${didUserWin ? currentRowIndex : "X"}/${max_tries}\n\n`;

        for (let i = 0; i < max_tries; i++) {
            if (rows[i][0].char === '') continue;
            for (let j = 0; j < ans_length; j++) {
                let guess = rows[i][j]
                let guess_match = guess.match
                let guess_state = guess.state
                if (guess_state !== "submitted") continue;
                if (guess_match === "correct" ) {
                    result += "🟩";
                } else if (guess_match === "almost-correct") {
                    result += "🟨";
                } else if (guess_match === "incorrect") {
                    result += "⬛️";
                }
            }
            result += "\n";
        }

        result += `\nTry it yourself!\n${window.location.href}`;

        result = result.trim();

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(result)
            .then(() => {
                setToastType("gameEnd-copyGameResult");
            }).catch(err => {
                console.error("Clipboard write failed", err);
            });
        } else {
            setToastType("copyError");
        }
    }

    return (
        <motion.div
            className="background"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{ opacity: 0}}
            transition={{ duration: 0.2, ease: "linear" }}
        >
            <motion.section
                initial={{opacity: 0, transform: "translateY(2rem)", pointerEvents: 'none'}}
                animate={{opacity: 1, transform: "translateY(0)", pointerEvents: 'all'}}
                exit={{ opacity: 0, transform: "translateY(2rem)", pointerEvents: 'none' }}
                transition={{ duration: 0.35, ease: "linear" }}
            >
                <div className="back-btn-container">
                    <button className="back-btn" onClick={() => {onClose()}}>Back to puzzle <ImCross className="back-btn-icon" /></button>
                </div>
                <div className="card-title">
                    <span className="star-outer-bg">
                        <span className="star-inner-bg">
                            <MdOutlineStarPurple500 className="star-icon" />
                        </span>
                    </span>
                    <h1>{ didUserWin ? "Congratulations!" : "So Close!" }</h1>
                </div>

                <div className="main-btn-container">
                    {/* <button className="main-btn" onClick={() => getSharableResult(rows, didUserWin)}>
                        Create Game <IoShareSocialOutline className="btn-icon" />
                    </button> */}

                    <button className="main-btn" onClick={() => getSharableResult(rows, didUserWin)}>
                        Share Results <IoShareSocialOutline className="btn-icon" />
                    </button>

                    <button className="main-btn" onClick={() => restartGameFn()}>
                        Play Again <IoPlayOutline className="btn-icon" />
                    </button>
                </div>
                <p className="addn-info-text light"><button className="addn-info-btn light" onClick={copyGameLink}>Share this puzzle <MdOutlineContentCopy /></button></p>
            </motion.section>
        </motion.div>
    );
}

export default GameEndOverlay;