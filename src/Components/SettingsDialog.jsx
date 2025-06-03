import '../Styles/SettingsDialog.css';
import BackgroundOverlay from './BackgroundOverlay';

function SettingsDialog({ onClose }) {
    return (
        <>
            <BackgroundOverlay />

            <div className="dialog centered">
                <div>
                    <h2>Are you sure?</h2>
                    <span className="description">You will be given a new word to guess.</span>
                </div>
                <div className="dialog-btn-container">
                    <button className="dialog-btn dialog-cancel-btn" onClick={() => onClose()}>Cancel</button>
                    <button className="dialog-btn dialog-restart-btn" onClick={() => onClose()}>Restart</button>
                </div>
            </div>
        </>
    );
}

export default SettingsDialog;