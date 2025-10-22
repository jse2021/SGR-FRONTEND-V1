const AgendaCustomEvent = ({ event }) => {
  const hora = new Date(event.start).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const { apellidoCliente, nombreCliente, canchas, fecha, fechaCopia } = event;

  const cliente =
    (event.nombreCliente || "") + " " + (event.apellidoCliente || "");
  const cancha = event.cancha || event.title || "Sin cancha";

  return (
    <span style={{ fontWeight: "bold", color: "#222" }}>
      {`CANCHA: ${cancha} - CLIENTE: ${cliente}`}
    </span>
  );
};

export default AgendaCustomEvent;
