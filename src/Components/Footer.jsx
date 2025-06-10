import '../Styles/Footer.css';

function Footer({lobbyFooter = false}) {
    return (
        <footer className={lobbyFooter ? "lobby-footer" : ""}>
            <ul>
                <li>Wordle Clone by <a href="https://www.rajveersodhi.com" target = "_blank" rel="noreferrer">Rajveer Sodhi</a></li>
                <li className="footer-divider">|</li>
                <li>Dedicated to my dad for getting me hooked!</li>
                <li className="footer-divider">|</li>
                <li><a href="https://www.nytimes.com/games/wordle/index.html" target = "_blank" rel="noreferrer">Visit Wordle</a></li>
            </ul>
        </footer>
    );
}

export default Footer;
