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
    maxWidth: "500px",
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
  const [isSubmitting, setIsSubmitting] = useState(false); // manejo de boton guardar

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

  /**
   * TRABAJO CLIENTE PARA MANDARLO A ASYNCSELECT.
   */
  useEffect(() => {
    const buscarCliente = async () => {
      const { data } = await calendarApi.get("/cliente");

      cliente = Array.from(data.clientes);
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

    callback(opcionesFiltradas); ///----->Devuelve ese resultado al AsyncSelect para mostrarlo.
  };
  //_-------------------------------------------------------------------------------------

  /**
   * TRAIGO LAS CANCHAS QUE TIENEN PRECIO ASIGNADO, DIRECTAMENTE DESDE TABLA CONFIGURACION Y NO DE CANCHAS
   */
  async function fetchData() {
    const { data } = await calendarApi.get("/configuracion");
    if (data.canchasPrecio instanceof Array) {
      setCancha(
        data.canchasPrecio.map((cancha) => {
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
  //---------------------------------------------------------------------------------------
  /**
   * MANEJO DE INICIO DE FORMULARIO: RESETEA LOS CAMPOS CADA VEZ QUE ABRO MODAL
   */
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
  });

  //---------------------------------------------------------------------------------------
  /**
   * PASO PARAMETROS A LA FUNCION OBTENER_HORARIOS PARA QUE AL MOMENTO DE REALIZAR UNA ACTUALIZACION DE LA RESERVA,
   * EL MODAL MUESTRE EL HORARIO EXACTO DE LA RESERVA
   */
  useEffect(() => {
    if (
      isDateModalOpen &&
      activeEvent &&
      activeEvent.cancha &&
      activeEvent.hora
    ) {
      obtenerHorarios(activeEvent.cancha, activeEvent.hora);
    }
  }, [isDateModalOpen]);
  //_-------------------------------------------------------------------------------------
  /**
   * TRABAJO LOS HORARIOS:
   * PARA CREAR RESERVA: TRAIGO LOS HORARIOS DISPONIBLES
   * PARA LA MODIFICACION: TRAIGO LOS HORARIOS DISPONIBLES, INCLUSO LA HORA DE LA RESERVA SELECCIONADA
   */
  const obtenerHorarios = async (canchaSeleccionada, horarioActual = null) => {
    try {
      let fechaReferencia = date;

      // Si no hay date (modo edición), tratamos de usar el de activeEvent
      if (!fechaReferencia && activeEvent && activeEvent.start) {
        fechaReferencia = activeEvent.start;
      }

      // Validamos si tenemos una fecha final
      if (!fechaReferencia) {
        console.warn("Fecha no proporcionada ni al crear ni al editar");
        return;
      }

      let fechaCruda =
        formValues.fecha || formValues.start || activeEvent?.start;

      //usa la fecha actual si ninguna está seteada
      if (!fechaCruda) {
        fechaCruda = new Date();
        console.warn(
          "No se encontró fecha en formValues, se usa fecha actual:",
          fechaCruda
        );
      }

      const fechaBase = new Date(fechaCruda);
      if (isNaN(fechaBase)) {
        console.error("fechaBase no es válida:", fechaCruda);
        return;
      }

      fechaBase.setUTCHours(3, 0, 0, 0);
      const fechaFormateada = fechaBase.toISOString();

      const { data } = await calendarApi.post("/reserva/horarios-disponibles", {
        fecha: fechaFormateada,
        cancha: canchaSeleccionada,
        reservaId: activeEvent?.id || null,
      });

      if (data.ok) {
        let horarios = data.horasDisponibles;
        // Si estamos editando y el horario actual no está, lo agregamos
        if (horarioActual && !horarios.includes(horarioActual)) {
          horarios = [...horarios, horarioActual].sort(); // ordenado
        }

        setHorariosDisponibles(horarios);
      } else {
        Swal.fire(
          "Error",
          "No se pudieron obtener los horarios disponibles",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      Swal.fire("Error", "Error al obtener horarios disponibles", "error");
    }
  };
  //---------------------------------------------------------------------------------------
  /**
   * TRABAJO MONTOS: OBTENGO LOS MONTOS SEGUN CANCHA SELECCIONADA
   */
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

          setFormValues((prev) => ({
            ...prev,
            monto_cancha,
            monto_sena,
          }));
        } catch (error) {
          console.error("Error al obtener monto:", error);
        }
      }
    };

    if (!activeEvent) {
      obtenerMonto();
    }
  }, [formValues.cancha, formValues.fecha, formValues.estado_pago]);

  //---------------------------------------------------------------------------------------

  /**
   * MANEJO DE LOS INPUTCHANGED
   */

  //Seteo del cliente.  Para que quede seleccionado al enviar al backend
  const onClienteChanged = ({ target }, value) => {
    if (value && value.value) {
      setDni(value.value);
    }

    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };
  //_-------------------------------------------------------------------------------------
  /**
   * AL LEVANTAR NUEVAMENTE EL MODAL, TRAIGO EL CLIENTE COMO OBJETO (VALUE:LABEL)
   */
  useEffect(() => {
  if (!isDateModalOpen || !activeEvent) return;

  const { fecha, dniStr, canchaStr, horaStr, monto } =
    normalizeFromEvent(activeEvent, cancha /* tu array de canchas */);

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
  }));

  setDni(dniStr);

  if (canchaStr && !isNaN(fecha.getTime())) {
    // Usa la función que ya tienes para cargar horarios (ajusta el nombre si difiere)
    obtenerHorarios(canchaStr, horaStr);
    // o cargarHorasDisponibles({ fecha, cancha: canchaStr, reservaId: activeEvent?.id })
  }
}, [isDateModalOpen, activeEvent, cancha]);


  // useEffect(() => {
  //   if (!activeEvent) return;

  //   // monto según estado de pago
  //   let monto = 0;
  //   switch (activeEvent.estado_pago) {
  //     case "TOTAL":
  //       monto = activeEvent.monto_cancha || 0;
  //       break;
  //     case "SEÑA":
  //       monto = activeEvent.monto_sena || 0;
  //       break;
  //     case "IMPAGO":
  //     default:
  //       monto = 0;
  //   }

  //   // fecha defensiva (toma fechaCopia | fecha | start)
  //   const rawDate =
  //     activeEvent.fechaCopia || activeEvent.fecha || activeEvent.start;
  //   let fechaParsed = new Date(rawDate);
  //   if (isNaN(fechaParsed.getTime())) fechaParsed = new Date();

  //   // normalizo DNI y cancha a string (por si vienen como objeto)
  //   const dniStr =
  //     typeof activeEvent.cliente === "object"
  //       ? activeEvent.cliente?.dni ?? activeEvent._cliente?.dni ?? ""
  //       : activeEvent.cliente ?? "";

  //   let canchaStr =
  //     typeof activeEvent.cancha === "object"
  //       ? activeEvent.cancha?.nombre ?? ""
  //       : activeEvent.cancha ?? "";

  //   // Fallback: si no vino el nombre pero sí el id, resolvemos por el array "cancha"
  //   if (!canchaStr && activeEvent.canchaId && Array.isArray(cancha)) {
  //     const found = cancha.find(
  //       (c) => Number(c.id) === Number(activeEvent.canchaId)
  //     );
  //     if (found) canchaStr = found.nombre;
  //   }

  //   // el AsyncSelect de cliente espera { value, label } y value debe ser el DNI
  //   const clienteValue = {
  //     value: dniStr,
  //     label: `${dniStr}-${activeEvent.apellidoCliente ?? ""} ${
  //       activeEvent.nombreCliente ?? ""
  //     }`.trim(),
  //   };

  //   setFormValues({
  //     ...activeEvent,
  //     fecha: fechaParsed,
  //     cliente: clienteValue, // ← value = DNI (no id de reserva)
  //     cancha: canchaStr, // ← string (no objeto)
  //     hora: activeEvent.hora || "",
  //     monto,
  //   });

  //   setDni(dniStr); // ← guardo el DNI en string para el submit
  // }, [activeEvent, cancha]);

  //_-------------------------------------------------------------------------------------
  /*
   * MANEJO DEL CAMBIO DE ESTADO DE LOS COMPONENTES:TAMBIEN EL CAMBIO DE ESTADO DE ESTADO DE PAGO E INPUT MONTO
   */
  const onInputChanged = async ({ target }) => {
    const { name, value } = target;

    const newFormValues = {
      ...formValues,
      [name]: value,
    };
    // Si no se está modificando 'fecha', aseguramos que sigue siendo un objeto Date
    if (name !== "fecha" && formValues.fecha instanceof Date) {
      newFormValues.fecha = formValues.fecha;
    }

    setFormValues(newFormValues);

    const { cancha, fecha, estado_pago } = newFormValues;

    if (cancha && estado_pago) {
      try {
        const { data } = await calendarApi.post("/reserva/obtener-monto", {
          cancha,
          estado_pago,
        });

        setFormValues((prev) => ({
          ...prev,
          monto: data.monto,
        }));
      } catch (error) {
        console.error("Error al obtener monto:", error);
      }
    }
  };
  //---------------------------------------------------------------------------------------
  /**
   * MANEJO DEL BOTON GUARDAR: REINICIO BOTON GUARDAR
   */
  useEffect(() => {
    setIsSubmitting(false); // se reinicia cuando cambia la fecha
  }, [date]);

  //---------------------------------------------------------------------------------------
  /**
   * MANEJO DEL CIERRE DE MODAL
   */
  const onCloseModal = async () => {
    closeDateModal();
    setActiveEvent(null); //  limpiamos el evento activo
  };
  //---------------------------------------------------------------------------------------
  /**
   * TRABAJO ENVIO DE RESERVA AL BACKEND
   * Trabajo el manejo de error por cada elemento.
   */
  const onSubmit = async (event) => {
    event.preventDefault();

    if (
      formValues.cliente == "" ||
      formValues.cancha == "" ||
      formValues.hora == "" ||
      formValues.estado_pago == "" ||
      formValues.forma_pago == ""
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor, completá todos los campos antes de guardar.",
      });
    }

    setActiveEvent({
      title: "",
      start: "",
      end: "",
      // cliente: "",
      cliente: null,
      cancha: "",
      fecha: date,
      hora: "",
      forma_pago: "",
      estado_pago: "",
      observacion: "",
      monto_cancha: "",
      monto_sena: "",
    });
    setDni("");
    setActiveEvent(null);
    setIsSubmitting(true); // cuando estoy por mandar a backend, cambia estado de boton
    setFormSubmitted(true);
    const reservaGuardada = activeEvent;
    await startSavingEvent({ ...formValues, fecha: date, cliente: dni });
    closeDateModal();

    setFormSubmitted(false);
  };
  //---------------------------------------------------------------------------------------
  /**
   * EVITO QUE SE CARGUEN LOS DATOS ANTERIORES AL ABRIR NUEVAMENTE EL MODAL
   */

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
      });
      setDni("");
    }
  }, [isDateModalOpen]);
  // useEffect(() => {
  //   if (!isDateModalOpen || !activeEvent) return;

  //   // 1) monto
  //   let monto = 0;
  //   if (activeEvent.estado_pago === "TOTAL") {
  //     monto = Number(activeEvent.monto_cancha || 0);
  //   } else if (activeEvent.estado_pago === "SEÑA") {
  //     monto = Number(activeEvent.monto_sena || 0);
  //   }

  //   // 2) fecha defensiva (fechaCopia | fecha | start)
  //   const rawDate =
  //     activeEvent.fechaCopia || activeEvent.fecha || activeEvent.start;
  //   let fechaParsed = new Date(rawDate);
  //   if (isNaN(fechaParsed.getTime())) fechaParsed = new Date();

  //   // 3) ya vienen normalizados por mapToModal
  //   const dniStr = String(activeEvent.cliente ?? "");
  //   const canchaStr = String(activeEvent.cancha ?? "");

  //   // 4) setear form
  //   setFormValues({
  //     ...activeEvent,
  //     fecha: fechaParsed,
  //     cliente: {
  //       value: dniStr,
  //       label: `${dniStr}-${activeEvent.apellidoCliente ?? ""} ${
  //         activeEvent.nombreCliente ?? ""
  //       }`.trim(),
  //     },
  //     cancha: canchaStr,
  //     hora: activeEvent.hora || "",
  //     monto,
  //   });

  //   setDni(dniStr);

  //   // 5) horarios
  //   if (canchaStr) {
  //     obtenerHorarios(canchaStr, activeEvent.hora || null);
      
  //   }
  // }, [isDateModalOpen, activeEvent]);

  //---------------------------------------------------------------------------------------
  /**
   * MANEJO LA FECHA DEL CALENDARIO PRINCIPAL
   */
  const fechaReserva = new Date(date).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  //---------------------------------------------------------------------------------------
  /**
   * SOLUCION A INVALID DATE EN MODAL.
   */
  const getFechaFormateada = (fecha) => {
    if (!(fecha instanceof Date) || isNaN(fecha)) return "Fecha no válida";

    return fecha.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  useEffect(() => {
    if (isDateModalOpen) {
      setIsSubmitting(false); // Reinicia botón al abrir modal
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
      <h1 className="display-6" id="titulo">
        Gestión de la Reserva
      </h1>
      <hr />
      <form className="container" onSubmit={onSubmit}>
        <div className="form-group mb-2">
          <h5 style={{ textAlign: "center" }}>
            {/* {<h3>{getFechaFormateada(formValues.fecha)}</h3>} */}
          </h5>
        </div>
        <div className="form-group mb-2">
          <AsyncSelect
            className="select-option"
            name="cliente"
            placeholder="Buscar Cliente"
            loadOptions={loadOptions}
            defaultOptions
            value={formValues.cliente}
            isDisabled={!!activeEvent} //desactiva si es edición
            onChange={(value) =>
              onClienteChanged(
                { target: { name: "cliente", value: value } },
                value
              )
            }
          />
        </div>
        <div className="form-group mb-2">
          <select
            className="form-select"
            name="cancha"
            id="select-cancha"
            value={formValues.cancha}
            onChange={(event) => {
              const nuevaCancha = event.target.value;
              setFormValues((prev) => ({
                ...prev,
                cancha: nuevaCancha,
              }));

              setHorariosDisponibles([]); //Limpia los horarios anteriores

              //Llamada al backend.
              // obtenerHorarios(nuevaCancha, formValues.hora);
              obtenerHorarios(nuevaCancha);
            }}
          >
            <option key="0" value="" disabled>
              Selecciona una cancha
            </option>
            {cancha && cancha.length > 0
              ? cancha.map((cancha) => (
                  <option key={cancha.id} value={cancha.nombre}>
                    {cancha.nombre}
                  </option>
                ))
              : null}
          </select>
        </div>

        <div className="form-group mb-2">
          <select
            className="form-select"
            name="hora"
            id="select-hora"
            value={formValues.hora || ""}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                hora: e.target.value,
              }))
            }
          >
            <option key="0" value="" disabled>
              Seleccione horario
            </option>

            {horariosDisponibles.map((hora, index) => (
              <option key={index} value={hora}>
                {hora}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-2">
          <select
            className="form-select"
            name="estado_pago"
            id="select-ePago"
            value={formValues.estado_pago}
            onChange={onInputChanged}
          >
            <option key="0" value="" disabled>
              Seleccione estado de pago
            </option>
            <option value="TOTAL">TOTAL</option>
            <option value="SEÑA">SEÑA</option>
            <option value="IMPAGO">IMPAGO</option>
          </select>
        </div>

        <div className="form-group mb-2">
          <input
            type="number"
            name="monto"
            placeholder="Monto"
            id="input-monto"
            value={formValues.monto || ""}
            className="form-control"
            disabled // para no editar
          />

          <select
            className="form-select"
            name="forma_pago"
            id="select-fPago"
            value={formValues.forma_pago}
            onChange={onInputChanged}
          >
            <option key="0" value="" disabled>
              Forma de pago
            </option>
            <option value="TARJETA">TARJETA</option>
            <option value="DEBITO">DEBITO</option>
            <option value="EFECTIVO">EFECTIVO</option>
            <option value="TRANSFERENCIA">TRANSFERENCIA</option>
            <option value="SO">SIN OPERACION</option>
          </select>
        </div>

        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Observaciones"
            id="ta-observaciones"
            rows="5"
            name="observacion"
            value={formValues.observacion}
            onChange={onInputChanged}
          ></textarea>
        </div>
        <hr />
        <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar Reserva"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
