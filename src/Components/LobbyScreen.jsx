import WordleLogo from './WordleLogo.jsx';
import Footer from './Footer.jsx';
import '../Styles/LobbyScreen.css'
import { MdOutlineContentCopy } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import { motion } from "motion/react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

function LobbyScreen({setShowLobbyScreen, setIsGameActive, code, setToastType}) {
    const location = useLocation();
    const navigate = useNavigate();

    function copyGameLink() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setToastType("lobby-copyGameLink");
        });
    }

    function copyGameID() {
        navigator.clipboard.writeText(location.pathname.slice(0,)).then(() => {
            setToastType("lobby-copyGameID");
        });
    }

    function reload() {
        navigate("/", { replace: true });
    }

    function startGame() {
        setIsGameActive();
        setShowLobbyScreen();
    }

    return (
        <motion.div
            className="lobby"
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.2, ease: "linear" }}
        >
            <motion.div
                className="lobby-content"
                initial={{ opacity: 0, transform: 'translateY(1.5rem)' }}
                animate={{ opacity: 1, transform: 'translateY(0)' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <WordleLogo />

                <h1>Wordle</h1>
                <h3>Get 6 chances to</h3>
                <h3>guess a 5-letter word.</h3>

                <div className="lobby-btns-container">
                    <button className="share-btn" onClick={copyGameLink}>Create Game</button>
                    <button className="share-btn" onClick={copyGameLink}>Share Link</button>
                    <button className="play-btn" onClick={startGame}>Play</button>
                </div>

                <p className="addn-info-text">Game ID: <button className="addn-info-btn" onClick={copyGameID}>{code} <MdOutlineContentCopy /></button></p>
                <p className="addn-info-text">Already played this puzzle? <button className="addn-info-btn" onClick={reload}>Try a new one <TbReload /></button></p>
            </motion.div>

            <Footer lobbyFooter={true} />
        </motion.div>
    );
}

export default LobbyScreen;