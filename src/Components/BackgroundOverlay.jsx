import { useEffect } from 'react';
import '../Styles/BackgroundOverlay.css';

function BackgroundOverlay() {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            e.preventDefault();
            e.stopPropagation();
        };

        document.activeElement.blur();
        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, []);

    return(<div className="bg-overlay"></div>);
}

export default BackgroundOverlay;