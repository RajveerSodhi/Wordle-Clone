import '../Styles/RestartConfirmDialog.css';
import BackgroundOverlay from './BackgroundOverlay';

function RestartConfirmDialog({restartGame, onClose}) {
    return (
        <>
            <BackgroundOverlay />

            <div className="dialog centered centered-content">
                <div>
                    <h2>Are you sure?</h2>
                    <span className="description">You will be given a new word to guess.</span>
                </div>
                <div className="dialog-btn-container">
                    <button className="dialog-btn dialog-cancel-btn" onClick={() => onClose()}>Cancel</button>
                    <button className="dialog-btn dialog-restart-btn" onClick={() => restartGame()}>Restart</button>
                </div>
            </div>
        </>
    );
}

export default RestartConfirmDialog;