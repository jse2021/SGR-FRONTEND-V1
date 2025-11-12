import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import { calendarApi } from "../../../api";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Recaudacion.css";
import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// helper local para YYYY-MM-DD
const toYMD = (d) => {
  const f = new Date(d);
  const y = f.getFullYear();
  const m = String(f.getMonth() + 1).padStart(2, "0");
  const day = String(f.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const Recaudacion = () => {
  const [form, setForm] = useState({
    fechaInicio: null,
    fechaFin: null,
    cancha: "",
  });
  const [resultados, setResultados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  //**TRABAJO BUSQUEDA DE RESULTADOS
  // REALIZO LA BUSQUEDA POR SEPARADA CON PAGINACION */

  const fetchResultados = async (pagina = 1) => {
    const { fechaInicio, fechaFin, cancha } = form;

    if (!fechaInicio || !fechaFin || !cancha) {
      Swal.fire(
        "Campos requeridos",
        "Completa todas las fechas y cancha",
        "warning"
      );
      return;
    }

    const fIni = toYMD(fechaInicio);
    const fFin = toYMD(fechaFin);
    const canchaURL = encodeURIComponent(cancha);

    try {
      setIsLoading(true);

      const { data } = await calendarApi.get(
        `/reserva/recaudacion/${canchaURL}/${fIni}/${fFin}?page=${pagina}&limit=10`
      );

      // Preferimos 'resultados' (alias generado en backend). Si no, cae en 'resumenDiario'.
      const filas = Array.isArray(data?.resultados)
        ? data.resultados
        : Array.isArray(data?.resumenDiario)
        ? data.resumenDiario
        : [];

      setResultados(filas);
      setTotalPaginas(Number(data?.pages ?? 1));
      setPaginaActual(Number(data?.page ?? pagina));
      setBusquedaRealizada(true);
    } catch (error) {
      console.error("Error al obtener recaudación", error);
      setResultados([]);
      setBusquedaRealizada(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Al hacer clic en Buscar
  const handleBuscar = async (e) => {
    e.preventDefault();
    await fetchResultados(1);
  };

  // Paginación
  const handlePageChange = async (pagina) => {
    await fetchResultados(pagina);
  };

  const exportarPDF = () => {
    if (resultados.length === 0) return;
    console.log(resultados);

    const doc = new jsPDF();

    doc.text("Reporte de Reservas", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        ["Fecha", "Cancha", "Total Consolidado", "Total Señas", "Total Deuda"],
      ],
      body: resultados.map((reserva) => [
        new Intl.DateTimeFormat("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(reserva.Fecha)),
        reserva.Cancha || "-",
        `$${Number(reserva.monto_consolidado || 0).toLocaleString("es-AR")}`,
        `$${Number(reserva.senas_consolidadas || 0).toLocaleString("es-AR")}`,
        `$${Number(reserva.monto_deuda || 0).toLocaleString("es-AR")}`,
      ]),
    });

    doc.save("reservas.pdf");
  };

  return (
    <>
      <Navbar />
      <div>
        <h1 className="text-center my-4 mt-5">Recaudación</h1>
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

              {/* Cancha */}
              <div className="col-md-3">
                <AsyncSelect
                  classNamePrefix="react-select"
                  className="w-100"
                  loadOptions={loadCanchas}
                  onChange={(option) =>
                    setForm((prev) => ({
                      ...prev,
                      cancha: option?.value || "",
                    }))
                  }
                  name="cancha"
                  placeholder="Cancha"
                  defaultOptions
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
                        <th className="border px-2 py-1">Cancha</th>
                        <th className="border px-2 py-1">Total Consolidado</th>
                        <th className="border px-2 py-1">Total Señas</th>
                        <th className="border px-2 py-1">Total Deuda</th>
                        <th className="border px-2 py-1">Reservas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultados.map((reserva, index) => (
                        <tr key={index}>
                          <td className="border px-2 py-1">
                            {new Intl.DateTimeFormat("es-AR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              timeZone: "UTC",
                            }).format(new Date(reserva.Fecha))}
                          </td>
                          <td className="border px-2 py-1">{reserva.Cancha}</td>
                          <td className="border px-2 py-1">
                            ${reserva.monto_consolidado}
                          </td>
                          <td className="border px-2 py-1">
                            ${reserva.senas_consolidadas}
                          </td>
                          <td className="border px-2 py-1">
                            ${reserva.monto_deuda}
                          </td>
                          <td className="border px-2 py-1">
                            {reserva.total_reservas}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {busquedaRealizada &&
                    resultados.length === 0 &&
                    !isLoading && (
                      <div className="alert alert-warning text-center mt-3">
                        No se encontraron reservas con los filtros
                        seleccionados.
                      </div>
                    )}
                  {/* Paginación */}
                  {totalPaginas > 1 && (
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
export default Recaudacion;
