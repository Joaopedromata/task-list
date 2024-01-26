import "./styles.css";
import { useNavigate } from "react-router-dom";
import logout from "../../assets/log-out.svg";
import arrowLeft from "../../assets/arrow-left.svg";

function Header(props) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <header className="header">
      {props.backTo ? (
        <img
          src={arrowLeft}
          onClick={() => navigate(props.backTo)}
          className="header-icon"
        />
      ) : (
        <div />
      )}
      <h1 className="header-title">{props.title}</h1>
      <img src={logout} onClick={handleLogout} className="header-icon" />
    </header>
  );
}

export default Header;
