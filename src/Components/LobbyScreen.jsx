import WordleLogo from './WordleLogo.jsx';
import Footer from './Footer.jsx';
import '../Styles/LobbyScreen.css'
import { useState } from 'react';
import { MdOutlineContentCopy } from "react-icons/md";
import { motion } from "motion/react";

function LobbyScreen({setShowLobbyScreen}) {
    const [showCopiedLinkToast, setShowCopiedLinkToast] = useState(false);

    function copyGameLink() {
        navigator.clipboard.writeText("copied!").then(() => {
            setShowCopiedLinkToast(true);
        });
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
                    <button className="play-btn" onClick={() => setShowLobbyScreen()}>Play</button>
                </div>

                <p className="game-id">Game ID: <button className="copy-id-btn">ABCD <MdOutlineContentCopy /></button></p>
            </motion.div>

            <Footer lobbyFooter={true} />
        </motion.div>
    );
}

export default LobbyScreen;