import WordleLogo from './WordleLogo.jsx';
import Footer from './Footer.jsx';
import '../Styles/LobbyScreen.css'
import { useState } from 'react';
import { MdOutlineContentCopy } from "react-icons/md";
import { motion } from "motion/react";
import { useNavigate } from 'react-router-dom';

function LobbyScreen({setShowLobbyScreen, setIsGameActive, code}) {
    const [showCopiedLinkToast, setShowCopiedLinkToast] = useState(false);
    const navigate = useNavigate();

    function copyGameLink() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setShowCopiedLinkToast(true);
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
            { showCopiedLinkToast && <div className="copy-link-toast">Copied game link to clipboard!</div> }

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

                <p className="game-id">Game ID: <button className="copy-id-btn">{code} <MdOutlineContentCopy /></button></p>
                <p>Already played this puzzle? <button className="refresh-btn" onClick={reload}>Try a new one</button></p>
            </motion.div>

            <Footer lobbyFooter={true} />
        </motion.div>
    );
}

export default LobbyScreen;