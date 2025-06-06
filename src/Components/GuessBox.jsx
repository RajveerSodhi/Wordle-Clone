function GuessBox({ state = "idle", match = "incorrect", char, celebrate = false, shake = false, shakeDuration = 500 }) {

    return (
        <span className={`guess prevent-select ${state} ${state === "submitted" ? match : "correct"} ${celebrate ? "celebrate" : ""} ${shake ? "dne" : ""}`}
        >
            {char.toUpperCase()}
        </span>
    );
}

export default GuessBox;