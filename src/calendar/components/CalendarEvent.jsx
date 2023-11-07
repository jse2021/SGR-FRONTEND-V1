

export const CalendarEvent = ({ reservas }) => {

    console.log({reservas})

    const { cliente, cancha } = reservas;

    return (
        <>
            <strong>{ reservas.cliente }</strong>
            <span> - { reservas.cancha }</span>
        </>
    )
}
