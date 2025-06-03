import '../Styles/CreateDialog.css';
import BackgroundOverlay from './BackgroundOverlay';

function CreateDialog({restartGame, onClose}) {
    return (
        <>
            <BackgroundOverlay />

            <div className="dialog centered">
                <div>
                    <h2>Are you sure?</h2>
                    <span className="description">You will be given a new word to guess.</span>
                </div>
            </div>
        </>
    );
}

export default CreateDialog;