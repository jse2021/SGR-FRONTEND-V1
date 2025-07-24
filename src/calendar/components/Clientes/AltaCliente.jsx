import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../Navbar";
import "./clientes.css";
import { useClienteStore } from "../../../hooks/useClienteStore";
import { useForm } from "../../../hooks";
import Swal from "sweetalert2";

const registrarCliente = {
  registerDni: "",
  registerNombre: "",
  registerApellido: "",
  registerEmail: "",
  registerCelular: "",
};

export const AltaCliente = () => {
  const { startRegister } = useClienteStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { formState, onInputChange, onResetForm } = useForm(registrarCliente);

  const {
    registerDni,
    registerNombre,
    registerApellido,
    registerEmail,
    registerCelular,
  } = formState;

  const dniClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerDni.trim() !== "" ? "" : "is-invalid";
  }, [registerDni, formSubmitted]);

  const nombreClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerNombre.trim() !== "" ? "" : "is-invalid";
  }, [registerNombre, formSubmitted]);

  const apellidoClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerApellido.trim() !== "" ? "" : "is-invalid";
  }, [registerApellido, formSubmitted]);

  const emailClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerEmail.trim() !== "" ? "" : "is-invalid";
  }, [registerEmail, formSubmitted]);

  const celularClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerCelular.trim() !== "" ? "" : "is-invalid";
  }, [registerCelular, formSubmitted]);

  useEffect(() => {
    document.getElementById("dni")?.focus();
  }, []);

  const registerSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    // Mando al hook.
    if (
      registerDni.trim() === "" ||
      registerNombre.trim() === "" ||
      registerApellido.trim() === "" ||
      registerEmail.trim() === "" ||
      registerCelular.trim() === ""
    )
      return;

    const result = await startRegister({
      dni: registerDni,
      nombre: registerNombre,
      apellido: registerApellido,
      email: registerEmail,
      celular: registerCelular,
    });

    if (!result.ok) {
      await Swal.fire("Atención", result.msg, "warning");
      onResetForm();
      setFormSubmitted(false);
      return;
    }
    await Swal.fire("Alta Cliente", "Cliente registrado", "success");
    onResetForm();
    setFormSubmitted(false);
    document.getElementById("dni")?.focus();
  };

  return (
    <>
      <Navbar />
      <h1 className="text-center my-4 mt-5">Alta Cliente</h1>
      {/* <div className="col-md-6 login-form-2"> */}
      <div className="col-md-8 login-form-3 mx-auto">
        <form onSubmit={registerSubmit} id="formAltaCliente">
          <div className="form-group mb-2">
            <input
              id="dni"
              type="text"
              className={`form-control ${dniClass}`}
              placeholder="Dni"
              name="registerDni"
              value={registerDni}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
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
              id="email"
              type="Email"
              className={`form-control ${emailClass}`}
              placeholder="Email"
              name="registerEmail"
              value={registerEmail}
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
          <div className="d-grid gap-2">
            <input type="submit" className="btnSubmit" value="Guardar" />
          </div>
        </form>
      </div>
    </>
  );
};
export default AltaCliente;
