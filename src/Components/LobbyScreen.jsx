import WordleLogo from './WordleLogo.jsx';
import Footer from './Footer.jsx';
import '../Styles/LobbyScreen.css'
import { useState } from 'react';
import { MdOutlineContentCopy } from "react-icons/md";

function LobbyScreen({showLobbyScreen}) {
    const [showCopiedLinkToast, setShowCopiedLinkToast] = useState(false);

    function copyGameLink() {
        navigator.clipboard.writeText("copied!").then(() => {
            setShowCopiedLinkToast(true);
        });
    }
    return (
        <div className="lobby">
            <div className="lobby-content">
                <WordleLogo />

            <h1>Wordle</h1>
            <h3>Get 6 chances to</h3>
            <h3>guess a 5-letter word.</h3>

            <div className="lobby-btns-container">
                <button className="share-btn" onClick={copyGameLink}>Share Link</button>
                <button className="play-btn" onClick={() => showLobbyScreen()}>Play</button>
            </div>

            { showCopiedLinkToast && <div className="copy-link-toast">Copied game link to clipboard!</div> }

            <p className="game-id">Game ID: <button className="copy-id-btn">ABCD <MdOutlineContentCopy /></button></p>
            </div>

            <Footer lobbyFooter={true} />
        </div>
    );
}

export default LobbyScreen;