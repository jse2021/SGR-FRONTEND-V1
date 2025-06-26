import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuthStore, useForm } from "../../hooks";
import "./LoginPage.css";

const loginFormFields = {
  loginUser: "",
  loginPassword: "",
};

export const LoginPage = () => {
  const { startLogin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    loginUser,
    loginPassword,
    onInputChange: onLoginInputChange,
  } = useForm(loginFormFields);

  const loginSubmit = async (event) => {
    event.preventDefault();
    if (loginUser.trim() === "" || loginPassword.trim() === "") {
      Swal.fire("Atención", "Usuario o Clave no ingresados", "warning");
      return;
    }

    setIsLoading(true);
    const result = await startLogin({
      user: loginUser,
      password: loginPassword,
    });
    setIsLoading(false);

    if (!result.ok) {
      Swal.fire("Atención", result.msg, "warning");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Sistema de Reservas</h1>
        <form onSubmit={loginSubmit} className="login-form">
          <input
            type="text"
            placeholder="Usuario"
            name="loginUser"
            className="login-input"
            value={loginUser}
            onChange={onLoginInputChange}
          />
          <input
            type="password"
            placeholder="Contraseña"
            name="loginPassword"
            className="login-input"
            value={loginPassword}
            onChange={onLoginInputChange}
          />
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
};
