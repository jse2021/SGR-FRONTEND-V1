import { parse, parseISO } from "date-fns"


/**
 * PROCESAMOS LA INFORMACION DE LOS EVENTOS EN ESTE CASO LAS FECHAS DE STRING A DATE
 *  PARA LUEGO MOSTRAR CORRECTAMENTE EN PANTALLA
 */
export const convertEventsToDateEvents = (event = []) =>{

    return event.map(event => {
        event.fecha = parseISO(event.fecha);
        event.fechaCopia = parseISO(event.fechaCopia);

        return event;

    })
}

