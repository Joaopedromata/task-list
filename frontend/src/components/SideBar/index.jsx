import "./styles.css";
import board from "../../assets/board.svg";
import money from "../../assets/money.svg";
import logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import logout from "../../assets/log-out.svg";

const SideBar = () => {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="side-bar">
      <img src={logo} className="logo" onClick={() => navigate("/boards")} />
      <div className="side-bar-list-top">
        <Link className="side-bar-list-item" to="/boards">
          <img src={board} />
          Quadros
        </Link>
        <Link className="side-bar-list-item">
          <img src={money} />
          Financeiro
        </Link>
      </div>
      <hr className="side-bar-separator" />
      <div className="side-bar-list-bottom">
        <div className="side-bar-list-item" onClick={handleLogout}>
          <img src={logout} />
          Sair
        </div>
      </div>
    </div>
  );
};

export default SideBar;
