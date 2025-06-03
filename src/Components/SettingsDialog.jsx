import '../Styles/SettingsDialog.css';
import { ImCross } from "react-icons/im";
import BackgroundOverlay from './BackgroundOverlay';

function SettingsDialog({ onClose }) {
    return (
        <>
            <BackgroundOverlay />

            <div className="dialog centered">
                <div className="back-btn-container">
                    <button className="back-btn" onClick={() => {onClose()}}><ImCross className="back-btn-icon" /></button>
                </div>

                <section>
                    <div>
                        <p className="setting-name">Hard Mode</p>
                        <p className="setting-desc">Any revealed hints must be used in subsequent guesses</p>
                    </div>
                    <input/>
                </section>

                <hr/>

                <section>
                    <div>
                        <p className="setting-name">Word Length</p>
                        <p className="setting-desc">Change the number of letters to be guessed</p>
                    </div>
                    <input/>
                </section>

                <hr/>

                <section>
                    <div>
                        <p className="setting-name">Guesses</p>
                        <p className="setting-desc">Change the amount of guesses you get</p>
                    </div>
                    <input/>
                </section>

                <hr/>

                <section>
                    <div>
                        <p className="setting-name">Dark Theme</p>
                    </div>
                    <input/>
                </section>

                <hr/>

                <section>
                    <div>
                        <p className="setting-name">High Contrast Mode</p>
                        <p className="setting-desc">Contrast and colorblindness improvements</p>
                    </div>
                    <input/>
                </section>

                <hr/>

                <section>
                    <div>
                        <p className="setting-name">Onscreen Keyboard Input Only</p>
                        <p className="setting-desc">Ignore key input except from the onscreen keyboard. Most helpful for users using speech recognition or other assistive devices.</p>
                    </div>
                    <input/>
                </section>
            </div>
        </>
    );
}

export default SettingsDialog;