import axios from "axios";
import { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    setErrorMessage("");

    axios
      .post("http://localhost:3333/login", {
        email: emailInput,
        password: passwordInput,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);

        navigate("/tasks");
      })
      .catch((error) => setErrorMessage(error.response.data.message));
  }

  return (
    <div className="page-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h4>Faça seu login</h4>
        <label>
          Email
          <input
            type="email"
            placeholder="Digite seu e-mail"
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <p className="error-message">{errorMessage}</p>
        </label>
        <label>
          Senha
          <input
            type="password"
            placeholder="Digite sua senha"
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <p className="error-message">{errorMessage}</p>
        </label>
        <button>Entrar</button>
      </form>
    </div>
  );
}

export default Login;
