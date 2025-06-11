import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../Navbar";
import Swal from "sweetalert2";
import { useAuthStore, useForm } from "../../../hooks";
import "./usuarios.css";

/**
 * UNICO CONTROL DE ERRORES:FALTAN CONTROLAR LOS QUE TRAE EL BACKEND
 */

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
  const { startRegister, errorMessage } = useAuthStore();
  const [formSubmitted, setFormSubmitted] = useState(false); // estado local, para saber si se envio el formulario

  const {
    registerNombre,
    registerApellido,
    registerCelular,
    registerUsuario,
    registerPassword,
    registerTipoUsuario,
    registerEmail,
    onInputChange: onRegisterInputChange,
  } = useForm(registrarUsuario);

  //-----------------------------------------------------------------------------------------------------
  /**
   * IMPLEMENTACION DE CAMPOS CONTROLADOS
   */

  const nombreClass = useMemo(() => {
    if (!formSubmitted) return "";

    return registerNombre.length > 0 ? "" : "is-invalid";
  }, [registerNombre, formSubmitted]);

  const apellidoClass = useMemo(() => {
    if (!formSubmitted) return "";

    return registerApellido.length > 0 ? "" : "is-invalid";
  }, [registerApellido, formSubmitted]);

  const celularClass = useMemo(() => {
    if (!formSubmitted) return "";

    return registerCelular.length > 0 ? "" : "is-invalid";
  }, [registerCelular, formSubmitted]);

  const usuarioClass = useMemo(() => {
    if (!formSubmitted) return "";

    return registerUsuario.length > 0 ? "" : "is-invalid";
  }, [registerUsuario, formSubmitted]);

  const passwordClass = useMemo(() => {
    if (!formSubmitted) return "";

    return registerPassword.length > 0 ? "" : "is-invalid";
  }, [registerPassword, formSubmitted]);

  const emailClass = useMemo(() => {
    if (!formSubmitted) return "";

    return registerEmail.length > 0 ? "" : "is-invalid";
  }, [registerEmail, formSubmitted]);

  const tipoUsuarioClass = useMemo(() => {
    if (!formSubmitted) return "";

    return registerTipoUsuario.length > 0 ? "" : "is-invalid";
  }, [registerTipoUsuario, formSubmitted]);
  //-----------------------------------------------------------------------------------------------------
  /**
   * PARA HACER FOCO EN EL NOMBRE APENAS ABRE FORMULARIO
   */
  useEffect(() => {
    document.getElementById("nombre").focus();
  }, []);
  //-----------------------------------------------------------------------------------------------------
  /**
   * IMPLEMENTACION DE REGISTRO Y MANDO A BACKEND
   */

  const registerSubmit = (event) => {
    event.preventDefault();

    try {
      setFormSubmitted(true);

      if (
        registerNombre.length <= 0 ||
        registerApellido.length <= 0 ||
        registerCelular.length <= 0 ||
        registerUsuario.length <= 0 ||
        registerPassword.length <= 0 ||
        registerEmail.length <= 0 ||
        registerTipoUsuario.length <= 0
      )
        return;

      // Mando al hook.
      startRegister({
        nombre: registerNombre,
        apellido: registerApellido,
        celular: registerCelular,
        user: registerUsuario,
        tipo_usuario: registerTipoUsuario,
        email: registerEmail,
        password: registerPassword,
      });
      Swal.fire("Alta de usuario", "Usuario registrado", "success");
    } catch (error) {
      console.log(error);
    }
  };
  //-----------------------------------------------------------------------------------------------------

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
              onChange={onRegisterInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              className={`form-control ${apellidoClass}`}
              placeholder="Apellido"
              name="registerApellido"
              value={registerApellido}
              onChange={onRegisterInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="number"
              className={`form-control ${celularClass}`}
              placeholder="Celular"
              name="registerCelular"
              value={registerCelular}
              onChange={onRegisterInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="email"
              className={`form-control ${emailClass}`}
              placeholder="Email"
              name="registerEmail"
              value={registerEmail}
              onChange={onRegisterInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              className={`form-control ${usuarioClass}`}
              placeholder="Usuario"
              name="registerUsuario"
              value={registerUsuario}
              onChange={onRegisterInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="password"
              className={`form-control ${passwordClass}`}
              placeholder="Clave"
              name="registerPassword"
              value={registerPassword}
              onChange={onRegisterInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <select
              className={`form-select user ${tipoUsuarioClass}`}
              placeholder="tipo usuario"
              name="registerTipoUsuario"
              value={registerTipoUsuario}
              onChange={onRegisterInputChange}
            >
              <option selected></option>
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
