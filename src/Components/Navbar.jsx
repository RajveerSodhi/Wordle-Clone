import '../Styles/Navbar.css';
import { BiBarChartAlt2 } from "react-icons/bi";
import { FaRedo, FaPlus } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { BsLightbulb } from "react-icons/bs";

function Navbar({ hintBtnFn, statsBtnFn, restartBtnFn, helpBtnFn, settingsBtnFn, createBtnFn, isGameActive, disableRestart }) {
    return(
        <nav>
            <h1 className="title prevent-select">Wordle</h1>
            <span className="nav-elements">
                <button className="nav-btn" disabled={isGameActive} tabIndex="-1" onMouseDown={(e) => e.preventDefault()} onClick={() => !isGameActive && statsBtnFn()}><BiBarChartAlt2 className="stats-btn" /></button>
                <button className="nav-btn" disabled={disableRestart} tabIndex="-1" onMouseDown={(e) => e.preventDefault()} onClick={() => restartBtnFn()}><FaRedo className="restart-btn" /></button>
                {/* <button className="nav-btn" tabIndex="-1" onMouseDown={(e) => e.preventDefault()} onClick={() => hintBtnFn()}><BsLightbulb className="hint-btn" /></button> */}
                <button className="nav-btn" tabIndex="-1" onMouseDown={(e) => e.preventDefault()} onClick={() => helpBtnFn()}><IoMdHelpCircleOutline className="help-btn" /></button>
                <button className="nav-btn" tabIndex="-1" onMouseDown={(e) => e.preventDefault()} onClick={() => settingsBtnFn()}><IoSettingsSharp className="settings-btn" /></button>
                <button className="nav-btn" tabIndex="-1" onMouseDown={(e) => e.preventDefault()} onClick={() => createBtnFn()}><FaPlus className="create-btn" /></button>
            </span>
        </nav>
    );
}

export default Navbar;