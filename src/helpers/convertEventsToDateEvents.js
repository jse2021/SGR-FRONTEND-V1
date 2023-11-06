import { parse, parseISO } from "date-fns"


/**
 * PARSEA LAS FECHAS DE STRING A DATE PARA QUE LO TOME EL CALENDARIO
 */
export const convertEventsToDateEvents = (events = []) =>{

    return events.map(event => {
        event.fecha = parseISO(event.fecha);
        event.fechaCopia = parseISO(event.fechaCopia);
        return event; 
    })


}