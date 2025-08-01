import { createContext, useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Navbar, CalendarModal, FabDelete } from "../";
import CalendarEvent from "../components/CalendarEvent";
import { localizer, getMessagesES } from "../../helpers";
import { useUiStore, useCalendarStore, useAuthStore } from "../../hooks";
import CustomToolbar from "./CustomToolbar";
import AgendaCustomEvent from "./AgendaCustomEvent";
import "./CalendarPage.css";

export const CalendarPage = () => {
  const { user } = useAuthStore();
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
  const { activeEvent } = useCalendarStore();
  const { isDateModalOpen, closeDateModal } = useUiStore();

  // PARA ALMACENAR LA VISTA EN EL STORAGE
  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "month"
  );
  const [date, setDate] = useState("");
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    window.addEventListener("clienteSeleccionado", (event) => {
      setCliente(event.detail);
    });
  }, []);

  useEffect(() => {
    if (!isDateModalOpen) {
      setCliente(null); //Limpieza segura cuando se cierra modal
    }
  }, [isDateModalOpen]);

  /**
   * DISEÑO DE LOS EVENTOS, "BOTON" DEL CALENDARIO
   */
  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = "#dd1212ff"; //
    if (event.estado_pago === "TOTAL") backgroundColor = "#28a745";
    else if (event.estado_pago === "SEÑA") backgroundColor = "#ffc107";
    const style = {
      backgroundColor,
      borderRadius: "8px",
      opacity: 0.9,
      color: "white",
      fontSize: "10px",
    };
    return {
      style,
    };
  };

  /**
   * DIA SELECCIONADO
   */
  const handleSelectSlot = (event) => {
    // setDate(event.start);
    // openDateModal();

    const selectedDate = new Date(event.start);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizamos a solo fecha

    // No permitir agregar reservas fechas pasadas
    if (selectedDate < today) {
      return; // Simplemente no hace nada si es fecha anterior
    }

    setDate(selectedDate);
    openDateModal();
  };

  /**
   * ABRE MODAL DE UNA RESERVA EN EL CALENDARIO
   */
  const onDoubleClick = (event) => {
    setActiveEvent(event);
    openDateModal();
  };

  /**
   * PARA ACTIVAR LA RESERVA SELECCIONADA
   */
  const onSelect = (event) => {
    setActiveEvent(event);
  };

  /**
   * CUANDO CAMBIA LA VISTA, SE ALMACENA EN EL STORAGE
   */
  const onViewChanged = (event) => {
    localStorage.setItem("lastView", event);
  };

  /**
   * LEVANTA TODOS LOS EVENTOS HACIA EL CALENDARIO
   */
  useEffect(() => {
    startLoadingEvents();
  }, [startLoadingEvents()]);

  return (
    <>
      <Navbar />
      <div className="calendar-wrapper">
        <Calendar
          culture="es"
          defaultView={lastView}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc( 100vh - 80px )" }}
          messages={getMessagesES()}
          popup={true}
          eventPropGetter={eventStyleGetter}
          components={{
            event: CalendarEvent,
            toolbar: CustomToolbar,
            agenda: {
              event: AgendaCustomEvent,

              // time: () => null,
            },
          }}
          views={["month", "agenda"]}
          onDoubleClickEvent={onDoubleClick}
          onSelectEvent={onSelect}
          onView={onViewChanged}
          onSelectSlot={handleSelectSlot}
          selectable
        />
      </div>
      <CalendarModal date={date} cliente={cliente} />
      <FabDelete />
    </>
  );
};

//
