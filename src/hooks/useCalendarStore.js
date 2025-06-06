import { useDispatch, useSelector } from "react-redux";
import {
  onAddNewEvent,
  onDeleteEvent,
  onSetActiveEvent,
  onUpdateEvent,
  onLoadEvents,
  onLogin,
} from "../store";
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import { useState } from "react";
import Swal from "sweetalert2";

/**
 * DE ACA LLEGAMOS AL BACKEN Y RELIZAMOS LOS PROCESOS
 */
export const useCalendarStore = () => {
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  /**
   * TOMO LA INFO DEL STORE, Y DISPARO PARA TOMAR DEL CALENDAR PAGE
   */

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  /**
   *  PROCESO DE GRABACION DEL EVENTO: PREFIERO HACER EL CALCULO DESDE FRONT, Y NO DE BACKEND
   */
  const startSavingEvent = async (calendarEvent) => {
    try {
      // con este if evito que fecha vaya como null a la bd
      if (!calendarEvent.fecha && calendarEvent.fechaCopia) {
        calendarEvent.fecha = calendarEvent.fechaCopia;
      }

      if (calendarEvent.id) {
        const { data } = await calendarApi.put(
          `/reserva/${calendarEvent.id}`,
          calendarEvent
        );
        //Convertir fechas recibidas del backend para evitar Invalid Date
        const [eventoActualizado] = convertEventsToDateEvents([data.reserva]);
        console.log(">>> Antes del update:");
        console.log("Evento: ", eventoActualizado);
        console.log("req.body: ", calendarEvent);
        dispatch(onUpdateEvent({ ...calendarEvent, user }));

        Swal.fire({
          icon: "success",
          title: "Reserva modificada",
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        // Proceso de cálculo previo al envío
        let monto_cancha = 0;
        let monto_sena = 0;
        const montoBase = calendarEvent.monto || 0;

        switch (calendarEvent.estado_pago) {
          case "TOTAL":
            monto_cancha = montoBase;
            monto_sena = 0;
            break;

          case "SEÑA":
            monto_sena = Math.floor(montoBase / 2);
            monto_cancha = 0;
            break;

          case "IMPAGO":
          default:
            monto_sena = 0;
            monto_cancha = 0;
            break;
        }

        const reservaConMontos = {
          ...calendarEvent,
          monto_cancha,
          monto_sena,
        };
        console.log("store 2:", reservaConMontos);

        const { data } = await calendarApi.post("/reserva", reservaConMontos);
        // Convertimos el evento antes de guardar en store
        // const [nuevaReserva] = convertEventsToDateEvents([data.reserva]);
        dispatch(onAddNewEvent({ ...reservaConMontos, user, id: data._id }));

        Swal.fire({
          icon: "success",
          title: "Reserva registrada",
          showConfirmButton: false,
          timer: 600,
        });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  /**
   * PROCESO DE ELIMINACION DE RESERVA
   */
  const startDeletingEvent = async () => {
    try {
      console.log(
        "Debug eliminar: Elimino reserva. CalendarStore: ",
        activeEvent.id
      );
      await calendarApi.delete(`/reserva/${activeEvent.id}`);
      // Todo: Llegar al backend
      dispatch(onDeleteEvent());
      Swal.fire({
        icon: "success",
        title: "Reserva eliminada",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.log({ error });
    }
  };

  /**
   * TRAIGO LOS EVENTOS DEL BACKEND PARA MOSTRAR EN PANTALLA
   * tiene que ser llamado en calendarPage
   */
  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get("/reserva");
      const events = convertEventsToDateEvents(data.reservas);
      dispatch(onLoadEvents(events));
    } catch (error) {
      console.log("error cargando eventos");
      console.log({ error });
    }
  };

  return {
    //* Propiedades
    activeEvent,
    events,
    hasEventSelected: !!activeEvent,

    //* Métodos
    startDeletingEvent,
    setActiveEvent,
    startSavingEvent,
    startLoadingEvents,
  };
};
export default useCalendarStore;
