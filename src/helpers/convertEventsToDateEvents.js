import { isValid, parseISO } from "date-fns";

/**
 * PROCESAMOS LA INFORMACION DE LOS EVENTOS EN ESTE CASO LAS FECHAS DE STRING A DATE
 *  PARA LUEGO MOSTRAR CORRECTAMENTE EN PANTALLA
 */

export const convertEventsToDateEvents = (event = []) => {
  return event.map((event) => {
    const fechaCopia = event.fechaCopia ? parseISO(event.fechaCopia) : null;
    let fecha = event.fecha ? parseISO(event.fecha) : null;

    if (!isValid(fecha)) {
      fecha = isValid(fechaCopia) ? fechaCopia : new Date(); // Si ambas son inválidas, usa fecha actual
    }

    return {
      ...event,
      fecha,
      fechaCopia,
      start: event.start ? parseISO(event.start) : null,
      end: event.end ? parseISO(event.end) : null,
    };
  });
};

// export const convertEventsToDateEvents = (event = []) => {
//   return event.map((event) => {
//     event.fecha = parseISO(event.fecha);
//     event.fechaCopia = parseISO(event.fechaCopia);
//     event.start = parseISO(event.start);
//     event.end = parseISO(event.end);
//     // console.log("x: ", event.fecha);
//     return event;
//   });
// };
