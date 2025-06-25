import { useEffect } from "react";
import Swal from "sweetalert2";
import { useAuthStore, useForm } from "../../hooks";
import "./LoginPage.css";

const loginFormFields = {
  loginUser: "",
  loginPassword: "",
};

export const LoginPage = () => {
  const { startLogin, errorMessage } = useAuthStore();

  const {
    loginUser,
    loginPassword,
    onInputChange: onLoginInputChange,
  } = useForm(loginFormFields);

  const loginSubmit = async (event) => {
    event.preventDefault();
    if (loginUser.trim() == "" || loginPassword.trim() == "") {
      await Swal.fire("Atención", "Usuario o Clave no ingresados", "warning");
      return;
    }

    const result = await startLogin({
      user: loginUser,
      password: loginPassword,
    });
    if (!result.ok) {
      await Swal.fire("Atención", result.msg, "warning");
    }
  };

  return (
    <div className="container login-container">
      <h1 className="display-1">Sistema de Gestión de Reservas</h1>
      <div className="row">
        <div className="col-md-6 login-form-1">
          <h3>Acceder</h3>
          <form onSubmit={loginSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                id="input-user"
                placeholder="Tu Usuario"
                name="loginUser"
                value={loginUser}
                onChange={onLoginInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Tu Clave"
                name="loginPassword"
                value={loginPassword}
                onChange={onLoginInputChange}
              />
            </div>
            <div className="d-grid gap-2">
              <input type="submit" className="btnSubmit" value="Ingresar" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
