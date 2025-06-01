function GuessBox({ state = "idle", match = "incorrect", char, celebrate = false }) {
    return (
        <span className={`guess prevent-select ${state} ${state == "submitted" ? match : "correct"} ${celebrate ? "celebrate" : ""}`}
        >
            {char.toUpperCase()}
        </span>
    );
}

export default GuessBox;