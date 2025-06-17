import { useDispatch, useSelector } from "react-redux";
import {
  onCloseDateModal,
  onOpenDateModal,
  onCloseModalUsuario,
  onOpenModalUsuario,
  onSetActiveUsuario,
  /*Cliente */
  onCloseModalCliente,
  onOpenModalCliente,
  onSetActiveCliente,
  /*Cancha */
  onCloseModalCancha,
  onOpenModalCancha,
  onSetActiveCancha,
} from "../store";

export const useUiStore = () => {
  const dispatch = useDispatch();

  const {
    isDateModalOpen,
    isModalUsuarioOpen,
    activeUsuario,
    isModalClienteOpen,
    activeCliente,

    isModalCanchaOpen,
    activeCancha,
  } = useSelector((state) => state.ui);
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
  /**
   * MANEJO MODAL CLIENTES
   */
  const openModalCliente = () => dispatch(onOpenModalCliente());
  const closeModalCliente = () => dispatch(onCloseModalCliente());
  const setActiveCliente = (cliente) => dispatch(onSetActiveCliente(cliente));
  /**
   * MANEJO MODAL CANCHAS
   */
  const openModalCancha = () => dispatch(onOpenModalCancha());
  const closeModalCancha = () => dispatch(onCloseModalCancha());
  const setActiveCancha = (cancha) => dispatch(onSetActiveCancha(cancha));

  return {
    //* Propiedades
    isDateModalOpen,

    activeUsuario,
    isModalUsuarioOpen,

    isModalClienteOpen,
    activeCliente,

    isModalCanchaOpen,
    activeCancha,

    //* Métodos
    closeDateModal,
    openDateModal,
    toggleDateModal,

    openModalUsuario,
    closeModalUsuario,
    setActiveUsuario,

    openModalCliente,
    closeModalCliente,
    setActiveCliente,

    openModalCancha,
    closeModalCancha,
    setActiveCancha,
  };
};
