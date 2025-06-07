import '../Styles/WordleLogo.css';

function WordleLogo() {
    return (
        <div className="logo">
            <div className="y0 row">
                <div className="x0 square"></div>
                <div className="x1 square"></div>
                <div className="x2 square"></div>
            </div>
            <div className="y1 row">
                <div className="x0 square"></div>
                <div className="x1 square"></div>
                <div className="x2 square"></div>
            </div>
            <div className="y2 row">
                <div className="x0 square"></div>
                <div className="x1 square"></div>
                <div className="x2 square"></div>
            </div>
        </div>
    );
}

export default WordleLogo;