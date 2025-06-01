function GuessBox({ state = "idle", match = "incorrect", char, celebrate = false }) {
    return (
        <span className={`guess ${state} ${state == "submitted" ? match : "correct"} ${celebrate ? "celebrate" : ""}`}
        >
            {char.toUpperCase()}
        </span>
    );
}

export default GuessBox;