import { useDispatch, useSelector } from "react-redux";
import {
  onCloseDateModal,
  onOpenDateModal,
  onCloseModalUsuario,
  onOpenModalUsuario,
  onSetActiveUsuario,
} from "../store";

export const useUiStore = () => {
  const dispatch = useDispatch();

  const { isDateModalOpen, isModalUsuarioOpen, activeUsuario } = useSelector(
    (state) => state.ui
  );
  /**
   * MANEJO MODAL RESERVA
   */
  const openDateModal = () => {
    dispatch(onOpenDateModal());
  };

  const closeDateModal = () => {
    dispatch(onCloseDateModal());
  };

  const toggleDateModal = () => {
    isDateModalOpen ? openDateModal() : closeDateModal();
  };
  /**
   * MANEJO MODAL USUARIOS
   */
  const openModalUsuario = () => dispatch(onOpenModalUsuario());
  const closeModalUsuario = () => dispatch(onCloseModalUsuario());
  const setActiveUsuario = (usuario) => dispatch(onSetActiveUsuario(usuario));

  return {
    //* Propiedades
    isDateModalOpen,
    activeUsuario,
    isModalUsuarioOpen,
    //* Métodos
    closeDateModal,
    openDateModal,
    toggleDateModal,

    openModalUsuario,
    closeModalUsuario,

    setActiveUsuario,
  };
};
