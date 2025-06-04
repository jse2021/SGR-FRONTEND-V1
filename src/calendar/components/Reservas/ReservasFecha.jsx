import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { calendarApi } from "../../../api";
import Swal from "sweetalert2";
import "./ReservasFecha.css";
import { BsPencil } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { useCalendarStore, useUiStore } from "../../../hooks";
import { CalendarModal } from "../CalendarModal";

export const ReservasFecha = () => {
  const [cancha, setCancha] = useState([]);
  const [fechaIni, setFechaIni] = useState(null);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState("");
  const [results, setResults] = useState([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const { setActiveEvent, startDeletingEvent } = useCalendarStore();
  const { openDateModal } = useUiStore();

  async function fetchData() {
    const { data } = await calendarApi.get("/cancha");
    if (data.canchas instanceof Array) {
      setCancha(
        data.canchas.map((cancha) => {
          return {
            id: cancha.id,
            nombre: cancha.nombre,
          };
        })
      );
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleBuscarReservas = async (e) => {
    e.preventDefault();

    if (!fechaIni || !cancha) {
      // alert("Debe seleccionar cliente y rango de fechas");
      Swal.fire("Atención", "Se encontraron campos incompletos", "warning");
      return;
    }
    const desdeStr = fechaIni.toISOString().split("T")[0]; // YYYY-MM-DD
    console.log(desdeStr);
    try {
      const { data } = await calendarApi.get(
        `/reserva/${desdeStr}/${canchaSeleccionada}`
      );

      console.log("Reservas encontradas:", data.reservasFecha);
      setResults(data.reservasFecha);
      setResults(data.reservasFecha);
      setBusquedaRealizada(true);
    } catch (error) {
      console.error("Error al buscar reservas:", error);
      setResults([]);
      setBusquedaRealizada(true);
    }
  };
  //--------------------------------------------------------------------------------------------------------------------------------------------------
  /**
   * FUNCION PARA LLAMAR AL MODAL - EDITAR
   */
  const handleEditarReserva = (reserva) => {
    setActiveEvent(reserva); // importante: setear en el store qué reserva se va a editar
    openDateModal(); // sin argumento
    console.log(reserva);
  };
  //--------------------------------------------------------------------------------------------------------------------------------------------------
  /**
   * FUNCION PARA ELIMINAR RESERVA DESDE TABLA
   */

  const handleEliminarReserva = async (reserva) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar reserva?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        // Eliminar en backend
        await calendarApi.delete(`/reserva/${reserva.id}`);

        // Eliminar en la tabla local sin recargar
        setResults((prevResults) =>
          prevResults.filter((r) => r._id !== reserva._id)
        );

        Swal.fire(
          "Eliminado",
          "La reserva fue eliminada correctamente",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar reserva:", error);
        Swal.fire(
          "Error",
          error.response?.data?.msg || "No se pudo eliminar la reserva",
          "error"
        );
      }
    }
  };
  return (
    <>
      <Navbar />
      <h1 className="display-5">Consultar reserva de la fecha</h1>
      <div className="col-md-8 login-form-3">
        <form onSubmit={handleBuscarReservas} className="form-fecha-container">
          {/* CONTENEDOR FLEX DE INPUTS */}
          <div className="form-row mb-3">
            <div className="form-group me-3">
              <DatePicker
                selected={fechaIni}
                className="form-control select_fecha"
                dateFormat="dd/MM/yyyy"
                locale="es"
                onChange={(date) => setFechaIni(date)}
                id="datepicker"
                placeholderText="Seleccioná una fecha"
              />
            </div>
            <div className="form-group">
              <select
                className="form-control select_cancha"
                name="registerNombreCancha"
                id="cancha"
                value={canchaSeleccionada}
                onChange={(e) => setCanchaSeleccionada(e.target.value)}
              >
                <option value="" disabled>
                  Seleccione una cancha
                </option>
                {cancha.map((c) => (
                  <option key={c.id} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100">
            Buscar
          </button>
        </form>
        <div className="table-responsive mt-4 shadow rounded">
          {busquedaRealizada ? (
            Array.isArray(results) && results.length > 0 ? (
              <table className="table table-bordered table-hover table-striped align-middle text-center tabla-reserva-sm">
                <thead className="table-dark text-uppercase">
                  <tr className="bg-gray-200">
                    <th className="border px-2 py-1">Cliente</th>
                    <th className="border px-2 py-1">Hora</th>
                    <th className="border px-2 py-1">Cancha</th>
                    <th className="border px-2 py-1">Forma de Pago</th>
                    <th className="border px-2 py-1">Estado de Pago</th>
                    <th className="border px-2 py-1">Total</th>
                    <th className="border px-2 py-1">Seña</th>
                    <th className="border px-2 py-1">Observ.</th>
                    <th className="border px-2 py-1">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((reserva) => (
                    <tr key={reserva._id}>
                      <td className="border px-4 py-2">
                        {reserva.apellidoCliente} {reserva.nombreCliente}
                      </td>
                      <td className="border px-2 py-1">{reserva.hora}</td>
                      <td className="border px-2 py-1">{reserva.cancha}</td>
                      <td className="border px-2 py-1">{reserva.forma_pago}</td>
                      <td className="border px-2 py-1">
                        {reserva.estado_pago}
                      </td>
                      <td className="border px-2 py-1">
                        ${reserva.monto_cancha}
                      </td>
                      <td className="border px-2 py-1">
                        ${reserva.monto_sena}
                      </td>
                      <td className="border px-2 py-1">
                        {reserva.observacion || "-"}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm me-1"
                          onClick={() => handleEditarReserva(reserva)}
                          title="Editar reserva"
                        >
                          <BsPencil />
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleEliminarReserva(reserva)}
                          title="Eliminar reserva"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-4 text-gray-600">
                No se encontraron reservas para esa fecha y cancha.
              </p>
            )
          ) : null}
        </div>
        {/* </form> */}
      </div>
      <CalendarModal />
    </>
  );
};
export default ReservasFecha;
