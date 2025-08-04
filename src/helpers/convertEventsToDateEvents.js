import { isValid, parseISO, addMinutes, addSeconds } from "date-fns";

export const convertEventsToDateEvents = (events = []) => {
  return events.map((event) => {
    const fechaCopia = event.fechaCopia ? parseISO(event.fechaCopia) : null;
    let fecha = event.fecha ? parseISO(event.fecha) : null;

    if (!isValid(fecha)) {
      fecha = isValid(fechaCopia) ? fechaCopia : new Date();
    }

    const hora = event.hora || "00:00";
    const [hours, minutes] = hora.split(":").map(Number);

    const start = new Date(fecha);
    start.setHours(hours, minutes, 0, 0);

    const end = new Date(start); // solo una hora

    return {
      ...event,
      fecha,
      fechaCopia,
      start,
      end,
    };
  });
};
