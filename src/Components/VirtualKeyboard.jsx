function VirtualKeyboard() {
    const keyRows = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["z", "x", "c", "v", "b", "n", "m"]
    ];

    return (
        <div className="keyboard">
            {
                keyRows.map((row, i) => {
                    return (
                        <div className="keyrow" key={i}>
                            {
                                row.map((letter, j) => {
                                    return (
                                        <button className="key" key={j}>{letter}</button>
                                    );
                                })
                            }
                        </div>
                    );
                })
            }
        </div>
    );
}

export default VirtualKeyboard;