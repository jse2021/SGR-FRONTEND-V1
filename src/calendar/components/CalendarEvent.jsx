import React from 'react';

export const CalendarEvent = ({ event }) => {
    console.log('Paso por aca')

    const { cliente, cancha, hora, fecha,fechaCopia } = event;

    return (
        <>
            <strong>{ cancha }</strong>
            <span> - { hora }</span>

        </>
    )
}
export default CalendarEvent;