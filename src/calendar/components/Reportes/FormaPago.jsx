import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AsyncSelect from "react-select/async";
import { calendarApi } from "../../../api";
import Select from "react-select";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Esta línea es clave

export const FormaPago = () => {
  const [form, setForm] = useState({
    fecha: null,
    cancha: "",
    forma_pago: "",
    estado_pago: "",
  });
  const [resultados, setResultados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const exportarPDF = () => {
    if (resultados.length === 0) return;

    const doc = new jsPDF();

    doc.text("Reporte de Reservas", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "Nombre",
          "Apellido",
          "Hora",
          "Cancha",
          "Forma Pago",
          "Estado",
          "Total",
          "Seña",
        ],
      ],
      body: resultados.map((reserva) => [
        reserva.Nombre || "-",
        reserva.Apellido || "-",
        reserva.Hora,
        reserva.Cancha,
        reserva.Forma_Pago,
        reserva.Estado_Pago,
        `$${reserva.Monto || 0}`,
        `$${reserva.Seña || 0}`,
      ]),
    });

    doc.save("reservas.pdf");
  };

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
    { label: "SIN OPERACION", value: "SO" },
    { label: "TODAS", value: "TODAS" },
  ];

  const estadosPago = [
    { label: "TOTAL", value: "TOTAL" },
    { label: "SEÑA", value: "SEÑA" },
    { label: "IMPAGO", value: "IMPAGO" },
    { label: "TODAS", value: "TODAS" },
  ];

  //**MANEJO POR SEPARADO PARA TRABAJAR LA PAGINACION */
  const fetchResultados = async (pagina = 1) => {
    const { fecha, cancha, forma_pago, estado_pago } = form;
    //Validación obligatoria de fecha
    if (!fecha || !cancha || !forma_pago || !estado_pago) {
      Swal.fire("Atención", "Hay campos incompletos", "warning");
      return;
    }

    //Formateo correcto de fecha en ISO para backend
    const fechaCopia = new Date(fecha).toISOString();

    //Valores por defecto para filtros
    const canchaSeleccionada = cancha || "TODAS";
    const formaPagoSeleccionada = forma_pago || "TODAS";
    const estadoPagoSeleccionado = estado_pago || "TODAS";

    try {
      //Petición al backend con paginación
      const { data } = await calendarApi.get(
        `/reserva/${fechaCopia}/${canchaSeleccionada}/${formaPagoSeleccionada}/${estadoPagoSeleccionado}?page=${pagina}&limit=10`
      );

      setResultados(data.resumen);
      setTotalPaginas(data.totalPages || 1);
      setPaginaActual(pagina);
      setBusquedaRealizada(true);
    } catch (error) {
      console.error("Error al buscar reservas", error);
      // Si el backend devuelve 404, lo tomamos como búsqueda válida sin resultados
      if (error.response && error.response.status === 404) {
        setResultados([]); // Deja vacío el listado
        setTotalPaginas(1); // Reestablece paginación
        setBusquedaRealizada(true); // Activa la bandera
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**IMPLEMENTO BUSCAR */
  const handleBuscar = async (e) => {
    e.preventDefault();
    await fetchResultados(1);
  };
  /**PARA LA PAGINACION */
  const handlePageChange = async (pagina) => {
    await fetchResultados(pagina);
  };

  return (
    <>
      <Navbar />
      <h1 className="text-center my-4">Control Formas de Pago</h1>
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
            {Array.isArray(resultados) && resultados.length > 0 ? (
              <>
                <table className="table table-bordered table-hover table-striped align-middle text-center tabla-reserva-sm">
                  <thead className="table-dark text-uppercase">
                    <tr className="bg-gray-200">
                      <th className="border px-2 py-1">Fecha</th>
                      <th className="border px-2 py-1">Cliente</th>
                      <th className="border px-2 py-1">Cancha</th>
                      <th className="border px-2 py-1">Forma de Pago</th>
                      <th className="border px-2 py-1">Estado de Pago</th>
                      <th className="border px-2 py-1">Total</th>
                      <th className="border px-2 py-1">Seña</th>
                      <th className="border px-2 py-1">Usuario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((reserva, index) => (
                      <tr key={index}>
                        <td className="border px-2 py-1">
                          {new Date(reserva.Fecha).toLocaleDateString("es-AR")}
                        </td>
                        <td className="border px-2 py-1">
                          {reserva.Nombre + " " + reserva.Apellido}
                        </td>
                        <td className="border px-2 py-1">{reserva.Cancha}</td>
                        <td className="border px-2 py-1">
                          {reserva.Forma_Pago}
                        </td>
                        <td className="border px-2 py-1">
                          {reserva.Estado_Pago}
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
                          key={pageNum}
                          className={`btn btn-sm mx-1 ${
                            paginaActual === pageNum
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>
                )}
                <button
                  className="btn btn-danger mb-3 ms-2"
                  onClick={exportarPDF}
                >
                  Exportar a PDF
                </button>
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
