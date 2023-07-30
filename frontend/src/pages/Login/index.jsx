import { useEffect, useState } from "react";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import api from "../../services/api";

function Login() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/tasks");
    }
  }, []);

  function handleSubmit(e) {
    setIsLoading(true);
    e.preventDefault();

    setErrorMessage("");

    api
      .post("/login", {
        email: emailInput,
        password: passwordInput,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        navigate("/tasks");
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(error.response.data.message);
      });
  }

  return (
    <div className="page-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h4>Faça seu login</h4>
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
          Senha
          <Input
            type="password"
            placeholder="Digite sua senha"
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <p className="error-message">{errorMessage}</p>
        </label>
        <Link className="create-user" to="/create-user">
          Criar conta
        </Link>
        <Button>{isLoading ? "Aguarde..." : "Entrar"}</Button>
      </form>
    </div>
  );
}

export default Login;
