import './Styles/App.css';
import './Styles/VirtualKeyboard.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, redirect } from "react-router-dom";
import { LuDelete } from "react-icons/lu";
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import GuessBox from './Components/GuessBox';
import Toast from './Components/Toast';
import GameEndOverlay from './Components/GameEndOverlay';
import RestartConfirmDialog from './Components/RestartConfirmDialog';
import HelpDialog from './Components/HelpDialog';
import SettingsDialog from './Components/SettingsDialog';
import CreateDialog from './Components/CreateDialog';
import LobbyScreen from './Components/LobbyScreen';

function App() {
    const keyRows = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["z", "x", "c", "v", "b", "n", "m"]
    ];
    const blankGuess = { char: "", state: "idle", celebrate: false, match: "incorrect", shake: false };
    // const blankKey = { char: "", state: "idle", match: "incorrect" };

    // state variables
    let [MAX_GUESSES, setMaxGuesses] = useState(6);
    let [ANS_SIZE, setAnsSize] = useState(5);
    let [isGameActive, setIsGameActive] = useState(true);
    let [didUserWin, setDidUserWin] = useState(false);
    let [currentRowIndex, setCurrentRowIndex] = useState(0);
    let [answer, setAnswer] = useState("")
    let [currentGuess, setCurrentGuess] = useState([]);
    let [rows, setRows] = useState(Array.from({ length: MAX_GUESSES }, () => Array.from({ length: ANS_SIZE }, () => ({ ...blankGuess }))));
    let [isLoading, setIsLoading] = useState(true);
    let [fetchError, setFetchError] = useState(null);
    let [toastType, setToastType] = useState(null);
    let [isKeyboardDisabled, setIsKeyboardDisabled] = useState(false);
    let [isHardMode, setIsHardMode] = useState(false);
    let [guessedLetters, setGuessedLetters] = useState([]);
    let [updateKeyboard, setUpdateKeyboard] = useState(false);
    let [showEndScreen, setShowEndScreen] = useState(false);
    let [showLobbyScreen, setShowLobbyScreen] = useState(true);
    let [showRestartConfirmDialog, setShowRestartConfirmDialog] = useState(false);
    let [showHelpDialog, setShowHelpDialog] = useState(false);
    let [showSettingsDialog, setShowSettingsDialog] = useState(false);
    let [showCreateDialog, setShowCreateDialog] = useState(false);
    let [isAnimating, setIsAnimating] = useState(false); 
    // let [keys, setKeys] = useState(Array.from({ length: 26 }, () => ({ ...blankKey })))

    let enteredWords = useRef(new Map());

    const fetchAnswer = useCallback(async () => {
        const url = `https://random-word-api.vercel.app/api?words=1&length=${ANS_SIZE}&type=uppercase`;
        try {
            // const res = await fetch(url);
            // if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            // const json = await res.json();
            // setAnswer(json[0]);
            setAnswer("REACH");
        } catch (err) {
            setFetchError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [ANS_SIZE]);

    const submitGuess = useCallback(async () => {
        async function isValid() {
            const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${currentGuess.join("")}`;
            try {
                // const res = await fetch(url);

                // if (res.status === 404) {
                //     return false;
                // }
                // if (!res.ok) {
                //     throw new Error(`Dictionary API error ${res.status}`);
                // }

                return true;
            } catch (err) {
                setFetchError(err.message)
                return false;
            }
        }

        function patchCurrentRow(patchFn) {
            setRows(prev => {
                const next = prev.map((r, idx) => (idx === currentRowIndex ? [...r] : r));
                next[currentRowIndex] = next[currentRowIndex].map(patchFn);
                return next;
            });
        }

        if (!isGameActive || currentGuess.length !== ANS_SIZE) return;

        setIsAnimating(true);

        let isWordValid = enteredWords.current.get(currentGuess.join(""));
        if (isWordValid === undefined) {
            isWordValid = await isValid();
            enteredWords.current.set(currentGuess.join(""), isWordValid);
        }

        if (!isWordValid) {
            setToastType("word-dne");
            patchCurrentRow(cell => ({ ...cell, state: "highlighted-no-bounce", shake: true }));
            await sleep(500);
            patchCurrentRow(cell => ({ ...cell, shake: false }));
            setIsAnimating(false);

            return;
        }

        if (isHardMode) {
            for (let i of guessedLetters) {
                if (!currentGuess.includes(i)) {
                    setToastType(`hardMode_${i}`);

                    patchCurrentRow(cell => ({ ...cell, state: "highlighted-no-bounce", shake: true }));
                    await sleep(500);
                    patchCurrentRow(cell => ({ ...cell, shake: false }));
                    setIsAnimating(false);

                    return;
                }
            }
        }

        for (let i = 0; i < ANS_SIZE; i++) {
            let guess = currentGuess[i].toUpperCase();
            let match = "incorrect";
            if (guess === answer[i]) {
                match = "correct";
                if (!guessedLetters.includes(guess)) {
                    setGuessedLetters(prev => [...prev, guess]);
                }  
            } else if (answer.includes(guess)) {
                match = "almost-correct";
                if (!guessedLetters.includes(guess)) {
                    setGuessedLetters(prev => [...prev, guess]);
                }                
            }

            setRows(prev => {
                const newRows = prev.map(row => [...row]);
                newRows[currentRowIndex][i] = {
                    char: currentGuess[i],
                    state: "submitted",
                    match: match
                };
                return newRows;
            });

            await sleep(300);
        }

        setUpdateKeyboard(true);
        setIsAnimating(false);
        setCurrentRowIndex(prev => prev + 1);

        if (currentGuess.join("").toUpperCase() === answer.toUpperCase()) {
            setIsGameActive(false);
            setDidUserWin(true);

            setToastType("user-won");

            for (let i = 0; i < ANS_SIZE; i++) {
                await sleep(150);
                setRows(prev => {
                    const next = prev.map(row => row.map(cell => ({ ...cell })));
                    next[currentRowIndex][i] = {
                    ...next[currentRowIndex][i],
                    celebrate: true
                    };
                    return next;
                });
            }

            await sleep(1000);
            setShowEndScreen(true);
            setIsAnimating(false);
        } else if (currentRowIndex >= MAX_GUESSES - 1) {
            setIsGameActive(false);
            setToastType("user-lost");
            setIsAnimating(false);
            await sleep(1650);
            setShowEndScreen(true);
        }

        setCurrentGuess([]);
    }, [currentGuess, currentRowIndex, guessedLetters, ANS_SIZE, isHardMode, isGameActive, MAX_GUESSES, answer]);

    const setCharInput = useCallback((key) => {
        if (!isGameActive) return;
        setCurrentGuess(prev => [...prev, key.toUpperCase()]);
        setRows(prev => {
            prev[currentRowIndex][currentGuess.length] = {
                char: key.toUpperCase(),
                state: "highlighted",
            };
            return prev;
        });
    }, [currentRowIndex, currentGuess, isGameActive]);

    function onScreenCharInput(key) {
        if (!isGameActive) return;
        setCharInput(key);
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function setAnsSizeFromSettings(size) {
        if (currentRowIndex !== 0) {
            setToastType("unavailablePast0");
            return;
        }

        setAnsSize(size);
        console.log(size);
    }

    function setMaxGuessesFromSettings(guesses) {
        if (currentRowIndex !== 0) {
            setToastType("unavailablePast0");
            return;
        }

        setMaxGuesses(guesses);
    }

    function setIsHardModeFromSettings(setting) {
        if (currentRowIndex !== 0) {
            setToastType("unavailablePast0");
            return;
        }

        setIsHardMode(setting);
    }

    function restartGame() {
        setUpdateKeyboard(false);
        setToastType(null);
        setRows(Array.from({ length: MAX_GUESSES }, () => Array.from({ length: ANS_SIZE }, () => ({ ...blankGuess }))));
        fetchAnswer();
        setCurrentGuess([]);
        setCurrentRowIndex(0);
        setDidUserWin(false);
        setIsGameActive(true);
        setGuessedLetters([]);
        
        const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i in alphabets) {
            const virtualKey = document.getElementById(`key_${alphabets[i]}`);
            if (!virtualKey) continue;
            virtualKey.className = "key prevent-select";
        }

        setShowRestartConfirmDialog(false);
        setShowEndScreen(false);
    }
    
    function isChar(key) {
        let code = key.toUpperCase().charCodeAt(0)
        return code >= 65 && code <= 90 && key.length === 1
    }

    const backspaceOnGuess = useCallback(() => {
        if (!isGameActive) return;
        if (currentGuess.length >= 1) {
            setRows(prev => {
                prev[currentRowIndex][currentGuess.length - 1] = {
                    char: ""
                };
                return prev;
            });
            setCurrentGuess(prev => prev.slice(0, -1));
        }
    }, [isGameActive, currentGuess, currentRowIndex]);

    useEffect(() => {
        const blankGuess = { char: "", state: "idle", celebrate: false, match: "incorrect", shake: false };

        setRows(Array.from({ length: MAX_GUESSES }, () =>
            Array.from({ length: ANS_SIZE }, () => ({ ...blankGuess }))
        ));
        fetchAnswer();
        setCurrentGuess([]);
        setCurrentRowIndex(0);
        setGuessedLetters([]);
        setDidUserWin(false);
        setIsGameActive(true);
        enteredWords.current.clear();
    }, [ANS_SIZE, MAX_GUESSES, fetchAnswer]);

    useEffect(() => {
        if (!updateKeyboard) return;

        for (let i = 0; i < ANS_SIZE; i++) {
            const guess = rows[currentRowIndex - 1][i];
            const guess_char = guess.char.toUpperCase();
            const guess_match = guess.match;
            const virtualKey = document.getElementById(`key_${guess_char}`);
            if (!virtualKey) continue;

            if (guess_match === "correct") {
                virtualKey.classList.remove("almost-correct");
                virtualKey.classList.add("correct");
            } else if (guess_match === "almost-correct") {
                if (!virtualKey.classList.contains("correct")) {
                    virtualKey.classList.add("almost-correct");
                }
            } else {
                virtualKey.classList.add("incorrect");
            }
        }

        setUpdateKeyboard(false);
    }, [updateKeyboard, ANS_SIZE, currentRowIndex, rows]);

    useEffect(() => {
        fetchAnswer();
    }, [fetchAnswer]);

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            let key = e.key
            if (isChar(key) && currentGuess.length < ANS_SIZE) {
                    setCharInput(key);
            } else if (key === 'Enter') {
                submitGuess();
            } else if (key === 'Backspace') {
                backspaceOnGuess();
            }
        }

        if (!isGameActive || isKeyboardDisabled) return;
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [currentGuess, currentRowIndex, isGameActive,  isKeyboardDisabled, ANS_SIZE, backspaceOnGuess, setCharInput, submitGuess])

    if (isLoading) return <p>Loading word...</p>;
    if (fetchError) return <p>Error: {fetchError}</p>;

    return (
        <>
            { showLobbyScreen && <LobbyScreen showLobbyScreen={() => setShowLobbyScreen(false)} /> }
            {
                !showLobbyScreen &&
                    <div className="App">
                        <Navbar
                            statsBtnFn={() => setShowEndScreen(true)}
                            restartBtnFn={() => setShowRestartConfirmDialog(true)}
                            helpBtnFn={() => setShowHelpDialog(true)}
                            settingsBtnFn={() => setShowSettingsDialog(true)}
                            createBtnFn={() => setShowCreateDialog(true)}
                            isGameActive={isGameActive}
                            didUserWin={didUserWin}
                            disableRestart={isAnimating || (currentRowIndex === 0)}
                        />

                        {toastType && (
                            <Toast
                                type={toastType}
                                answer={answer}
                                currentRowIndex={currentRowIndex}

                                onClose={() => setToastType(null)}
                            />
                        )}

                        <main>
                            <div className="board">
                                {
                                    rows.map((row, i) =>
                                        <div className="row" key={i}>
                                            {
                                                row.map((guess, j) => {
                                                    return <GuessBox
                                                                key={j}
                                                                state={guess.state}
                                                                match={guess.match}
                                                                char={guess.char}
                                                                celebrate={guess.celebrate}
                                                                shake={guess.shake}
                                                            />
                                                })
                                            }
                                        </div>
                                    )
                                }
                            </div>

                            <div className="keyboard">
                                {
                                    keyRows.map((row, i) => {
                                        return (
                                            <div className="keyrow" key={i}>
                                                {
                                                    row.map((letter, j) => {
                                                        return (
                                                            <div className={((i === 2 && j === 0) || (i === 2 && j === keyRows[2].length - 1)) ? "keyrow" : ""} key={j}>
                                                                { (i === 2 && j === 0) && <button className="key spl-key enter prevent-select" onClick={ submitGuess }>ENTER</button> }
                                                                <button className="key prevent-select" tabIndex="-1" id={`key_${keyRows[i][j].toUpperCase()}`} onMouseDown={(e) => e.preventDefault()} onClick={ () => onScreenCharInput(keyRows[i][j]) }>{letter}</button>
                                                                { (i === 2 && j === keyRows[2].length - 1) && <button className="key spl-key delete prevent-select" onClick={ backspaceOnGuess }><LuDelete /></button> }
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </main>

                        <Footer />

                        {
                            showEndScreen && <GameEndOverlay
                                rows={rows}
                                didUserWin={didUserWin}
                                onClose={() => setShowEndScreen(false)}
                                currentRowIndex={currentRowIndex}
                                answer={answer}
                                restartGameFn={restartGame}
                            />
                        }

                        { showRestartConfirmDialog && <RestartConfirmDialog onClose={() => setShowRestartConfirmDialog(false)} restartGame={restartGame} /> }
                        { showHelpDialog && <HelpDialog onClose={() => setShowHelpDialog(false)} /> }
                        { showSettingsDialog && <SettingsDialog onClose={() => setShowSettingsDialog(false)} max_guesses={MAX_GUESSES} ans_size={ANS_SIZE} setAnsSize={setAnsSizeFromSettings} setMaxGuesses={setMaxGuessesFromSettings} isHardMode={isHardMode} setIsHardMode={setIsHardModeFromSettings} isKeyboardDisabled={isKeyboardDisabled} setIsKeyboardDisabled={setIsKeyboardDisabled} /> }
                        { showCreateDialog && <CreateDialog onClose={() => setShowCreateDialog(false)} /> }
                    </div>
            }
        </>
    );
}

export default App;
