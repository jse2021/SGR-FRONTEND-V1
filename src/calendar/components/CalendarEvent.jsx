

export const CalendarEvent = ({ event }) => {

    console.log({event})

    const { cliente, cancha } = event;

    return (
        <>
            <strong>{ cliente }</strong>
            <span> - { event.cancha }</span>
        </>
    )
}
export default CalendarEvent;