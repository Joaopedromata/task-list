import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import "./styles.css";

function CreateUser() {
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [password2Input, setPassword2Input] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function handleSubmit(e) {
    setIsLoading(true);
    e.preventDefault();

    if (passwordInput !== password2Input) {
      setIsLoading(false);
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
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(error.response.data.message);
      });
  }

  return (
    <div className="page-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h4>Crie sua conta</h4>
        <label>
          Email
          <Input
            type="email"
            placeholder="Digite seu e-mail"
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <p className="error-message">{errorMessage}</p>
        </label>
        <label>
          Nome
          <Input
            placeholder="Digite seu nome"
            onChange={(e) => setNameInput(e.target.value)}
          />
          <p className="error-message">{errorMessage}</p>
        </label>
        <label>
          Senha
          <Input
            type="password"
            placeholder="Digite sua senha"
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <p className="error-message">{errorMessage}</p>
        </label>
        <label>
          Repita sua senha
          <Input
            type="password"
            placeholder="Digite sua senha novamente"
            onChange={(e) => setPassword2Input(e.target.value)}
          />
          <p className="error-message">{errorMessage}</p>
        </label>
        <Link className="login" to="/">
          Voltar ao login
        </Link>
        <Button>{isLoading ? "Aguarde..." : "Entrar"}</Button>
      </form>
    </div>
  );
}

export default CreateUser;
