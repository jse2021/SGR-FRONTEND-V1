import React from 'react';

export const CalendarEvent = ({ event }) => {
    console.log('Paso por aca')

    const { cliente, cancha, hora, fecha,fechaCopia } = event;

    return (
        <>
            <strong>{ cliente }</strong>
            <span> - { cancha }</span>
            <span> - { hora }</span>
            <span> - { fecha }</span>
            <span> - { fechaCopia }</span>
        </>
    )
}
export default CalendarEvent;