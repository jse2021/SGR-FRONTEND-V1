import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../Navbar";
import Swal from "sweetalert2";
import { useAuthStore, useForm } from "../../../hooks";
import "./usuarios.css";
import { logFrontendError } from "../../../utils/logError";

const registrarUsuario = {
  registerNombre: "",
  registerApellido: "",
  registerCelular: "",
  registerUsuario: "",
  registerTipoUsuario: "",
  registerEmail: "",
  registerPassword: "",
};

export const AltaUsuario = () => {
  const { startRegister } = useAuthStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { formState, onInputChange, onResetForm } = useForm(registrarUsuario);

  const {
    registerNombre,
    registerApellido,
    registerCelular,
    registerUsuario,
    registerTipoUsuario,
    registerEmail,
    registerPassword,
  } = formState;

  const nombreClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerNombre.trim() !== "" ? "" : "is-invalid";
  }, [registerNombre, formSubmitted]);

  const apellidoClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerApellido.trim() !== "" ? "" : "is-invalid";
  }, [registerApellido, formSubmitted]);

  const celularClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerCelular.trim() !== "" ? "" : "is-invalid";
  }, [registerCelular, formSubmitted]);

  const usuarioClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerUsuario.trim() !== "" ? "" : "is-invalid";
  }, [registerUsuario, formSubmitted]);

  const passwordClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerPassword.trim() !== "" ? "" : "is-invalid";
  }, [registerPassword, formSubmitted]);

  const emailClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerEmail.trim() !== "" ? "" : "is-invalid";
  }, [registerEmail, formSubmitted]);

  const tipoUsuarioClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerTipoUsuario.trim() !== "" ? "" : "is-invalid";
  }, [registerTipoUsuario, formSubmitted]);

  useEffect(() => {
    document.getElementById("nombre")?.focus();
  }, []);

  const registerSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    // Validación básica
    if (
      registerNombre.trim() === "" ||
      registerApellido.trim() === "" ||
      registerCelular.trim() === "" ||
      registerUsuario.trim() === "" ||
      registerPassword.trim() === "" ||
      registerEmail.trim() === "" ||
      registerTipoUsuario.trim() === ""
    )
      return;

    const result = await startRegister({
      nombre: registerNombre,
      apellido: registerApellido,
      celular: registerCelular,
      user: registerUsuario,
      tipo_usuario: registerTipoUsuario,
      email: registerEmail,
      password: registerPassword,
    });

    if (!result.ok) {
      await Swal.fire("Atención", result.msg, "warning");

      onResetForm();
      setFormSubmitted(false);
      return;
    }

    await Swal.fire("Alta de usuario", "Usuario registrado", "success");
    onResetForm();
    setFormSubmitted(false);
    document.getElementById("nombre")?.focus();
  };

  return (
    <>
      <Navbar />
      <h1 className="display-5">Gestión Usuarios</h1>
      <div className="col-md-6 login-form-2">
        <form onSubmit={registerSubmit} id="formAltaCUsuario">
          <div className="form-group mb-2">
            <input
              type="text"
              id="nombre"
              className={`form-control ${nombreClass}`}
              placeholder="Nombre"
              name="registerNombre"
              value={registerNombre}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              className={`form-control ${apellidoClass}`}
              placeholder="Apellido"
              name="registerApellido"
              value={registerApellido}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="number"
              className={`form-control ${celularClass}`}
              placeholder="Celular"
              name="registerCelular"
              value={registerCelular}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="email"
              className={`form-control ${emailClass}`}
              placeholder="Email"
              name="registerEmail"
              value={registerEmail}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              className={`form-control ${usuarioClass}`}
              placeholder="Usuario"
              name="registerUsuario"
              value={registerUsuario}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="password"
              className={`form-control ${passwordClass}`}
              placeholder="Clave"
              name="registerPassword"
              value={registerPassword}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <select
              className={`form-select user ${tipoUsuarioClass}`}
              name="registerTipoUsuario"
              value={registerTipoUsuario}
              onChange={onInputChange}
            >
              <option value="">Seleccione tipo usuario</option>
              <option value="Administrador">Administrador</option>
              <option value="Estandar">Estandar</option>
            </select>
          </div>
          <div className="d-grid gap-2">
            <input type="submit" className="btnSubmitUsuario" value="Guardar" />
          </div>
        </form>
      </div>
    </>
  );
};

export default AltaUsuario;
