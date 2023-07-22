import "./styles.css";
import { useNavigate } from "react-router-dom";

function Header(props) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <header className="header">
      <h1 className="header-title">{props.title}</h1>
      <h3 className="header-logout" onClick={handleLogout}>
        logout
      </h3>
    </header>
  );
}

export default Header;
