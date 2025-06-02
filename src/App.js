import './Styles/App.css';
import './Styles/VirtualKeyboard.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import GuessBox from './Components/GuessBox';
import { useState, useEffect } from 'react';
import { LuDelete } from "react-icons/lu";

function App() {
    // constants
    const keyRows = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["z", "x", "c", "v", "b", "n", "m"]
    ];
    const MAX_GUESSES = 6
    const ANS_SIZE = 5
    const blankGuess = { char: "", state: "idle", celebrate: false, match: "incorrect" };
    // const blankKey = { char: "", state: "idle", match: "incorrect" }

    // state variables
    let [isGameActive, setIsGameActive] = useState(true);
    let [didUserWin, setDidUserWin] = useState(false);
    let [currentRowIndex, setCurrentRowIndex] = useState(0);
    let [answer, setAnswer] = useState("REACH")
    let [currentGuess, setCurrentGuess] = useState([]);
    let [rows, setRows] = useState(Array.from({ length: MAX_GUESSES }, () => Array.from({ length: ANS_SIZE }, () => ({ ...blankGuess }))));
    // let [keys, setKeys] = useState(Array.from({ length: 26 }, () => ({ ...blankKey })))

    function getComment() {
        if (didUserWin) {
            switch (currentRowIndex) {
                case 1: return "Genius";
                case 2: return "Magnificent";
                case 3: return "Impressive";
                case 4: return "Splendid";
                case 5: return "Great";
                case 6: return "Phew";
                default: return "Splendid";
            }
        } else {
            return answer.toUpperCase();
        }
    }

    async function submitGuess() {
        if (!isGameActive) return;
        if (currentGuess.length == ANS_SIZE) {
            for (let i = 0; i < currentGuess.length; i++) {
                let guess = currentGuess[i].toUpperCase();
                let match = "incorrect";
                if (guess == answer[i]) {
                    match = "correct";
                } else if (answer.includes(guess)) {
                    match = "almost-correct";
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

            for (let i = 0; i < currentGuess.length; i++) {
                let guess = currentGuess[i].toUpperCase();
                let virtualKey = document.getElementById(`key_${guess}`);

                let match = "incorrect";
                if (guess == answer[i]) {
                    match = "correct";
                } else if (answer.includes(guess)) {
                    match = "almost-correct";
                }

                if (match == "correct") {
                    virtualKey.classList.remove("almost-correct")
                    virtualKey.classList.add("correct")
                } else if (match == "almost-correct") {
                    if (!virtualKey.classList.contains("correct")) {
                        virtualKey.classList.add("almost-correct")
                    }
                } else {
                    virtualKey.classList.add("incorrect")
                }
            }

            setCurrentRowIndex(prev => prev + 1);

            if (currentGuess.join("").toUpperCase() == answer.toUpperCase()) {
                setIsGameActive(false);
                setDidUserWin(true);

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
            }

            setCurrentGuess([]);

            if (currentRowIndex >= MAX_GUESSES - 1) {
                setIsGameActive(false);
            }
            
        }
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function isChar(key) {
        let code = key.toUpperCase().charCodeAt(0)
        return code >= 65 && code <= 90 && key.length == 1
    }

    function backspaceOnGuess() {
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
    }

    function setCharInput(key) {
        if (!isGameActive) return;
        setCurrentGuess(prev => [...prev, key]);
        setRows(prev => {
            prev[currentRowIndex][currentGuess.length] = {
                char: key.toUpperCase(),
                state: "highlighted",
            };
            return prev;
        });
    }

    function onScreenCharInput(key) {
        if (!isGameActive) return;
        setCharInput(key);
    }

    function handleKeyDown(e) {
        let key = e.key
        if (isChar(key) && currentGuess.length < ANS_SIZE) {
                setCharInput(key);
        } else if (key === 'Enter') {
            submitGuess();
        } else if (key === 'Backspace') {
            backspaceOnGuess();
        }
    }

    useEffect(() => {
        if (!isGameActive) return;
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [currentGuess, currentRowIndex, isGameActive])

    return (
        <div className="App">

            <Navbar />

            {!isGameActive && <span className="comment prevent-select">{getComment()}</span>}

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
                                                <>
                                                    { (i == 2 && j == 0) && <button className="key spl-key enter" onClick={ submitGuess }>ENTER</button> }
                                                    <button className="key" key={j} id={`key_${keyRows[i][j].toUpperCase()}`} onClick={ () => onScreenCharInput(keyRows[i][j]) }>{letter}</button>
                                                    { (i == 2 && j == keyRows[2].length - 1) && <button className="key spl-key delete" onClick={ backspaceOnGuess }><LuDelete /></button> }
                                                </>
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
        </div>
    );
}

export default App;
