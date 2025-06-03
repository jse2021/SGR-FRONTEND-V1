import { createContext, useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Navbar, CalendarModal, FabDelete } from "../";
import CalendarEvent from "../components/CalendarEvent";

import { localizer, getMessagesES } from "../../helpers";
import { useUiStore, useCalendarStore, useAuthStore } from "../../hooks";

export const CalendarPage = () => {
  const { user } = useAuthStore();
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
  const { activeEvent } = useCalendarStore();

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

  /**
   * DISEÑO DE LOS EVENTOS, "BOTON" DEL CALENDARIO
   */
  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: "#000000",
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
    setDate(event.start);
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

      <Calendar
        culture="es"
        defaultView={lastView}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc( 100vh - 80px )" }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent,
        }}
        views={["month", "agenda"]}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
        onSelectSlot={handleSelectSlot}
        selectable
      />
      <CalendarModal date={date} cliente={cliente} />
      <FabDelete />
    </>
  );
};
