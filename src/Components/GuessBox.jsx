function GuessBox({ state = "idle", match = "incorrect", char, celebrate = false, shake = false, shakeDuration = 500, ansSize = 5, maxGuesses = 6 }) {
    console.log(ansSize);
    return (
        <span className={`guess prevent-select
                ${state} ${state === "submitted" ? match : "correct"}
                ${celebrate ? "celebrate" : ""}
                ${shake ? "dne" : ""}
                ${ansSize === 6 ? "smaller-x6" : ansSize === 7 ? "smaller-x7" : ansSize === 8 ? "smaller-x8" : ""}
                ${ansSize === 7 && maxGuesses === 8  ? "smaller-x7y8" : ansSize === 8 && maxGuesses === 8 ? "smaller-x8y8" : ansSize === 6 && maxGuesses === 7 ? "smaller-x6y7" : ansSize === 6 && maxGuesses === 8 ? "smaller-x6y8" : ansSize <= 5 && maxGuesses === 7 ? "smaller-x5y7" : ansSize <= 5 && maxGuesses === 8 ? "smaller-x5y8" : ""}
            `}
        >
            {char.toUpperCase()}
        </span>
    );
}

export default GuessBox;