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
  const [isLoading, setIsLoading] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const estadosPago = [
    { label: "TOTAL", value: "TOTAL" },
    { label: "SEÑA", value: "SEÑA" },
    { label: "IMPAGO", value: "IMPAGO" },
  ];

  // helper local para formatear a YYYY-MM-DD
  const toYMD = (d) => {
    const f = new Date(d);
    const y = f.getFullYear();
    const m = String(f.getMonth() + 1).padStart(2, "0");
    const day = String(f.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  //**MANEJO POR SEPARADO PARA TRABAJAR LA PAGINACION */
  const fetchResultados = async (pagina = 1) => {
    // OJO: aquí usamos los mismos nombres que en el state
    const { estado_pago, fechaInicio, fechaFin } = form;

    // viste que antes salía "SEÑA undefined ..." ? era por esto :)
    // console.log(estado_pago, fechaInicio, fechaFin);

    // Validación mínima
    if (!estado_pago || !fechaInicio || !fechaFin) {
      Swal.fire("Atención", "Todos los campos son obligatorios", "warning");
      return;
    }

    setIsLoading(true);

    try {
      // Fechas a YYYY-MM-DD (lo que espera el backend)
      const fIni = toYMD(fechaInicio);
      const fFin = toYMD(fechaFin);

      // Importante: codificamos el estado por la Ñ de "SEÑA"
      const estadoURL = encodeURIComponent(estado_pago);

      const url = `reserva/estadoReservas/${estadoURL}/${fIni}/${fFin}?page=${pagina}&limit=5`;

      const { data } = await calendarApi.get(url);

      console.log(data);

      const reservas = Array.isArray(data?.reservas) ? data.reservas : [];
      const page = Number(data?.page ?? pagina);
      const pages = Number(data?.pages ?? 1);

      setResultados(reservas);
      setPaginaActual(page);
      setTotalPaginas(pages);
      setBusquedaRealizada(true);
    } catch (error) {
      console.error("Error al buscar reservas:", error);
      if (error?.response?.status === 404) {
        setResultados([]);
        setPaginaActual(1);
        setTotalPaginas(1);
        setBusquedaRealizada(true);
      } else {
        Swal.fire("Error", "No se pudieron obtener las reservas", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**IMPLEMENTO BUSCAR */
  const handleBuscar = (e) => {
    e.preventDefault();
    fetchResultados(1);
  };

  /**PARA LA PAGINACION */
  const handlePageChange = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      fetchResultados(nuevaPagina);
    }
  };

  /** Exportar a PDF (usa la tabla actual) */
  const exportarPDF = () => {
    if (!resultados.length) return;
    const doc = new jsPDF();
    doc.text("Reporte de Reservas (Formas de Pago)", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "Fecha",
          "Cliente",
          "Cancha",
          "Forma Pago",
          "Estado",
          "Total",
          "Seña",
          "Usuario",
        ],
      ],
      body: resultados.map((r) => [
        fmtFecha(r.fechaCopia || r.fecha || r.start),
        fmtCliente(r),
        typeof r.cancha === "string" ? r.cancha : r.cancha?.nombre || "",
        r.forma_pago ?? "-",
        r.estado_pago ?? "-",
        `$${Number(r.monto_cancha || 0).toLocaleString("es-AR")}`,
        `$${Number(r.monto_sena || 0).toLocaleString("es-AR")}`,
        r.user ?? r.usuario ?? "-",
      ]),
    });

    doc.save("reporte-reservas.pdf");
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
                            {new Date(
                              reserva.fechaCopia ||
                                reserva.fecha ||
                                reserva.start
                            ).toLocaleDateString("es-AR")}
                          </td>

                          <td className="border px-2 py-1">
                            {`${
                              reserva.cliente?.nombre ??
                              reserva.nombreCliente ??
                              ""
                            } ${
                              reserva.cliente?.apellido ??
                              reserva.apellidoCliente ??
                              ""
                            }`.trim() || "-"}
                          </td>

                          <td className="border px-2 py-1">
                            {reserva.cancha?.nombre ??
                              reserva.canchaNombre ??
                              reserva.cancha ??
                              "-"}
                          </td>

                          <td className="border px-2 py-1">
                            {reserva.estado_pago ?? reserva.estado ?? "-"}
                          </td>

                          <td className="border px-2 py-1">
                            $
                            {(reserva.estado_pago === "TOTAL"
                              ? Number(reserva.monto_cancha || 0)
                              : reserva.estado_pago === "SEÑA"
                              ? Number(reserva.monto_sena || 0)
                              : 0
                            ).toLocaleString("es-AR")}
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
