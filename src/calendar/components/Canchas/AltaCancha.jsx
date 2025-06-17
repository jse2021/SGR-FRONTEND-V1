import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../Navbar";
import "./canchas.css";
import { useCanchaStore } from "../../../hooks/useCanchaStore";
import { useForm } from "../../../hooks";
import Swal from "sweetalert2";

const registrarCancha = {
  registerNombre: "",
  registerMedidas: "",
};

export const AltaCancha = () => {
  const { startRegister } = useCanchaStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { formState, onInputChange, onResetForm } = useForm(registrarCancha);
  const { registerNombre, registerMedidas } = formState;

  const nombreClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerNombre.trim() !== "" ? "" : "is-invalid";
  }, [registerNombre, formSubmitted]);

  const medidasClass = useMemo(() => {
    if (!formSubmitted) return "";
    return registerMedidas.trim() !== "" ? "" : "is-invalid";
  }, [registerMedidas, formSubmitted]);

  const registerSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (registerNombre.trim() === "" || registerMedidas.trim() === "") return;

    const result = await startRegister({
      nombre: registerNombre,
      medidas: registerMedidas,
    });

    if (!result.ok) {
      await Swal.fire("Atención", result.msg, "warning");
      onResetForm();
      setFormSubmitted(false);
      return;
    }
    await Swal.fire("Alta Cancha", "Cancha registrada", "success");
    onResetForm();
    setFormSubmitted(false);
    document.getElementById("registerNombre")?.focus();
  };
  return (
    <>
      <Navbar />
      <h1 className="display-5">Gestión Canchas</h1>
      <div className="col-md-6 login-form-2">
        <form onSubmit={registerSubmit} id="formAltaCancha">
          <div className="form-group mb-2">
            <input
              type="text"
              className={`form-control ${nombreClass}`}
              placeholder="Nombre de la cancha"
              name="registerNombre"
              value={registerNombre}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              className={`form-control ${medidasClass}`}
              placeholder="Medidas"
              name="registerMedidas"
              value={registerMedidas}
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
export default AltaCancha;
