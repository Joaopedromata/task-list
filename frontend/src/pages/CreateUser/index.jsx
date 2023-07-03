import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

function CreateUser() {
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [password2Input, setPassword2Input] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (passwordInput !== password2Input) {
      return setErrorMessage("The passwords don't match");
    }

    setErrorMessage("");

    axios
      .post(import.meta.env.VITE_API_URL + "/create-user", {
        email: emailInput,
        name: nameInput,
        password: passwordInput,
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => setErrorMessage(error.response.data.message));
  }

  return (
    <div className="page-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h4>Crie sua conta</h4>
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
          Nome
          <input
            placeholder="Digite seu nome"
            onChange={(e) => setNameInput(e.target.value)}
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
        <label>
          Repita sua senha
          <input
            type="password"
            placeholder="Digite sua senha novamente"
            onChange={(e) => setPassword2Input(e.target.value)}
          />
          <p className="error-message">{errorMessage}</p>
        </label>
        <Link className="login" to="/">
          Voltar ao login
        </Link>
        <button>Entrar</button>
      </form>
    </div>
  );
}

export default CreateUser;
