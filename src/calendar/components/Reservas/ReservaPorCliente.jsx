import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Navbar } from "../Navbar";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./reservas.css";
import AsyncSelect from "react-select/async";
import { calendarApi } from "../../../api";
import Swal from "sweetalert2";
import { CalendarModal } from "../CalendarModal";
import { BsPencil } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useUiStore, useCalendarStore } from "../../../hooks";
import { useSelector } from "react-redux";

export const ReservaPorCliente = () => {
  const [results, setResults] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [dni, setDni] = useState("");
  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [apellidoCliente, setApellidoCliente] = useState("");
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const { events, activeEvent } = useSelector((state) => state.calendar);

  // const [activeEvent, setActiveEvent] = useState(null);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const { openDateModal } = useUiStore();
  const { setActiveEvent, startDeletingEvent } = useCalendarStore();

  /**
   * TRABAJO CLIENTE PARA MANDARLO A ASYNCSELECT.
   */
  useEffect(() => {
    const buscarCliente = async () => {
      const { data } = await calendarApi.get("/cliente");
      const cliente = Array.from(data.clientes);
      const opciones = cliente.map((clientes) => ({
        value: clientes.dni,
        label: `${clientes.dni} - ${clientes.apellido} ${clientes.nombre}`,
      }));
      //almacena los clientes
      setOpciones(opciones);
    };
    buscarCliente();
  }, []);
  // Cargo Clientes por filtro - para pasarle al asyncSelect.
  const loadOptions = (searchValue, callback) => {
    const opcionesFiltradas = opciones.filter((opcion) =>
      opcion.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
    );

    callback(opcionesFiltradas);
  };
  const [formValues, setFormValues] = useState({
    cliente: "",
  });
  //Seteo del cliente.  Para que quede seleccionado al enviar al backend
  const onClienteChanged = ({ target }, value) => {
    if (value && value.value) {
      setDni(value.value);
    }
    const apellido = value.label.split(" ")[2]; // Asegúrate de que esto coincida con el formato del label
    setApellidoCliente(apellido.toUpperCase()); // Postman usa mayúsculas
    console.log(apellido);

    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };
  //--------------------------------------------------------------------------------------------------------------------------------------------------
  /**
   * APLICO LOGICA DE BUSQUEDA DE RESERVAS POR CLIENTE EN UN RANGO DE FECHAS
   */
  const handleBuscarReservas = async (e) => {
    e.preventDefault();
    setBusquedaRealizada(true); //para el msj si exite o no reserva del cliente

    if (!dni || !fechaDesde || !fechaHasta) {
      // alert("Debe seleccionar cliente y rango de fechas");
      Swal.fire("Atención", "Se encontraron campos incompletos", "warning");
      return;
    }

    const desdeStr = fechaDesde.toISOString().split("T")[0]; // YYYY-MM-DD
    const hastaStr = fechaHasta.toISOString().split("T")[0];

    try {
      const { data } = await calendarApi.get(
        `/reserva/${dni}/${desdeStr}/${hastaStr}`
      );
      // de esta forma y no solo data. Porque el backend me devuelve un array
      setResults(data.reservasCliente); // <-- el array directamente
    } catch (error) {
      console.error("Error al buscar reservas:", error);
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
        // Llamada directa a la API para eliminar la reserva
        await calendarApi.delete(`/reserva/${reserva.id}`);

        // Actualización de la tabla local sin recargar ni usar Redux
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
      <h1 className="display-5">Consultar Reserva por Cliente</h1>
      <div className="col-md-8 login-form-3">
        <form onSubmit={handleBuscarReservas}>
          <div className="row justify-content-center mb-4">
            <div className="col-12 col-md-8">
              <AsyncSelect
                classNamePrefix="react-select"
                className="w-100"
                name="cliente"
                placeholder="Buscar Cliente"
                loadOptions={loadOptions}
                defaultOptions
                value={formValues.cliente}
                onChange={(value) =>
                  onClienteChanged(
                    { target: { name: "cliente", value: value } },
                    value
                  )
                }
              />
            </div>
          </div>

          <div className="row justify-content-center mb-3">
            <div className="col-md-4">
              <label className="form-label">Desde</label>
              <DatePicker
                selected={fechaDesde}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                locale="es"
                onChange={(date) => setFechaDesde(date)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Hasta</label>
              <DatePicker
                selected={fechaHasta}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                locale="es"
                onChange={(date) => setFechaHasta(date)}
              />
            </div>
          </div>

          <div className="d-grid gap-2">
            <input type="submit" className="btnSubmit" value="Buscar" />
          </div>

          <div class="table-responsive mt-4 shadow rounded">
            {/* Verifico que results sea un array y que contenga datos */}
            {busquedaRealizada ? (
              Array.isArray(results) && results.length > 0 ? (
                <table className="table table-bordered table-hover table-striped align-middle text-center tabla-reserva-sm">
                  <thead className="table-dark text-uppercase">
                    <tr className="bg-gray-200">
                      <th className="border px-2 py-1">Fecha</th>
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
                          {new Date(reserva.fecha).toLocaleDateString("es-AR")}
                        </td>
                        <td className="border px-2 py-1">{reserva.hora}</td>
                        <td className="border px-2 py-1">{reserva.cancha}</td>
                        <td className="border px-2 py-1">
                          {reserva.forma_pago}
                        </td>
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
                  No se encontraron reservas para el cliente.
                </p>
              )
            ) : null}
          </div>
        </form>
      </div>

      <CalendarModal />
    </>
  );
};
export default ReservaPorCliente;
