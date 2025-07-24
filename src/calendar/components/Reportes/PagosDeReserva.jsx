import React, { useState } from "react";
import { Navbar } from "../Navbar";
import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calendarApi } from "../../../api";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

export const PagosDeReserva = () => {
  const [form, setForm] = useState({
    fechaInicio: null,
    fechaFin: null,
    estado_pago: "",
  });
  const [resultados, setResultados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const estadosPago = [
    { label: "TOTAL", value: "TOTAL" },
    { label: "SEÑA", value: "SEÑA" },
    { label: "IMPAGO", value: "IMPAGO" },
  ];
  const exportarPDF = () => {
    if (resultados.length === 0) return;

    const doc = new jsPDF();

    doc.text("Reporte de Reservas", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [["Fecha", "Cliente", "Cancha", "Estado", "Monto"]],
      body: resultados.map((reserva) => [
        new Date(reserva.fecha).toLocaleDateString("es-AR") || "-",
        reserva.nombre + " " + reserva.apellido || "-",
        `${reserva.cancha || 0}`,
        `${reserva.estado || 0}`,
        `$${reserva.monto_total || reserva.monto_sena || reserva.impago || 0}`,
      ]),
    });

    doc.save("reservas.pdf");
  };
  //**MANEJO POR SEPARADO PARA TRABAJAR LA PAGINACION */
  const fetchResultados = async (pagina = 1) => {
    const { fechaInicio, fechaFin, estado_pago } = form;
    //Validación obligatoria de fecha
    if (!fechaInicio || !fechaFin || !estado_pago) {
      Swal.fire(
        "Campos requeridos",
        "Completa todas las fechas y cancha",
        "warning"
      );
      return;
    }

    const fechaInicioISO = new Date(fechaInicio).toISOString();
    const fechaFinISO = new Date(fechaFin).toISOString();

    //Valores por defecto para filtros
    const estadoPagoSeleccionado = estado_pago || "TODAS";

    try {
      setIsLoading(true);
      const { data } = await calendarApi.get(
        `/reserva/estadoReservas/${estadoPagoSeleccionado}/${fechaInicioISO}/${fechaFinISO}?page=${pagina}&limit=10`
      );

      setResultados(data.reservasFormateadas || []);
      console.log(data.reservasFormateadas);
      setTotalPaginas(data.totalPages || 1);
      setPaginaActual(pagina);
      console.log(data.totalPages);
      setBusquedaRealizada(true);
    } catch (error) {
      console.error("Error al obtener recaudación", error);
      setResultados([]);
      setBusquedaRealizada(true);
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
      <div>
        <h1 className="text-center my-4 mt-5">Estado de pago de Reservas</h1>
        <div className="col-md-8 login-form-3 mx-auto">
          <form>
            <div className="row justify-content-center align-items-end g-2">
              {/* Fecha */}
              <div className="col-md-3">
                <DatePicker
                  className="form-control"
                  locale="es"
                  placeholderText="Fecha inicio"
                  dateFormat="dd/MM/yyyy"
                  selected={form.fechaInicio}
                  onChange={(date) =>
                    setForm((prev) => ({ ...prev, fechaInicio: date }))
                  }
                />
              </div>

              <div className="col-md-3">
                <DatePicker
                  className="form-control"
                  locale="es"
                  placeholderText="Fecha fin"
                  dateFormat="dd/MM/yyyy"
                  selected={form.fechaFin}
                  onChange={(date) =>
                    setForm((prev) => ({ ...prev, fechaFin: date }))
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
                    setForm((prev) => ({
                      ...prev,
                      estado_pago: selected.value,
                    }))
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
                        <th className="border px-2 py-1">Estado</th>
                        <th className="border px-2 py-1">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultados.map((reserva, index) => (
                        <tr key={index}>
                          <td className="border px-2 py-1">
                            {" "}
                            {new Date(reserva.fecha).toLocaleDateString(
                              "es-AR"
                            )}
                          </td>
                          <td className="border px-2 py-1">
                            {(reserva.nombre, reserva.apellido)}
                          </td>
                          <td className="border px-2 py-1">{reserva.cancha}</td>
                          <td className="border px-2 py-1">{reserva.estado}</td>
                          <td className="border px-2 py-1">
                            $
                            {reserva.monto_sena ||
                              reserva.monto_total ||
                              reserva.impago}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/*  Mensaje si no se encuentran resultados */}
                  {busquedaRealizada &&
                    resultados.length === 0 &&
                    !isLoading && (
                      <div className="alert alert-warning text-center mt-3">
                        No se encontraron reservas con los filtros
                        seleccionados.
                      </div>
                    )}

                  {/*  Paginación (si hay más de una página, sin depender del resultado actual) */}
                  {busquedaRealizada && totalPaginas > 1 && (
                    <div className="d-flex justify-content-center my-3">
                      {Array.from(
                        { length: totalPaginas },
                        (_, i) => i + 1
                      ).map((pageNum) => (
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
                      ))}
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
      </div>
    </>
  );
};
export default PagosDeReserva;
