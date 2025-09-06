// CSS imports
import '../Styles/App.css';
import '../Styles/VirtualKeyboard.css';

// react and motion imports
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from "motion/react";

// icon imports
import { LuDelete } from "react-icons/lu";

// component imports
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import GuessBox from '../Components/GuessBox';
import Toast from '../Components/Toast';
import GameEndOverlay from '../Components/GameEndOverlay';
import RestartConfirmDialog from '../Components/RestartConfirmDialog';
import HelpDialog from '../Components/HelpDialog';
import SettingsDialog from '../Components/SettingsDialog';
import CreateGameDialog from '../Components/CreateGameDialog';
import LobbyScreen from '../Components/LobbyScreen';

function App() {
    // get answer from parameters
    function decrypt(code) {
        const chars = "AaBbCcDdEeFfGgHhIiJjKlLkMmOnNoPpQqRrSsTtUuVvWwXxYyZz";
        let result = "";
        let shift = code.length;
        let charsLength = chars.length;
        
        for (let char of code) {
            let originalCharCode = chars.indexOf(char) - shift + charsLength;
            let originalChar = String.fromCharCode(originalCharCode);
            result += originalChar;
        }
        return result;
    }

    const isValid = useCallback(async (word) => {
        const knownFalseNegatives = ["TOUCH", "MINTY"];
        const knownFalsePositives = [];
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        try {
            if (knownFalseNegatives.includes(word)) {
                return true;
            }

            if (knownFalsePositives.includes(word)) {
                return false;
            }

            const res = await fetch(url);

            if (res.status === 404) {
                return false;
            }
            if (!res.ok) {
                throw new Error(`Dictionary API error ${res.status}`);
            }

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }, []);

    const navigate = useNavigate();
    const { code } = useParams();
    const [search] = useSearchParams();
    const isCustom = search.get('custom') === 'true';
    const answer = decrypt(code || '').toUpperCase();

    useEffect(() => {
        (async () => {
            const lengthOk = answer.length <= 8;
            const regexOk = isCustom ? true : /^[a-z]+$/i.test(answer);
            const dictOk  =  isCustom ? true : await isValid(answer);

            if (!answer || !lengthOk || !regexOk || !dictOk) {
            navigate("/", { replace: true });
            }
        })();
    }, [answer]);

    // define constants
    const keyRows = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["z", "x", "c", "v", "b", "n", "m"]
    ];
    const blankGuess = { char: "", state: "idle", celebrate: false, match: "incorrect", shake: false };
    // const blankKey = { char: "", state: "idle", match: "incorrect" };

    // state variables
    let [MAX_GUESSES, setMaxGuesses] = useState(6);
    let [ANS_SIZE, setAnsSize] = useState(answer.length || 5);
    let [isGameActive, setIsGameActive] = useState(false);
    let [didUserWin, setDidUserWin] = useState(false);
    let [currentRowIndex, setCurrentRowIndex] = useState(0);
    let [currentGuess, setCurrentGuess] = useState([]);
    let [rows, setRows] = useState(Array.from({ length: MAX_GUESSES }, () => Array.from({ length: ANS_SIZE }, () => ({ ...blankGuess }))));
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
    let [showCreateGameDialog, setShowCreateGameDialog] = useState(false);
    let [isAnimating, setIsAnimating] = useState(false); 
    // let [keys, setKeys] = useState(Array.from({ length: 26 }, () => ({ ...blankKey })))
    let enteredWords = useRef(new Map());
    
    const submitGuess = useCallback(async () => {
        function patchCurrentRow(patchFn) {
            setRows(prev => {
                const next = prev.map((r, idx) => (idx === currentRowIndex ? [...r] : r));
                next[currentRowIndex] = next[currentRowIndex].map(patchFn);
                return next;
            });
        }

        if (isAnimating) return;
        if (!isGameActive || currentGuess.length !== ANS_SIZE) return;

        setIsAnimating(true);
        let inputWord = currentGuess.join("").toUpperCase();
        if (inputWord !== answer) {
            let isWordValid = enteredWords.current.get(inputWord);
            if (isWordValid === undefined) {
                isWordValid = await isValid(inputWord);
                enteredWords.current.set(inputWord, isWordValid);
            }

            if (!isWordValid) {
                setToastType("word-dne");
                patchCurrentRow(cell => ({ ...cell, state: "highlighted-no-bounce", shake: true }));
                await sleep(500);
                patchCurrentRow(cell => ({ ...cell, shake: false }));
                setIsAnimating(false);

                return;
            }
        }

        if (isHardMode) {
            for (let guess of guessedLetters) {
                let guessedChar = guess["char"];
                let guessedMatch = guess["match"];
                let guessedPosition = guess["position"];

                if (guessedMatch === "incorrect") continue;

                let moveInvalid = false;

                if (!currentGuess.includes(guessedChar)) {
                    setToastType(`hardModeInclude_${guessedChar}`);
                    moveInvalid = true;
                }

                if (guessedMatch === "correct") {
                    let currentLetter = currentGuess[guessedPosition];
                    if (currentLetter !== guessedChar) {
                        setToastType(`hardModePosition_${guessedChar}_${guessedPosition + 1}`);
                        moveInvalid = true;
                    }
                }

                if (moveInvalid) {
                    patchCurrentRow(cell => ({ ...cell, state: "highlighted-no-bounce", shake: true }));
                    await sleep(500);
                    patchCurrentRow(cell => ({ ...cell, shake: false }));
                    setIsAnimating(false);

                    return;
                }
            }
        }
        
        const matchesArray = new Array(ANS_SIZE).fill("incorrect")
        const answerCounts = {};

        for (const letter of answer.split('')) {
            if (answerCounts[letter]) {
                answerCounts[letter]++;
            } else {
                answerCounts[letter] = 1
            }
        }

        for (let i = 0; i < ANS_SIZE; i++) {
            let guess = currentGuess[i].toUpperCase();
            if (guess === answer[i]) {
                matchesArray[i] = "correct";
                answerCounts[guess]--;
            }
        }

        for (let i = 0; i < ANS_SIZE; i++) {
            let guess = currentGuess[i].toUpperCase();
            if (matchesArray[i] === "correct") {
                continue
            }

            // let guessCount = currentGuess.filter(g => g.toUpperCase() === guess).length;
            // let correctGuessCount = matchesArray.filter(g => g.toUpperCase() === guess).length;
            // let answerCount = answer.split("").filter(c => c === guess).length;

            if ((answerCounts[guess] ? answerCounts[guess] : 0) <= 0) {
                continue
            }
            matchesArray[i] = "almost-correct";
            answerCounts[guess]--;
        }

        for (let i = 0; i < ANS_SIZE; i++) {
            let guess = currentGuess[i].toUpperCase();
            let match = matchesArray[i];

            setGuessedLetters(prev => {
                const letterIndex = prev.findIndex(entry => entry.char === guess);
                let guessedLettersEntry = {"char": guess, "match": match, "position": i};

                if (letterIndex === -1) {
                    return [...prev, guessedLettersEntry];
                }

                if (prev[letterIndex].match === "almost-correct" && match === "correct") {
                    let updated = prev.slice();
                    updated[letterIndex] = { char: guess, match, position: i };
                    return updated;
                }

                return prev;
            });

            // if (!guessedLetters.some(entry => entry.char === guess) || (guessedLetters.some(entry => entry.char === guess && entry.match === "almost-correct") && match === "correct")) {
            //     let guessedLettersEntry = {"char": guess, "match": match, "position": i};
            //     setGuessedLetters(prev => [...prev, guessedLettersEntry]);
            // }

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

        setCurrentRowIndex(prev => {
            const next = prev + 1;
            setUpdateKeyboard(true);
            setIsAnimating(false);
            return next;
        });

        if (inputWord === answer) {
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
    }, [currentGuess, currentRowIndex, guessedLetters, ANS_SIZE, isHardMode, isAnimating, isGameActive, MAX_GUESSES, answer, isValid]);

    const setCharInput = useCallback((key) => {
        if (!isGameActive || currentGuess.length >= ANS_SIZE) return;
        
        setCurrentGuess(prev => [...prev, key.toUpperCase()]);
        setRows(prev => {
            const next = prev.slice();
            next[currentRowIndex][currentGuess.length] = {
                char: key.toUpperCase(),
                state: "highlighted",
            };
            return next;
        });
    }, [currentRowIndex, currentGuess, isGameActive, ANS_SIZE]);

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
        navigate("/", {replace: true});
    }
    
    function isChar(key) {
        let code = key.toUpperCase().charCodeAt(0)
        return code >= 65 && code <= 90 && key.length === 1
    }

    const backspaceOnGuess = useCallback(() => {
        if (!isGameActive) return;
        if (currentGuess.length >= 1) {
            setRows(prev => {
                const next = prev.slice();
                next[currentRowIndex][currentGuess.length - 1] = {
                    char: ""
                };
                return next;
            });
            setCurrentGuess(prev => prev.slice(0, -1));
        }
    }, [isGameActive, currentGuess, currentRowIndex]);

    useEffect(() => {
        if (showLobbyScreen) return;
        if (!isGameActive) {
            setToastType("unavailablePast0");
            return;
        }

        // if word length changed, refresh
        const maxGuessesChanged = MAX_GUESSES !== rows.length;
        if (!maxGuessesChanged) navigate(`/new?length=${ANS_SIZE}`, { replace: true });
        
        // else, clear board
        const blankGuess = { char: "", state: "idle", celebrate: false, match: "incorrect", shake: false };
        setRows(Array.from({ length: MAX_GUESSES }, () =>
            Array.from({ length: ANS_SIZE }, () => ({ ...blankGuess }))
        ));

        setCurrentGuess([]);
        setCurrentRowIndex(0);
        setGuessedLetters([]);
        setDidUserWin(false);
        setIsGameActive(true);
        enteredWords.current.clear();
    }, [ANS_SIZE, MAX_GUESSES]);

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
        function handleKeyDown(e) {
            if (isAnimating) return;
            if (e.repeat) return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            let key = e.key
            if (isChar(key) && currentGuess.length < ANS_SIZE && !showCreateGameDialog) {
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
    }, [currentGuess, showCreateGameDialog, currentRowIndex, isGameActive,  isKeyboardDisabled, ANS_SIZE, isAnimating, backspaceOnGuess, setCharInput, submitGuess])

    return (
        <>  
            <div className="App">
                <Navbar
                    statsBtnFn={() => setShowEndScreen(true)}
                    restartBtnFn={() => setShowRestartConfirmDialog(true)}
                    helpBtnFn={() => setShowHelpDialog(true)}
                    settingsBtnFn={() => setShowSettingsDialog(true)}
                    createBtnFn={() => setShowCreateGameDialog(true)}
                    isGameActive={isGameActive}
                    didUserWin={didUserWin}
                    disableRestart={isAnimating || (currentRowIndex === 0)}
                />

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
                                                        ansSize={ANS_SIZE}
                                                        maxGuesses={MAX_GUESSES}
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
                                                        { (i === 2 && j === 0) && <button className="key spl-key enter prevent-select" disabled={isAnimating} onClick={ submitGuess }>ENTER</button> }
                                                        <button className="key prevent-select" tabIndex="-1" id={`key_${keyRows[i][j].toUpperCase()}`} onMouseDown={(e) => e.preventDefault()} onClick={ () => onScreenCharInput(keyRows[i][j]) }>{letter}</button>
                                                        { (i === 2 && j === keyRows[2].length - 1) && <button className="key spl-key delete prevent-select" disabled={isAnimating} onClick={ backspaceOnGuess }><LuDelete /></button> }
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
                
                {/* Animated overlays */}
                <AnimatePresence>
                    {
                        showEndScreen && <GameEndOverlay
                            rows={rows}
                            didUserWin={didUserWin}
                            onClose={() => setShowEndScreen(false)}
                            currentRowIndex={currentRowIndex}
                            code={code}
                            isCustom = {isCustom}
                            restartGameFn={restartGame}
                            setToastType={setToastType}
                            key="end"
                        />
                    }

                    {
                        showRestartConfirmDialog && <RestartConfirmDialog
                            key="restart"
                            onClose={() => setShowRestartConfirmDialog(false)}
                            restartGame={restartGame}
                        />
                    }

                    {
                        showHelpDialog && <HelpDialog
                            key="help"
                            onClose={() => setShowHelpDialog(false)}
                            MAX_GUESSES={MAX_GUESSES}
                            ANS_LENGTH={ANS_SIZE}
                        />
                    }

                    {
                        showSettingsDialog && <SettingsDialog
                            key="settings"
                            onClose={() => setShowSettingsDialog(false)}
                            max_guesses={MAX_GUESSES}
                            ans_size={ANS_SIZE}
                            setAnsSize={setAnsSizeFromSettings}
                            setMaxGuesses={setMaxGuessesFromSettings}
                            isHardMode={isHardMode}
                            setIsHardMode={setIsHardModeFromSettings}
                            isKeyboardDisabled={isKeyboardDisabled}
                            setIsKeyboardDisabled={setIsKeyboardDisabled}
                        />
                    }

                    {
                        showLobbyScreen && <LobbyScreen
                            key="lobby"
                            setShowCreateGameDialog={setShowCreateGameDialog}
                            setShowLobbyScreen={() => setShowLobbyScreen(false)}
                            setIsGameActive={() => setIsGameActive(true)}
                            setToastType={setToastType}
                            code={code}
                            isCustom={isCustom}
                            MAX_GUESSES={MAX_GUESSES}
                            ANS_LENGTH={ANS_SIZE}
                        />
                    }

                    {
                        showCreateGameDialog && <CreateGameDialog
                            key="create"
                            onClose={() => setShowCreateGameDialog(false)}
                            setToastType={setToastType}
                            showLobbyScreen={showLobbyScreen}
                        />
                    }

                    {toastType &&
                        <Toast
                            type={toastType}
                            answer={answer}
                            currentRowIndex={currentRowIndex}
                            onClose={() => setToastType(null)}
                        />
                    }
                </AnimatePresence>
            </div>
        </>
    );
}

export default App;
