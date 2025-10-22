import React, { useMemo } from "react";
import { Navbar } from "../Navbar";
import "./precios.css";
import { useState } from "react";
import { calendarApi } from "../../../api";
import { useEffect } from "react";
import { useConfiguracionStore } from "../../../hooks/useConfiguracionStore";
import { useForm } from "../../../hooks";
import Swal from "sweetalert2";
import { id } from "date-fns/locale";

const registrarMontos = {
  registerNombre: "",
  registerPrecio: "",
  registerSena: "",
};

export const PrecioCancha = () => {
  const [canchasConPrecios, setCanchasConPrecios] = useState([]);
  const { startRegister, error } = useConfiguracionStore();
  const [canchas, setCanchas] = useState([]);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState("");
  const [precioCancha, setPrecioCancha] = useState("");
  const [precioSena, setPrecioSena] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [registerNombre, setRegisterNombre] = useState("");
  const [canchaTienePrecio, setCanchaTienePrecio] = useState(false); // manejo botones
  //-----------------------------------------------------------------------------

  useEffect(() => {
    async function fetchCanchas() {
      try {
        const { data } = await calendarApi.get("/cancha");

        if (Array.isArray(data.canchas)) {
          setCanchas(data.canchas); // guardamos todas las canchas
        }
      } catch (error) {}
    }

    fetchCanchas();
  }, []);

  //-----------------------------------------------------------------------------
  useEffect(() => {
    const cargarCanchasConPrecios = async () => {
      try {
        const { data } = await calendarApi.get("/configuracion/");

        if (data.ok) {
          setCanchasConPrecios(data.canchasPrecio);
        } else {
          console.warn("No se encontraron configuraciones de precios");
        }
      } catch (error) {}
    };

    cargarCanchasConPrecios();
  }, []);
  //-----------------------------------------------------------------------------

  const registerSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!registerNombre || !precioCancha || !precioSena) {
      Swal.fire(
        "Campos incompletos",
        "Todos los campos son obligatorios",
        "error"
      );
      return;
    }

    const { ok, msg } = await startRegister({
      nombre: registerNombre,
      monto_cancha: Number(precioCancha),
      monto_sena: Number(precioSena),
    });

    if (ok) {
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Precios registrados",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg || "No se pudo registrar el precio",
      });
    }
  };
  const handleActualizarPrecios = async () => {
    if (!registerNombre) {
      return Swal.fire("Atención", "Debe seleccionar una cancha", "warning");
    }

    try {
      const { data } = await calendarApi.put(
        `/configuracion/${registerNombre}`,
        {
          monto_cancha: precioCancha,
          monto_sena: precioSena,
        }
      );
      console.log(data);
      if (data.ok) {
        Swal.fire("Actualizado", "Precios actualizados con éxito", "success");

        // Actualizar tabla
        const { data: precios } = await calendarApi.get("/configuracion/");
        setCanchasConPrecios(precios.canchasPrecio);
      }
    } catch (error) {
      console.error("Error al actualizar precios:", error);
      Swal.fire("Error", "No se pudo actualizar el precio", "error");
    }
  };

  //-----------------------------------------------------------------------------

  return (
    <>
      <Navbar />
      <h1 className="text-center my-4 mt-5">Precios de la Cancha</h1>
      <div className="col-md-8 login-form-3 mx-auto">
        <form onSubmit={registerSubmit} id="formAltaPrecio">
          <div className="container">
            <div className="row col-6">
              <div className="form-group mb-2">
                <div className="form-group mb-2">
                  <select
                    id="cancha"
                    className="form-select"
                    value={canchaSeleccionada}
                    onChange={async (e) => {
                      const idSeleccionado = Number(e.target.value);
                      setCanchaSeleccionada(idSeleccionado);

                      const canchaSeleccionadaObj = canchas.find(
                        (c) => c.id === idSeleccionado
                      );
                      if (canchaSeleccionadaObj) {
                        setRegisterNombre(canchaSeleccionadaObj.nombre);
                      }

                      try {
                        const { data } = await calendarApi.get(
                          `/configuracion/id/${idSeleccionado}`
                        );

                        if (data?.canchasMonto?.monto_cancha != null) {
                          setPrecioCancha(data.canchasMonto.monto_cancha);
                          setPrecioSena(data.canchasMonto.monto_sena);
                          setCanchaTienePrecio(true);
                        } else {
                          setPrecioCancha("");
                          setPrecioSena("");
                          setCanchaTienePrecio(false);
                          Swal.fire({
                            icon: "warning",
                            title: "Cancha sin precios",
                            text: "Esta cancha no tiene precios configurados.",
                          });
                        }
                      } catch (error) {
                        console.error(
                          "Error al buscar precio de cancha:",
                          error
                        );
                        setPrecioCancha("");
                        setPrecioSena("");
                        setCanchaTienePrecio(false);
                        Swal.fire({
                          icon: "warning",
                          title: "Cancha sin precios",
                          text: "Esta cancha no tiene precios configurados.",
                        });
                      }
                    }}
                  >
                    <option value="">Seleccione una cancha</option>
                    {canchas.map((cancha) => (
                      <option key={cancha.id} value={cancha.id}>
                        {cancha.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <label
                  htmlFor="precio"
                  id="canchaPrecio"
                  className="form-label"
                >
                  Cancha
                </label>
                <input
                  type="number"
                  className={`form-control montoCancha `}
                  id="precio"
                  value={precioCancha}
                  onChange={(e) => setPrecioCancha(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="sena" id="canchaSena" className="form-label">
                  Seña
                </label>
                <input
                  type="number"
                  className={`form-control montoSena`}
                  id="sena"
                  value={precioSena}
                  onChange={(e) => setPrecioSena(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="d-grid gap-2">
            <input
              type="submit"
              className={`btnSubmitGuardar ${
                canchaTienePrecio ? "btn-disabled" : ""
              }`}
              disabled={canchaTienePrecio}
              value="Guardar"
            />
            <input
              type="button"
              className={`btnSubmitActualizar ${
                !canchaTienePrecio ? "btn-disabled" : ""
              }`}
              value="Actualizar"
              onClick={handleActualizarPrecios}
              disabled={!canchaTienePrecio}
            />
          </div>
          <div className="tabla-scroll-wrapper">
            <table className="table table-bordered">
              <thead className="table-dark text-center">
                <tr>
                  <th>Nombre Cancha</th>
                  <th>Precio Cancha</th>
                  <th>Precio Seña</th>
                </tr>
              </thead>
              <tbody>
                {canchasConPrecios.length > 0 ? (
                  canchasConPrecios.map((cancha) => (
                    <tr key={cancha.id}>
                      <td>{cancha.nombre}</td>
                      <td>${cancha.precio_cancha}</td>
                      <td>${cancha.precio_sena}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No hay canchas configuradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </>
  );
};

export default PrecioCancha;
