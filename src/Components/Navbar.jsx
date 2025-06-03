import '../Styles/Navbar.css';
import { BiBarChartAlt2 } from "react-icons/bi";
import { FaRedo, FaPlus } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";

function Navbar({ statsBtnFn, restartBtnFn, helpBtnFn, settingsBtnFn, createBtnFn, isGameActive }) {
    return(
        <nav>
            <h1 className="title prevent-select">Wordle</h1>
            <span className="nav-elements">
                <button className="nav-btn" onClick={() => !isGameActive && statsBtnFn()}><BiBarChartAlt2 className="stats-btn" /></button>
                <button className="nav-btn" onClick={() => restartBtnFn()}><FaRedo className="restart-btn" /></button>
                {/* <button className="nav-btn" onClick={() => helpBtnFn()}><IoMdHelpCircleOutline className="help-btn" /></button>
                <button className="nav-btn" onClick={() => settingsBtnFn()}><IoSettingsSharp className="settings-btn" /></button>
                <button className="nav-btn" onClick={() => createBtnFn()}><FaPlus className="create-btn" /></button> */}
            </span>
        </nav>
    );
}

export default Navbar;