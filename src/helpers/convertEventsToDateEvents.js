// import { isValid, parseISO } from "date-fns";

/**
 * PROCESAMOS LA INFORMACION DE LOS EVENTOS EN ESTE CASO LAS FECHAS DE STRING A DATE
 *  PARA LUEGO MOSTRAR CORRECTAMENTE EN PANTALLA
 */

// export const convertEventsToDateEvents = (event = []) => {
//   return event.map((event) => {
//     const fechaCopia = event.fechaCopia ? parseISO(event.fechaCopia) : null;
//     let fecha = event.fecha ? parseISO(event.fecha) : null;

//     if (!isValid(fecha)) {
//       fecha = isValid(fechaCopia) ? fechaCopia : new Date(); // Si ambas son inválidas, usa fecha actual
//     }

//     return {
//       ...event,
//       fecha,
//       fechaCopia,
//       start: event.start ? parseISO(event.start) : null,
//       end: event.end ? parseISO(event.end) : null,
//     };
//   });
// };
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

    // ➕ Asegura end ligeramente distinto de start
    const end = addSeconds(addMinutes(new Date(start), 30), 1);

    return {
      ...event,
      fecha,
      fechaCopia,
      start,
      end,
    };
  });
};
