import "./styles.css";
import board from "../../assets/board.svg";
import money from "../../assets/money.svg";
import logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  return (
    <div className="side-bar">
      <img src={logo} className="logo" onClick={() => navigate("/boards")} />
      <div className="side-bar-list">
        <Link className="side-bar-list-item" to="/boards">
          <img src={board} />
          Quadros
        </Link>
        <Link className="side-bar-list-item">
          <img src={money} />
          Financeiro
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
