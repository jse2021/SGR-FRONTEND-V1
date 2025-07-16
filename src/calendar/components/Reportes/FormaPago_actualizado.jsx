import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AsyncSelect from "react-select/async";
import { calendarApi } from "../../../api";
import Select from "react-select";

export const FormaPago = () => {
  const [form, setForm] = useState({
    fecha: null,
    cancha: "",
    forma_pago: "",
    estado_pago: "",
  });
  const [busquedaRealizada, setBusquedaRealizada] = useState(false); //para saber si hubo busqueda
  const [resulta, setResultados] = useState("");
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [pagina, setPagina] = useState(1);

  //**TRAIGO LAS CANCHAS QUE TIENEN PRECIOS */
  const loadCanchas = async () => {
    try {
      const { data } = await calendarApi.get("/configuracion");
      return data.canchasPrecio.map((cancha) => ({
        label: cancha.nombre,
        value: cancha.nombre,
      }));
    } catch (error) {
      console.error("Error al cargar canchas", error);
      return [];
    }
  };

  /**DEJO FIJO FORMAS DE PAGO Y ESTADO DE PAGO */
  const formasPago = [
    { label: "EFECTIVO", value: "EFECTIVO" },
    { label: "TRANSFERENCIA", value: "TRANSFERENCIA" },
    { label: "DÉBITO", value: "DÉBITO" },
    { label: "TARJETA", value: "TARJETA" },
    { label: "TODAS", value: "TODAS" },
  ];

  const estadosPago = [
    { label: "TOTAL", value: "TOTAL" },
    { label: "SEÑA", value: "SEÑA" },
    { label: "TODAS", value: "TODAS" },
  ];

  /**IMPLEMENTO BUSCAR */
  const handleBuscar = async () => {
    const { fecha, cancha, forma_pago, estado_pago } = form;

    // ✅ Validación obligatoria de fecha
    if (!fecha) {
      console.error("Debes seleccionar una fecha");
      return;
    }

    // ✅ Formateo correcto de fecha en ISO para backend
    const fechaCopia = new Date(fecha).toISOString();
    console.log(fechaCopia);
    console.log(form.cancha);
    console.log(form.estado_pago);
    console.log(form.forma_pago);

    // ✅ Valores por defecto para filtros
    const canchaSeleccionada = cancha || "TODAS";
    const formaPagoSeleccionada = forma_pago || "TODAS";
    const estadoPagoSeleccionado = estado_pago || "TODAS";

    try {
      // ✅ Petición al backend con paginación
      const { data } = await calendarApi.get(
        `/reserva/${fechaCopia}/${canchaSeleccionada}/${formaPagoSeleccionada}/${estadoPagoSeleccionado}?page=${pagina}&limit=2`
      );

      // console.log(data.resumen); //  Confirmar lo recibido en consola
      console.log(data.resumen); // ✅ esta es la propiedad correcta
      setResultados(data.resumen); // ✅ ahora funciona
      setTotalPaginas(data.totalPages);
      setBusquedaRealizada(true);
      // setResultados(data.resumen); //  Guardar resultados en estado
      // setTotalPaginas(data.totalPaginas); //  Paginación desde backend

      // ✅ Limpiar formulario luego de búsqueda
      setForm({
        fecha: null,
        cancha: "",
        forma_pago: "",
        estado_pago: "",
      });
    } catch (error) {
      console.error("❌ Error al buscar reservas", error);
    }
  };
  useEffect(() => {
    if (busquedaRealizada) {
      handleBuscar();
    }
  }, [pagina]);
  useEffect(() => {
    if (form.fecha) {
      handleBuscar(); // se ejecuta al cambiar de página
    }
  }, [pagina]);
  return (
    <>
      <Navbar />
      <h1 className="text-center my-4">
        Control Formas de Pago(en construccion)
      </h1>
      <div className="col-md-8 login-form-3 mx-auto">
        <form>
          <div className="row align-items-end g-2">
            {/* Fecha */}
            <div className="col-md-3">
              <DatePicker
                className="form-control w-100"
                selected={form.fecha}
                onChange={(date) =>
                  setForm((prev) => ({ ...prev, fecha: date }))
                }
                placeholderText="Seleccionar fecha"
                dateFormat="dd/MM/yyyy"
                locale="es"
              />
            </div>

            {/* Cancha */}
            <div className="col-md-3">
              <AsyncSelect
                classNamePrefix="react-select"
                className="w-100"
                loadOptions={loadCanchas}
                onChange={(option) =>
                  setForm((prev) => ({ ...prev, cancha: option?.value || "" }))
                }
                name="cancha"
                placeholder="Cancha"
                defaultOptions
              />
            </div>

            {/* Forma de pago */}
            <div className="col-md-3">
              <Select
                classNamePrefix="react-select"
                className="w-100"
                name="f.pago"
                placeholder="Forma de pago"
                defaultOptions
                options={formasPago}
                value={formasPago.find(
                  (option) => option.value === form.forma_pago
                )}
                onChange={(selected) =>
                  setForm((prev) => ({ ...prev, forma_pago: selected.value }))
                }
              />
            </div>

            {/* Estado */}
            <div className="col-md-3">
              <Select
                classNamePrefix="react-select"
                className="w-100"
                name="e.pago"
                placeholder="Estado de pago"
                options={estadosPago}
                value={estadosPago.find(
                  (option) => option.value === form.estado_pago
                )}
                onChange={(selected) =>
                  setForm((prev) => ({ ...prev, estado_pago: selected.value }))
                }
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <input
              type="button"
              className="btn btn-dark px-5 py-2 rounded-pill"
              value="Buscar"
              onClick={handleBuscar}
            />
          </div>
        </form>
        {busquedaRealizada && (
          <div className="table-responsive mt-4 shadow rounded">
            {Array.isArray(resulta) && resulta.length > 0 ? (
              <>
                <table className="table table-bordered table-hover table-striped align-middle text-center tabla-reserva-sm">
                  <thead className="table-dark text-uppercase">
                    <tr className="bg-gray-200">
                      <th className="border px-2 py-1">Fecha</th>
                      <th className="border px-2 py-1">Cancha</th>
                      <th className="border px-2 py-1">Forma de Pago</th>
                      <th className="border px-2 py-1">Estado de Pago</th>
                      <th className="border px-2 py-1">Total</th>
                      <th className="border px-2 py-1">Seña</th>
                      <th className="border px-2 py-1">Usuario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resulta.map((reserva, index) => (
                      <tr key={index}>
                        <td className="border px-2 py-1">
                          {new Date(reserva.Fecha).toLocaleDateString("es-AR")}
                        </td>
                        <td className="border px-2 py-1">{reserva.Cancha}</td>
                        <td className="border px-2 py-1">
                          {reserva.Forma_Pago}
                        </td>
                        <td className="border px-2 py-1">
                          {reserva.estado_pago}
                        </td>
                        <td className="border px-2 py-1">${reserva.Monto}</td>
                        <td className="border px-2 py-1">${reserva.Seña}</td>
                        <td className="border px-2 py-1">{reserva.Usuario}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

{busquedaRealizada && resultados.length === 0 && !isLoading && (
  <div className="alert alert-warning text-center mt-3">
    No se encontraron reservas con los filtros seleccionados.
  </div>
)}
                {/* Paginación */}
                {totalPaginas > 1 && (
                  <div className="d-flex justify-content-center my-3">
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          type="button"
                          key={pageNum}
                          className={`btn btn-sm mx-1 ${
                            pagina === pageNum
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => setPagina(pageNum)}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="mt-4 text-gray-600 text-center">
                No se encontraron reservas con los filtros seleccionados.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FormaPago;
