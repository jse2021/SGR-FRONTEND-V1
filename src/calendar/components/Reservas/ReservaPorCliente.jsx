import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./reservas.css";
import AsyncSelect from "react-select/async";
import { calendarApi } from "../../../api";
import Swal from "sweetalert2";

export const ReservaPorCliente = () => {
  const [results, setResults] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [dni, setDni] = useState("");
  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [apellidoCliente, setApellidoCliente] = useState("");
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

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
      console.log("Reservas encontradas:", data);
    } catch (error) {
      console.error("Error al buscar reservas:", error);
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
                dateFormat="Pp"
                locale="es"
                onChange={(date) => setFechaDesde(date)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Hasta</label>
              <DatePicker
                selected={fechaHasta}
                className="form-control"
                dateFormat="Pp"
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
                <table className="table table-bordered table-hover table-striped align-middle text-center">
                  <thead className="table-dark text-uppercase">
                    <tr className="bg-gray-200">
                      <th className="border px-4 py-2">Fecha</th>
                      <th className="border px-4 py-2">Hora</th>
                      <th className="border px-4 py-2">Cancha</th>
                      <th className="text-nowrap">Forma de Pago</th>
                      <th className="text-nowrap">Estado de Pago</th>
                      <th className="border px-4 py-2">Total</th>
                      <th className="border px-4 py-2">Seña</th>
                      <th classNames="text-nowrap">Observ.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((reserva) => (
                      <tr key={reserva._id}>
                        <td className="border px-4 py-2">
                          {new Date(reserva.fecha).toLocaleDateString()}
                        </td>
                        <td class="text-nowrap">{reserva.hora}</td>
                        <td class="text-nowrap">{reserva.cancha}</td>
                        <td class="text-nowrap">{reserva.forma_pago}</td>
                        <td class="text-nowrap">{reserva.estado_pago}</td>
                        <td class="text-nowrap">${reserva.monto_cancha}</td>
                        <td class="text-nowrap">${reserva.monto_sena}</td>
                        <td class="text-nowrap">
                          {reserva.observacion || "-"}
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
    </>
  );
};
export default ReservaPorCliente;
