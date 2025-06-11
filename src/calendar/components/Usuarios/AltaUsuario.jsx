import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../Navbar";
import Swal from "sweetalert2";
import { useAuthStore, useForm } from "../../../hooks";
import "./usuarios.css";
import { useRef } from "react";

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
  const [key, setKey] = useState(0); // NO dejarlo undefined
  const formRef = useRef(null);
  const { formState, onInputChange, onResetForm } = useForm(registrarUsuario);

  const nombreClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formState.registerNombre.length > 0 ? "" : "is-invalid";
  }, [formState.registerNombre, formSubmitted]);

  const apellidoClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formState.registerApellido.length > 0 ? "" : "is-invalid";
  }, [formState.registerApellido, formSubmitted]);

  const celularClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formState.registerCelular.length > 0 ? "" : "is-invalid";
  }, [formState.registerCelular, formSubmitted]);

  const usuarioClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formState.registerUsuario.length > 0 ? "" : "is-invalid";
  }, [formState.registerUsuario, formSubmitted]);

  const passwordClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formState.registerPassword.length > 0 ? "" : "is-invalid";
  }, [formState.registerPassword, formSubmitted]);

  const emailClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formState.registerEmail.length > 0 ? "" : "is-invalid";
  }, [formState.registerEmail, formSubmitted]);

  const tipoUsuarioClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formState.registerTipoUsuario.length > 0 ? "" : "is-invalid";
  }, [formState.registerTipoUsuario, formSubmitted]);

  useEffect(() => {
    document.getElementById("nombre").focus();
  }, []);

  const registerSubmit = async (event) => {
    event.preventDefault();
    console.log("🚀 Enviando formulario...");
    setFormSubmitted(true);

    // Validaciones
    if (
      formState.registerNombre.length <= 0 ||
      formState.registerApellido.length <= 0 ||
      formState.registerCelular.length <= 0 ||
      formState.registerUsuario.length <= 0 ||
      formState.registerPassword.length <= 0 ||
      formState.registerEmail.length <= 0 ||
      formState.registerTipoUsuario.length <= 0
    ) {
      console.log("⛔ Formulario inválido");
      return;
    }

    // Envío
    const result = await startRegister({
      nombre: formState.registerNombre,
      apellido: formState.registerApellido,
      celular: formState.registerCelular,
      user: formState.registerUsuario,
      tipo_usuario: formState.registerTipoUsuario,
      email: formState.registerEmail,
      password: formState.registerPassword,
    });

    console.log("📥 Resultado backend:", result);

    if (!result.ok) {
      await Swal.fire("Atención", result.msg, "warning");
      setKey(Date.now()); // 🔁 fuerza el form a reconstruirse
      setFormSubmitted(false);
      return;
    }

    await Swal.fire("Alta de usuario", "Usuario registrado", "success");

    setFormSubmitted(false);
    setKey((prev) => prev + 1);
  };

  return (
    <>
      <Navbar />
      <h1 className="display-5">Gestión Usuarios</h1>
      <div className="col-md-6 login-form-2">
        <form key={key} onSubmit={registerSubmit}>
          <div className="form-group mb-2">
            <input
              type="text"
              id="nombre"
              className={`form-control ${nombreClass}`}
              placeholder="Nombre"
              name="registerNombre"
              value={formState.registerNombre}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              className={`form-control ${apellidoClass}`}
              placeholder="Apellido"
              name="registerApellido"
              value={formState.registerApellido}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="number"
              className={`form-control ${celularClass}`}
              placeholder="Celular"
              name="registerCelular"
              value={formState.registerCelular}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="email"
              className={`form-control ${emailClass}`}
              placeholder="Email"
              name="registerEmail"
              value={formState.registerEmail}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              className={`form-control ${usuarioClass}`}
              placeholder="Usuario"
              name="registerUsuario"
              value={formState.registerUsuario}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="password"
              className={`form-control ${passwordClass}`}
              placeholder="Clave"
              name="registerPassword"
              value={formState.registerPassword}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <select
              className={`form-select user ${tipoUsuarioClass}`}
              placeholder="tipo usuario"
              name="registerTipoUsuario"
              value={formState.registerTipoUsuario}
              onChange={onInputChange}
            >
              <option value=""></option>
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
