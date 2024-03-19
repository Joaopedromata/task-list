import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import arrowLeft from "../../assets/arrow-left.svg";
import menu from "../../assets/menu.svg";
import { useState } from "react";
import x from "../../assets/x.svg";

function Header(props) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <header className="header">
      {showMenu && (
        <div className="header-menu">
          <Link className="header-menu-list-item" to="/boards">
            Quadros
          </Link>
          <Link className="header-menu-list-item">Financeiro</Link>
          <Link className="header-menu-list-item" to="/habits">
            Hábitos
          </Link>
          <div className="header-menu-list-item" onClick={handleLogout}>
            Sair
          </div>
          <div
            className="header-menu-list-item"
            onClick={() => setShowMenu(false)}
          >
            <img src={x} />
          </div>
        </div>
      )}
      <img
        src={menu}
        onClick={() => setShowMenu(true)}
        className="header-icon menu"
      />
      {props.backTo ? (
        <img
          src={arrowLeft}
          onClick={() => navigate(props.backTo)}
          className="header-icon back"
        />
      ) : (
        <div className="fake-div" />
      )}
      <h1 className="header-title">{props.title}</h1>
      <div />
    </header>
  );
}

export default Header;
