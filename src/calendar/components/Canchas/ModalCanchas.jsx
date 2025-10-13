import Modal from "react-modal";
import { useUiStore } from "../../../hooks";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { useEffect, useState } from "react";
import "./modalCanchas.css";
import { calendarApi } from "../../../api";
import Swal from "sweetalert2";
registerLocale("es", es);

Modal.setAppElement("#root");

export const ModalCanchas = () => {
  const { isModalCanchaOpen, activeCancha, closeModalCancha } = useUiStore();

  /**
   * MANEJO TODOS LOS CAMPOS DEL FORMULARIO
   */
  const [formValues, setFormValues] = useState({
    nombre: "",
    medidas: "",
  });
  /**
   * CARGO LOS DATOS CUANDO ABRO MODAL
   */
  useEffect(() => {
    if (activeCancha) {
      setFormValues({ ...activeCancha });
    }
  }, [activeCancha]);
  /**
   * CAPTURO MODIFICACIONES EN INPUTS, ACTUALIZANDO ESTADO LOCAL
   */
  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };
  /**
   * MANEJO CIERRE DE MODAL
   */
  const handleClose = () => {
    closeModalCancha();
  };
  /**
   * ENVIO DATOS AL BACKEND
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Creamos una copia de los valores del formulario
    const datosEnviar = { ...formValues };

    try {
      const { data } = await calendarApi.put(
        `/cancha/${formValues.id}`,
        datosEnviar
      );

      Swal.fire("Actualizado", "Cancha actualizada con éxito", "success");
      closeModalCancha();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.msg || "No se pudo actualizar la cancha",
        "error"
      );
    }
  };

  return (
    <Modal
      isOpen={isModalCanchaOpen}
      onRequestClose={handleClose}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h2 className="text-center mb-2">Editar Cancha</h2>
      <hr />
      <form onSubmit={handleSubmit} className="container">
        <div className="form-group mb-1">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            name="nombre"
            value={formValues.nombre}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group mb-1">
          <label>Medidas</label>
          <input
            type="text"
            className="form-control"
            placeholder="Medidas"
            name="medidas"
            value={formValues.medidas}
            onChange={handleInputChange}
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn-secondary">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
};
