const AgendaCustomEvent = ({ event }) => {
  const hora = event.hora || "Sin hora";
  const cliente = event.nombreCliente || "Sin cliente";
  const cancha = event.title || "Sin cancha";

  return (
    <span style={{ fontWeight: "bold", color: "#222" }}>
      {`Hora: ${hora} Cancha: ${cancha} Cliente: ${cliente}`}
    </span>
  );
};

export default AgendaCustomEvent;
