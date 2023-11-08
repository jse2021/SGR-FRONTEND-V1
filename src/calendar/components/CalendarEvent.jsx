import React from 'react';

export const CalendarEvent = ({ event }) => {

    const { apellidoCliente, nombreCliente, cancha, hora, fecha,fechaCopia } = event;

    return (
        <>
            <strong>{ cancha }</strong>
            <span> - { hora  }</span>
            <span>  { apellidoCliente }</span>
            <span>  { nombreCliente }</span>

        </>
    )
}
export default CalendarEvent;