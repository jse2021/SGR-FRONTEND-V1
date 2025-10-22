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
import { convertEventsToDateEvents, sanitizeReservaUpdate } from "../helpers";
import { useState } from "react";
import Swal from "sweetalert2";

/**
 * DE ACA LLEGAMOS AL BACKEN Y RELIZAMOS LOS PROCESOS
 */
export const useCalendarStore = () => {
  const { events, activeEvent } = useSelector((state) => state.calendar); //Estado actual de calendario
  const { user } = useSelector((state) => state.auth); //estado actual de user
  const dispatch = useDispatch();
  //_----------------------------------------------------------------------------------------------
  /**
   * Guarda en Redux cuál es la reserva seleccionada (por ejemplo, para editarla o borrarla).
   */

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };
  //_----------------------------------------------------------------------------------------------
  /**
   *  PROCESO DE GRABACION DEL EVENTO
   * Una sola funcion para crear y editar
   * si tiene ID editamos, si no tiene, creamos
   */
  const startSavingEvent = async (calendarEvent) => {
    try {
      if (calendarEvent.id) {
        if (!calendarEvent.fecha && calendarEvent.fechaCopia) {
          calendarEvent.fecha = calendarEvent.fechaCopia;
        }

        const payload = sanitizeReservaUpdate(calendarEvent);

        const { data } = await calendarApi.put(
          `/reserva/${calendarEvent.id}`,
          payload
        );

        const [eventoActualizado] = convertEventsToDateEvents([data.reserva]);
        dispatch(
          onUpdateEvent({ ...calendarEvent, ...eventoActualizado, user })
        );

        Swal.fire({
          icon: "success",
          title: "Reserva modificada",
          showConfirmButton: false,
          timer: 1000,
        });
        return;
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
        console.log({ reservaConMontos });

        //-----> Guardo y actualizo store

        const { data } = await calendarApi.post("/reserva", reservaConMontos);

        // Convertimos el evento antes de guardar en store

        dispatch(
          onAddNewEvent({ ...reservaConMontos, user, id: data.reserva.id })
        );

        Swal.fire({
          icon: "success",
          title: "Reserva registrada",
          showConfirmButton: false,
          timer: 600,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  //_----------------------------------------------------------------------------------------------
  /**
   * PROCESO DE ELIMINACION DE RESERVA
   */

  const startDeletingEvent = async () => {
    try {
      // await calendarApi.delete(`/reserva/${activeEvent.id}`); ANULO, ACTUALIZO NO ELIMINO
      await calendarApi.put(`/reserva/eliminar/${activeEvent.id}`);
      // Todo: Llegar al backend
      dispatch(onDeleteEvent());
      Swal.fire({
        icon: "success",
        title: "Reserva eliminada",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error({ error });
    }
  };
  //_----------------------------------------------------------------------------------------------
  /**
   * TRAIGO LOS EVENTOS DEL BACKEND PARA MOSTRAR EN PANTALLA
   * tiene que ser llamado en calendarPage
   */
  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get("/reserva");

      // const events = convertEventsToDateEvents(data.reservas);
      const eventosActivos = data.reservas.filter(
        (r) => r.estado === "activo" || !r.estado
      );
      const events = convertEventsToDateEvents(eventosActivos);

      dispatch(onLoadEvents(events));
    } catch (error) {
      console.error({ error });
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
