const normFecha = (ev) => {
  const f = ev.fecha || ev.fechaCopia || ev.start || ev.end;
  if (!f) return null;
  const d = new Date(f);
  return isNaN(d) ? null : d;
};
export const sanitizeReservaUpdate = (ev) => {
  return {
    cliente: ev.cliente, // DNI
    cancha:
      typeof ev.cancha === "object"
        ? ev.cancha?.nombre || ""
        : ev.cancha || ev.canchaNombre || "", // siempre string
    fecha: normFecha(ev), // Date válido
    hora: ev.hora, // "HH:mm"
    estado_pago: ev.estado_pago, // "TOTAL" | "SEÑA" | "IMPAGO"
    forma_pago: ev.forma_pago || "",
    observacion: ev.observacion || "",
    title: ev.title || ev.canchaNombre || ev.cancha || "",
    monto_cancha: Number(ev.monto_cancha ?? 0),
    monto_sena: Number(ev.monto_sena ?? 0),
  };
};
