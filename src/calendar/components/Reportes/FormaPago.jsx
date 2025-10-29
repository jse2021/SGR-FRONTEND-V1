import React, { useState } from "react";
import { Navbar } from "../Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calendarApi } from "../../../api";

/** Utiles de presentación */
const fmtFecha = (raw) => {
  const d = raw ? new Date(raw) : null;
  return d && !isNaN(d) ? d.toLocaleDateString("es-AR") : "-";
};
const fmtCliente = (r) =>
  [r?.apellidoCliente, r?.nombreCliente].filter(Boolean).join(" ") ||
  (r?.cliente ?? "-");
const fmtCancha = (r) => r?.cancha || (r?.canchaId ? `${r.title}` : "-");

/** Normaliza strings tipo “DÉBITO” -> “DEBITO” */
const sinTildes = (s = "") =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

export const FormaPago = () => {
  /** Filtros */
  const [form, setForm] = useState({
    fecha: null,
    cancha: "",
    forma_pago: "",
    estado_pago: "",
  });

  /** Resultados + paginación */
  const [resultados, setResultados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totales, setTotales] = useState({
    monto_cancha: 0,
    monto_sena: 0,
    monto_deuda: 0,
    total: 0,
  });

  /** Canchas (desde /configuracion) */
  const loadCanchas = async () => {
    try {
      const { data } = await calendarApi.get("/configuracion");
      return (data?.canchasPrecio || []).map((c) => ({
        label: c.nombre,
        value: c.nombre,
      }));
    } catch (e) {
      console.error("Error al cargar canchas", e);
      return [];
    }
  };

  /** Constantes UI */
  const formasPago = [
    { label: "EFECTIVO", value: "EFECTIVO" },
    { label: "TRANSFERENCIA", value: "TRANSFERENCIA" },
    { label: "DEBITO", value: "DEBITO" },
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

  /** Lógica principal: fetch con paginación */
  const fetchResultados = async (pagina = 1) => {
    const { fecha, cancha, forma_pago, estado_pago } = form;

    // 1) Validaciones mínimas
    if (!fecha || !cancha || !forma_pago || !estado_pago) {
      Swal.fire("Atención", "Hay campos incompletos", "warning");
      return;
    }

    setIsLoading(true);

    // 2) Fecha a YYYY-MM-DD
    const f = new Date(fecha);
    const y = f.getFullYear();
    const m = String(f.getMonth() + 1).padStart(2, "0");
    const d = String(f.getDate()).padStart(2, "0");
    const fechaYMD = `${y}-${m}-${d}`;

    // 3) Normalizaciones
    const canchaParam = encodeURIComponent(cancha || "TODAS"); 
    const formaParam = sinTildes(forma_pago || "TODAS"); 
    const estadoParam = sinTildes(estado_pago || "TODAS");

    // 4) URL (ruta acordada con backend)
    const base = "/reserva/recaudacionFP";
    const url = `${base}/${fechaYMD}/${canchaParam}/${formaParam}/${estadoParam}?page=${pagina}&limit=2`;

    try {
      const { data } = await calendarApi.get(url);

      // Estructura esperada del backend
      const reservas = Array.isArray(data?.reservas) ? data.reservas : [];
      const page = Number(data?.page ?? 1);
      const pages = Number(data?.pages ?? 1);

      setResultados(reservas);
      console.log(reservas)
      setPaginaActual(page);
      setTotalPaginas(pages);
      setTotales(
        data?.totales || { monto_cancha: 0, monto_sena: 0, monto_deuda: 0, total: 0 }
      );
      setBusquedaRealizada(true);
    } catch (error) {
      console.error("Error al buscar reservas", error);
      if (error?.response?.status === 404) {
        // Búsqueda válida sin resultados
        setResultados([]);
        setPaginaActual(1);
        setTotalPaginas(1);
        setBusquedaRealizada(true);
      } else {
        Swal.fire("Error", "No se pudo obtener el reporte", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /** Buscar (primera página) */
  const handleBuscar = async (e) => {
    e.preventDefault();
    await fetchResultados(1);
  };

  /** Paginación */
  const handlePageChange = async (pagina) => {
    await fetchResultados(pagina);
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
      <h1 className="text-center my-4 mt-5">Control Formas de Pago</h1>

      <div className="col-md-8 login-form-3 mx-auto">
        <form>
          <div className="row align-items-end g-2">
            {/* Fecha */}
            <div className="col-md-3">
              <DatePicker
                className="form-control w-100"
                selected={form.fecha}
                onChange={(date) => setForm((p) => ({ ...p, fecha: date }))}
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
                defaultOptions
                placeholder="Cancha"
                value={form.cancha ? { label: form.cancha, value: form.cancha } : null}
                onChange={(opt) =>
                  setForm((p) => ({ ...p, cancha: opt?.value || "" }))
                }
              />
            </div>

            {/* Forma de pago */}
            <div className="col-md-3">
              <Select
                classNamePrefix="react-select"
                className="w-100"
                options={formasPago}
                placeholder="Forma de pago"
                value={formasPago.find((o) => o.value === form.forma_pago) || null}
                onChange={(o) => setForm((p) => ({ ...p, forma_pago: o?.value || "" }))}
              />
            </div>

            {/* Estado de pago */}
            <div className="col-md-3">
              <Select
                classNamePrefix="react-select"
                className="w-100"
                options={estadosPago}
                placeholder="Estado de pago"
                value={estadosPago.find((o) => o.value === form.estado_pago) || null}
                onChange={(o) => setForm((p) => ({ ...p, estado_pago: o?.value || "" }))}
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <input
              type="button"
              className="btn btn-dark px-5 py-2 rounded-pill"
              value={isLoading ? "Buscando..." : "Buscar"}
              disabled={isLoading}
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
                    <tr>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Cancha</th>
                      <th>Forma de Pago</th>
                      <th>Estado de Pago</th>
                      <th>Total</th>
                      <th>Seña</th>
                      <th>Usuario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((r) => (
                      <tr key={r.id}>
                        <td>{fmtFecha(r.fechaCopia || r.fecha || r.start)}</td>
                        <td>{fmtCliente(r)}</td>
                      <td>{typeof r.cancha === "string" ? r.cancha : r.cancha?.nombre || ""}</td>

                        <td>{r.forma_pago ?? "-"}</td>
                        <td>{r.estado_pago ?? "-"}</td>
                        <td>
                          ${Number(r.monto_cancha || 0).toLocaleString("es-AR")}
                        </td>
                        <td>
                          ${Number(r.monto_sena || 0).toLocaleString("es-AR")}
                        </td>
                        <td>{r.user ?? r.usuario ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totales (si vienen) */}
                <div className="d-flex gap-3 justify-content-end mb-2 px-2">
                  <span>
                    <strong>Total:</strong>{" "}
                    ${Number(totales.total || 0).toLocaleString("es-AR")}
                  </span>
                  <span>
                    <strong>Seña:</strong>{" "}
                    ${Number(totales.monto_sena || 0).toLocaleString("es-AR")}
                  </span>
                  <span>
                    <strong>Deuda:</strong>{" "}
                    ${Number(totales.monto_deuda || 0).toLocaleString("es-AR")}
                  </span>
                </div>

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

                <button className="btn btn-danger mb-3 ms-2" onClick={exportarPDF}>
                  Exportar a PDF
                </button>
              </>
            ) : (
              <div className="text-center m-0">
                No se encontraron reservas con los filtros seleccionados.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
