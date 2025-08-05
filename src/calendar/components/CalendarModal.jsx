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
import { InputCliente } from "./Components Modal/Cliente/InputCliente";
import { ListaCliente } from "./Components Modal/Cliente/ListaCliente";
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

    callback(opcionesFiltradas);
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
  // useEffect(() => {
  //   if (activeEvent && activeEvent.cancha) {
  //     obtenerHorarios(activeEvent.cancha, activeEvent.hora);
  //   }
  // }, [activeEvent]);
  useEffect(() => {
    if (isDateModalOpen && formValues.cancha) {
      obtenerHorarios(formValues.cancha, formValues.hora);
    }
  }, [isDateModalOpen]);
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
   * PARA LA MODIFCACION: TRAIGO LOS HORARIOS DISPONIBLES, INCLUSO LA HORA DE LA RESERVA SELECCIONADA
   */
  const obtenerHorarios = async (canchaSeleccionada, horarioActual = null) => {
    try {
      let fechaReferencia = date;

      // Si no hay date (modo edición probablemente), tratamos de usar el de activeEvent
      if (!fechaReferencia && activeEvent && activeEvent.start) {
        fechaReferencia = activeEvent.start;
      }

      // Validamos si tenemos una fecha final
      if (!fechaReferencia) {
        console.warn("Fecha no proporcionada ni al crear ni al editar");
        return;
      }

      const fechaISO = new Date(fechaReferencia).toISOString();
      console.log({
        fecha: fechaISO,
        cancha: canchaSeleccionada,
        reservaId: activeEvent?.id || null,
      });
      const { data } = await calendarApi.post("/reserva/horarios-disponibles", {
        fecha: fechaISO,
        cancha: canchaSeleccionada,
        reservaId: activeEvent?.id || null,
      });
      console.log({
        fecha: fechaISO,
        cancha: canchaSeleccionada,
        reservaId: activeEvent?.id || null,
      });

      if (data.ok) {
        // setHorariosDisponibles(data.horasDisponibles);// guardo las horas
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
    if (activeEvent) {
      let monto = 0;

      switch (activeEvent.estado_pago) {
        case "TOTAL":
          monto = activeEvent.monto_cancha || 0;

          break;
        case "SEÑA":
          monto = activeEvent.monto_sena || 0;

          break;
        case "IMPAGO":
        default:
          monto = 0;
      }

      let fechaParsed = new Date(activeEvent.start);
      // Si la fecha no es válida, formateamos manualmente
      if (isNaN(fechaParsed.getTime())) {
        const dateString = new Date(activeEvent.start).toLocaleDateString(
          "es-AR",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );

        fechaParsed = new Date();
      }
      setFormValues({
        ...activeEvent,
        fecha: fechaParsed,
        cliente: {
          value: activeEvent.id,
          label:
            activeEvent.cliente +
            "-" +
            activeEvent.apellidoCliente +
            " " +
            activeEvent.nombreCliente,
        },
        hora: activeEvent.hora || "",
        monto,
      });

      setDni(activeEvent.cliente);
    }
  }, [activeEvent]);
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
      // Cuando se cierra, limpiamos
      setFormValues({
        title: "",
        start: "",
        end: "",
        cancha: "",
        fecha: date || "",
        hora: "",
        forma_pago: "",
        estado_pago: "",
        observacion: "",
        cliente: "",
        monto_cancha: "",
        monto_sena: "",
      });
      return;
    }

    // Cuando se abre: si hay evento activo, es edición
    if (isDateModalOpen && activeEvent) {
      const fechaParsed = new Date(activeEvent.start);
      const clienteValue = {
        value: activeEvent.id,
        label: `${activeEvent.cliente}-${activeEvent.apellidoCliente} ${activeEvent.nombreCliente}`,
      };

      let monto = 0;
      switch (activeEvent.estado_pago) {
        case "TOTAL":
          monto = activeEvent.monto_cancha || 0;
          break;
        case "SEÑA":
          monto = activeEvent.monto_sena || 0;
          break;
        default:
          monto = 0;
      }

      setFormValues({
        ...activeEvent,
        fecha: isNaN(fechaParsed.getTime()) ? new Date() : fechaParsed,
        cliente: clienteValue,
        hora: activeEvent.hora || "",
        monto,
      });
      setDni(activeEvent.cliente); // para el envío correcto
    }
  }, [isDateModalOpen, activeEvent]);

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
              obtenerHorarios(nuevaCancha, formValues.hora);
              // obtenerHorarios(nuevaCancha);
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
