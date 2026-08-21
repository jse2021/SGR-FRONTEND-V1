import { useMemo, useState, useEffect, useRef } from "react";
import { useReservaStore } from "../../hooks";
import { addHours, differenceInSeconds } from "date-fns";
import moment from "moment";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import AsyncSelect from "react-select/async";
import Modal from "react-modal";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { useCalendarStore, useUiStore } from "../../hooks";
import { calendarApi } from "../../api";
import "../../calendar/components/CalendarModal.css";

registerLocale("es", es);

const customStyles = {
  content: {
    position: "absolute",
    top: "5%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: "600px", // Ensanchado para la nueva grilla visual
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #ccc",
    background: "#fff",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1000,
  },
};

Modal.setAppElement("#root");

export const CalendarModal = ({ date, cliente }) => {
  const { isDateModalOpen, closeDateModal } = useUiStore();
  const { activeEvent, startSavingEvent, setActiveEvent, startLoadingEvents } =
    useCalendarStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [cancha, setCancha] = useState([]);
  const [results, setResults] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [dni, setDni] = useState("");

  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --------------------------NUEVO METODO--->
  function normalizeFromEvent(evt, canchasList = []) {
    const rawDate = evt?.fechaCopia || evt?.fecha || evt?.start;
    let fecha = new Date(rawDate);
    if (isNaN(fecha.getTime())) fecha = new Date();

    const dniStr = typeof evt?.cliente === "object"
      ? (evt?.cliente?.dni ?? evt?._cliente?.dni ?? "")
      : (evt?.cliente ?? "");

    let canchaStr = typeof evt?.cancha === "object"
      ? (evt?.cancha?.nombre ?? "")
      : (evt?.cancha ?? "");

    if (!canchaStr) canchaStr = evt?.title ?? "";

    if (!canchaStr && evt?.canchaId && Array.isArray(canchasList)) {
      const found = canchasList.find(c => Number(c.id) === Number(evt.canchaId));
      if (found) canchaStr = found.nombre;
    }

    const horaStr = String(evt?.hora ?? "").padStart(5, "0");

    let monto = 0;
    switch (evt?.estado_pago) {
      case "TOTAL": monto = evt?.monto_cancha || 0; break;
      case "SEÑA":  monto = evt?.monto_sena   || 0; break;
      default:      monto = 0;
    }
    return { fecha, dniStr, canchaStr, horaStr, monto };
  }

  useEffect(() => {
    const buscarCliente = async () => {
      const { data } = await calendarApi.get("/cliente");
      cliente = Array.from(data.clientes);
      const opciones = cliente.map((clientes) => ({
        value: clientes.dni,
        label: `${clientes.dni} - ${clientes.apellido} ${clientes.nombre}`,
      }));
      setOpciones(opciones);
    };
    buscarCliente();
  }, []);

  const loadOptions = (searchValue, callback) => {
    const opcionesFiltradas = opciones.filter((opcion) =>
      opcion.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
    );
    callback(opcionesFiltradas);
  };

  async function fetchData() {
    const { data } = await calendarApi.get("/configuracion");
    if (data.canchasPrecio instanceof Array) {
      setCancha(
        data.canchasPrecio.map((cancha) => {
          return { id: cancha.id, nombre: cancha.nombre };
        })
      );
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const [formValues, setFormValues] = useState({
    title: "",
    start: "",
    end: "",
    cancha: "",
    fecha: date,
    hora: "",
    forma_pago: "",
    estado_pago: "",
    observacion: "",
    cliente: "",
    monto_cancha: "",
    monto_sena: "",
    frecuencia: "NINGUNA",
    fechaFin: null,
  });

  const [pagosList, setPagosList] = useState([{ forma_pago: "", monto: "" }]);

  const handleAddPago = () => {
    setPagosList([...pagosList, { forma_pago: "", monto: "" }]);
  };

  const handleRemovePago = (index) => {
    const newPagos = [...pagosList];
    newPagos.splice(index, 1);
    setPagosList(newPagos);
  };

  const handlePagoChange = (index, field, value) => {
    const newPagos = [...pagosList];
    newPagos[index][field] = value;
    setPagosList(newPagos);
  };

  useEffect(() => {
    if (pagosList.length === 1 && formValues.monto !== undefined) {
      setPagosList([{ ...pagosList[0], monto: formValues.monto }]);
    }
  }, [formValues.monto]);

  useEffect(() => {
    if (isDateModalOpen && activeEvent && activeEvent.cancha && activeEvent.hora) {
      obtenerHorarios(activeEvent.cancha, activeEvent.hora);
    }
  }, [isDateModalOpen]);

  const obtenerHorarios = async (canchaSeleccionada, horarioActual = null) => {
    try {
      let fechaCruda = formValues.fecha || formValues.start || activeEvent?.start || date;
      const d = new Date(fechaCruda);
      const fechaYMD = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`;

      const { data } = await calendarApi.post("/reserva/horarios-disponibles", {
        fecha: fechaYMD,
        cancha: canchaSeleccionada,
        reservaId: activeEvent?.id ?? undefined,
      });

      if (data.ok) {
        let horarios = data.horasDisponibles;
        if (horarioActual && !horarios.includes(horarioActual)) {
          horarios = [...horarios, horarioActual].sort();
        }
        setHorariosDisponibles(horarios);
      } else {
        Swal.fire("Error", "No se pudieron obtener los horarios disponibles", "error");
      }
    } catch (err) {
      console.error("Error al obtener horarios:", err);
      Swal.fire("Error", "Error al obtener horarios disponibles", "error");
    }
  };

  useEffect(() => {
    const obtenerMonto = async () => {
      if (formValues.cancha && formValues.fecha && formValues.estado_pago) {
        try {
          const { data } = await calendarApi.post("/reserva/obtener-monto", {
            cancha: formValues.cancha,
            fecha: formValues.fecha,
            estado_pago: formValues.estado_pago,
          });

          let monto_cancha = 0;
          let monto_sena = 0;

          switch (formValues.estado_pago) {
            case "TOTAL":
              monto_cancha = data.monto_cancha;
              monto_sena = 0;
              break;
            case "SEÑA":
              monto_cancha = data.monto_cancha;
              monto_sena = data.monto_sena;
              break;
            case "IMPAGO":
              monto_cancha = 0;
              monto_sena = 0;
              break;
            default:
              break;
          }

          setFormValues((prev) => ({ ...prev, monto_cancha, monto_sena }));
        } catch (error) {
          console.error("Error al obtener monto:", error);
        }
      }
    };

    if (!activeEvent) {
      obtenerMonto();
    }
  }, [formValues.cancha, formValues.fecha, formValues.estado_pago]);

  const onClienteChanged = ({ target }, value) => {
    if (value && value.value) {
      setDni(value.value);
    }
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  useEffect(() => {
    if (!isDateModalOpen || !activeEvent) return;

    const { fecha, dniStr, canchaStr, horaStr, monto } =
      normalizeFromEvent(activeEvent, cancha);

    const clienteValue = {
      value: dniStr,
      label: `${dniStr}-${activeEvent?.apellidoCliente ?? ""} ${activeEvent?.nombreCliente ?? ""}`.trim(),
    };

    setFormValues(prev => ({
      ...prev,
      ...activeEvent,
      fecha,
      cliente: clienteValue,
      cancha: canchaStr,
      hora: horaStr,
      monto,
      frecuencia: activeEvent.frecuencia || "NINGUNA",
      fechaFin: activeEvent.fechaFin ? new Date(activeEvent.fechaFin) : null,
    }));

    setDni(dniStr);

    if (activeEvent.pagos && activeEvent.pagos.length > 0) {
      const pagosOriginales = activeEvent.pagos.map(p => ({
        forma_pago: p.forma_pago,
        monto: Number(p.monto)
      }));
      setPagosList(pagosOriginales);
    } else {
      const formaPagoVieja = activeEvent.forma_pago || "";
      const metodosValidos = ["TARJETA", "DEBITO", "EFECTIVO", "TRANSFERENCIA"];
      
      if (metodosValidos.includes(formaPagoVieja)) {
        setPagosList([{ forma_pago: formaPagoVieja, monto: monto }]);
      } else {
        setPagosList([{ forma_pago: "", monto: monto }]);
      }
    }

    if (canchaStr && !isNaN(fecha.getTime())) {
      obtenerHorarios(canchaStr, horaStr);
    }
  }, [isDateModalOpen, activeEvent, cancha]);

  const onInputChanged = async ({ target }) => {
    const { name, value } = target;
    const newFormValues = { ...formValues, [name]: value };

    if (name !== "fecha" && formValues.fecha instanceof Date) {
      newFormValues.fecha = formValues.fecha;
    }

    setFormValues(newFormValues);
    const { cancha, fecha, estado_pago } = newFormValues;

    if (cancha && estado_pago) {
      try {
        const { data } = await calendarApi.post("/reserva/obtener-monto", {
          cancha, estado_pago,
        });
        setFormValues((prev) => ({ ...prev, monto: data.monto }));
      } catch (error) {
        console.error("Error al obtener monto:", error);
      }
    }
  };

  useEffect(() => {
    setIsSubmitting(false);
  }, [date]);

  const onCloseModal = async () => {
    closeDateModal();
    setActiveEvent(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (
      !formValues.cliente ||
      !formValues.cancha ||
      !formValues.hora ||
      !formValues.estado_pago
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor, completá todos los campos base antes de guardar (asegúrate de seleccionar un Cliente).",
      });
    }

    const frecuenciaSeleccionADA = formValues.frecuencia || "NINGUNA";

    if (frecuenciaSeleccionADA !== "NINGUNA" && !formValues.fechaFin) {
      return Swal.fire(
        "Fecha requerida",
        "Por favor selecciona hasta qué fecha se repetirá el turno fijo",
        "warning"
      );
    }

    let fechaFinYMD = null;
    if (formValues.fechaFin) {
      const f = new Date(formValues.fechaFin);
      const y = f.getFullYear();
      const m = String(f.getMonth() + 1).padStart(2, "0");
      const d = String(f.getDate()).padStart(2, "0");
      fechaFinYMD = `${y}-${m}-${d}`;
    }

    if (formValues.estado_pago !== "IMPAGO") {
      const pagosInvalidos = pagosList.some((p) => Number(p.monto) <= 0);
      if (pagosInvalidos) {
        return Swal.fire({
          icon: "warning",
          title: "Monto inválido",
          text: "Ningún pago parcial puede ser de $0 o tener valores negativos.",
        });
      }

      const sumaPagos = pagosList.reduce((acc, p) => acc + Number(p.monto || 0), 0);
      if (sumaPagos !== Number(formValues.monto)) {
        return Swal.fire({
          icon: "warning",
          title: "Montos no coinciden",
          text: `El total a cobrar es $${formValues.monto}, pero tus pagos suman $${sumaPagos}.`,
        });
      }

      const pagosIncompletos = pagosList.some((p) => p.forma_pago === "");
      if (pagosIncompletos) {
        return Swal.fire({
          icon: "warning",
          title: "Forma de pago faltante",
          text: "Por favor selecciona la forma de pago en todas las filas agregadas.",
        });
      }
    }

    setIsSubmitting(true);
    setFormSubmitted(true);

    const formaPagoResumen = pagosList.map((p) => p.forma_pago).join(" + ") || "IMPAGO";

    const exito = await startSavingEvent({
      ...formValues,
      fecha: date,
      cliente: dni,
      pagos: pagosList,
      forma_pago: formaPagoResumen,
      frecuencia: frecuenciaSeleccionADA,
      fechaFin: fechaFinYMD,             
    });

    if (exito) {
      setActiveEvent(null);
      setDni("");
      setPagosList([{ forma_pago: "", monto: "" }]);
      closeDateModal();
    }

    setIsSubmitting(false);
    setFormSubmitted(false);
  };

  useEffect(() => {
    if (!isDateModalOpen) {
      setFormValues({
        title: "",
        start: "",
        end: "",
        cancha: "",
        fecha: "",
        hora: "",
        forma_pago: "",
        estado_pago: "",
        observacion: "",
        cliente: "",
        monto_cancha: "",
        monto_sena: "",
        frecuencia: "NINGUNA",
        fechaFin: null,
      });
      setPagosList([{ forma_pago: "", monto: "" }]);
    }
  }, [isDateModalOpen]);

  useEffect(() => {
    if (isDateModalOpen) {
      setIsSubmitting(false);
    }
  }, [isDateModalOpen]);

  return (
    <Modal
      isOpen={isDateModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h1 className="display-6" id="titulo">Gestión de la Reserva</h1>
      <hr />
      <form className="container px-1" onSubmit={onSubmit}>
        <div className="form-group mb-3">
          <label className="form-label fw-bold text-secondary small mb-1">Cliente</label>
          <AsyncSelect
            className="select-option"
            name="cliente"
            placeholder="Buscar Cliente por DNI o Nombre..."
            loadOptions={loadOptions}
            defaultOptions
            value={formValues.cliente}
            isDisabled={!!activeEvent}
            onChange={(value) => onClienteChanged({ target: { name: "cliente", value: value } }, value)}
          />
        </div>

        <div className="d-flex gap-2 mb-3">
          <div className="w-50">
            <label className="form-label fw-bold text-secondary small mb-1">Cancha</label>
            <select
              className="form-select shadow-sm"
              name="cancha"
              value={formValues.cancha}
              onChange={(event) => {
                const nuevaCancha = event.target.value;
                setFormValues((prev) => ({ ...prev, cancha: nuevaCancha }));
                setHorariosDisponibles([]);
                obtenerHorarios(nuevaCancha);
              }}
            >
              <option value="" disabled>Seleccionar Cancha</option>
              {cancha && cancha.length > 0 && cancha.map((c) => (
                <option key={c.id} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="w-50">
            <label className="form-label fw-bold text-secondary small mb-1">Horario</label>
            <select
              className="form-select shadow-sm"
              name="hora"
              value={formValues.hora || ""}
              onChange={(e) => setFormValues((prev) => ({ ...prev, hora: e.target.value }))}
            >
              <option value="" disabled>Seleccionar Horario</option>
              {horariosDisponibles.map((hora, index) => (
                <option key={index} value={hora}>{hora} hs</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group mb-3">
          <label className="form-label fw-bold text-secondary small mb-1">Estado del Pago</label>
          <select
            className="form-select shadow-sm"
            name="estado_pago"
            value={formValues.estado_pago}
            onChange={onInputChanged}
          >
            <option value="" disabled>Seleccione Estado de Pago</option>
            <option value="TOTAL">TOTAL (Pago Completo)</option>
            <option value="SEÑA">SEÑA (Pago Parcial)</option>
            <option value="IMPAGO">IMPAGO (A pagar en cancha)</option>
          </select>
        </div>

        <div className="form-group mb-3 p-3 bg-light rounded border shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <span className="fw-bold text-dark">Total a Cobrar Esperado:</span>
            <span className="badge bg-success fs-6 px-3 py-2">${formValues.monto || 0}</span>
          </div>

          {pagosList.map((pago, index) => (
            <div key={index} className="d-flex gap-2 mb-2 align-items-center">
              <div className="input-group input-group-sm" style={{ flex: "1 1 45%" }}>
                <span className="input-group-text bg-white fw-bold">$</span>
                <input
                  type="number"
                  placeholder="Monto"
                  className="form-control"
                  value={pago.monto}
                  onChange={(e) => handlePagoChange(index, "monto", e.target.value)}
                  disabled={formValues.estado_pago === "IMPAGO"}
                />
              </div>

              <select
                className="form-select form-select-sm"
                style={{ flex: "1 1 45%" }}
                value={pago.forma_pago}
                onChange={(e) => handlePagoChange(index, "forma_pago", e.target.value)}
                disabled={formValues.estado_pago === "IMPAGO"}
              >
                <option value="" disabled>Método</option>
                <option value="TARJETA">TARJETA</option>
                <option value="DEBITO">DEBITO</option>
                <option value="EFECTIVO">EFECTIVO</option>
                <option value="TRANSFERENCIA">TRANSFERENCIA</option>
              </select>

              {pagosList.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger fw-bold"
                  style={{ flex: "0 0 38px" }}
                  onClick={() => handleRemovePago(index)}
                  title="Eliminar fila"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {formValues.estado_pago !== "IMPAGO" && (
            <div className="text-end mt-2">
              <button type="button" className="btn btn-sm btn-outline-dark fw-bold" onClick={handleAddPago}>
                + Agregar método de pago
              </button>
            </div>
          )}
        </div>

        <div className="form-group mb-3 p-3 bg-light rounded border shadow-sm">
          <label className="form-label fw-bold text-dark d-block mb-1">📅 Tipo de Reserva</label>
          <select
            className="form-select form-select-sm mb-2"
            name="frecuencia"
            value={formValues.frecuencia || "NINGUNA"}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                frecuencia: e.target.value,
                fechaFin: e.target.value === "NINGUNA" ? null : prev.fechaFin,
              }))
            }
          >
            <option value="NINGUNA">Reserva Simple (Una sola fecha)</option>
            <option value="SEMANAL">Turno Fijo - Semanal (Cada 7 días)</option>
            <option value="QUINCENAL">Turno Fijo - Quincenal (Cada 14 días)</option>
            <option value="MENSUAL">Turno Fijo - Mensual (Cada mes)</option>
          </select>

          {formValues.frecuencia && formValues.frecuencia !== "NINGUNA" && (
            <div className="mt-2">
              <label className="form-label text-muted small fw-bold mb-1">Repetir hasta la fecha:</label>
              <DatePicker
                selected={formValues.fechaFin}
                onChange={(date) => setFormValues((prev) => ({ ...prev, fechaFin: date }))}
                dateFormat="dd/MM/yyyy"
                className="form-control form-control-sm w-100"
                placeholderText="Seleccionar fecha límite"
                locale="es"
                minDate={new Date()}
              />
              <small className="text-info d-block mt-1">💡 Se crearán automáticamente las reservas hasta esta fecha.</small>
            </div>
          )}
        </div>

        <div className="form-group mb-3">
          <label className="form-label fw-bold text-secondary small mb-1">Observaciones</label>
          <textarea
            className="form-control shadow-sm"
            placeholder="Notas adicionales sobre la reserva..."
            id="ta-observaciones"
            rows="3"
            name="observacion"
            value={formValues.observacion}
            onChange={onInputChanged}
          ></textarea>
        </div>

        <hr className="my-3" />

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-secondary py-2 fw-bold shadow-sm" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Reserva"}
          </button>
        </div>
      </form>
    </Modal>
  );
};