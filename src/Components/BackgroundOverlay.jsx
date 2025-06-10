import { useEffect } from 'react';
import { motion } from "motion/react";
import '../Styles/BackgroundOverlay.css';

function BackgroundOverlay({isCreateGameDialog = false}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            if (!isCreateGameDialog) {
                e.preventDefault();
            e.stopPropagation();
            }
        };

        if (!isCreateGameDialog) document.activeElement.blur();
        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, []);

    return(
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{ opacity: 0}}
            transition={{ duration: 0.2, ease: "linear" }}
            className="bg-overlay"
        ></motion.div>
    );
}

export default BackgroundOverlay;