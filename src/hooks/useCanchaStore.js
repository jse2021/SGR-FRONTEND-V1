import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from "../api";
import { onCheckingCancha } from "../store";

export const useCanchaStore = () => {
  const { status } = useSelector((state) => state.cancha);
  const dispatch = useDispatch();
  /**
   * REGISTRAR CANCHAS
   */
  const startRegister = async ({ nombre, medidas }) => {
    try {
      //   dispatch(onCheckingCancha());
      const { data } = await calendarApi.post("/cancha/crearCancha", {
        nombre,
        medidas,
      });
      return { ok: true };
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.msg;
      return { ok: false, msg };
    }
  };

  return {
    startRegister,
  };
};
