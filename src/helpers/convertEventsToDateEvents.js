import { parseISO } from "date-fns"

export const convertEventsToDateEvents = (events = []) =>{

    return events.map(event => {
        event.fecha = parseISO(event.fecha);
        return event;
    })


}