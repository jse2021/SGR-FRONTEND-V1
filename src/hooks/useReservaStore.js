import { useDispatch } from "react-redux";

export const useReservaStore = () => {
  const dispatch = useDispatch();

  const startObtenerHorariosDisponibles = async (fecha, cancha) => {
    try {
      const { data } = await calendarApi.get("/reserva/horarios-disponibles", {
        params: {
          fecha: moment(fecha).format("YYYY-MM-DD"),
          cancha,
        },
      });

      dispatch(onSetHorariosDisponibles(data));
    } catch (error) {
      console.error("Error al obtener horarios disponibles:", error);
    }
  };

  return {
    startObtenerHorariosDisponibles,
  };
};
