import { parse, parseISO } from "date-fns"


/**
 * PARSEA LAS FECHAS DE STRING A DATE PARA QUE LO TOME EL CALENDARIO
 */
export const convertEventsToDateEvents = (reservas = []) =>{

    return reservas.map(event => {
        event.fecha = parseISO(event.fecha);
        event.fechaCopia = parseISO(event.fechaCopia);
        
        return event; 
    })


}