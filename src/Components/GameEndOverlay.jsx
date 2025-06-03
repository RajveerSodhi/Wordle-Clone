import '../Styles/GameEndOverlay.css';
import { IoShareSocialOutline, IoPlayOutline } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { useState } from 'react';

function GameEndOverlay({rows, didUserWin, onClose, currentRowIndex, answer, restartGame}) {
    const [showCopiedToast, setShowCopiedToast] = useState(false);

    function getSharableResult(rows) {
        let max_tries = rows.length;
        let ans_length = rows[0].length;
        let result = "";

        result += `Wordle '${answer.toUpperCase()}' ${currentRowIndex}/${max_tries}\n`;

        for (let i = 0; i < max_tries; i++) {
            for (let j = 0; j < ans_length; j++) {
                let guess = rows[i][j]
                let guess_match = guess.match
                let guess_state = guess.state
                if (guess_state != "submitted") continue;
                if (guess_match == "correct" ) {
                    result += "🟩";
                } else if (guess_match == "almost-correct") {
                    result += "🟨";
                } else if (guess_match == "incorrect") {
                    result += "⬛️";
                }
            }
            result += "\n";
        }
        result = result.trim();

        navigator.clipboard.writeText(result).then(() => {
            setShowCopiedToast(true);
        });
    }

    return (
        <div className="background">
            <section>
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

                { showCopiedToast && <div className="copy-toast">Copied results to clipboard!</div> }

                <div className="main-btn-container">
                    <button className="main-btn" onClick={() => getSharableResult(rows, didUserWin)}>
                        Share <IoShareSocialOutline className="btn-icon" />
                    </button>

                    <button className="main-btn" onClick={() => restartGame()}>
                        Play Again <IoPlayOutline className="btn-icon" />
                    </button>
                </div>
            </section>
        </div>
    );
}

export default GameEndOverlay;