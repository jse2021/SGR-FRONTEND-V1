import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from "../api";

export const useCanchaStore = () => {
  const { status } = useSelector((state) => state.cancha);

  /**
   * REGISTRAR CANCHAS
   */
  const startRegister = async ({ nombre, medidas }) => {
    try {
      const { data } = await calendarApi.post("/cancha", {
        nombre,
        medidas,
      });
      return { ok: true };
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.msg;
      return { ok: false, msg };
    }
  };

  return {
    startRegister,
  };
};
