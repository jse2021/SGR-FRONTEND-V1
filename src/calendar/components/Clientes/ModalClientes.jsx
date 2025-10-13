import Modal from "react-modal";
import { useUiStore } from "../../../hooks";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { useEffect, useState } from "react";
import "./modalClientes.css";
import { calendarApi } from "../../../api";
import Swal from "sweetalert2";
registerLocale("es", es);

Modal.setAppElement("#root");

export const ModalClientes = () => {
  const {
    isModalClienteOpen,
    closeDateModal,
    activeCliente,
    closeModalCliente,
  } = useUiStore();

  /**
   * MANEJO TODOS LOS CAMPOS DEL FORMULARIO
   */
  const [formValues, setFormValues] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });
  /**
   * CARGO LOS DATOS CUANDO ABRO MODAL
   */
  useEffect(() => {
    if (activeCliente) {
      setFormValues({ ...activeCliente });
    }
  }, [activeCliente]);
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
    closeModalCliente();
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
        `/cliente/${formValues.id}`,
        datosEnviar
      );

      Swal.fire("Actualizado", "Cliente actualizado con éxito", "success");
      closeModalCliente();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.msg || "No se pudo actualizar el cliente",
        "warning"
      );
      return;
    }
  };

  return (
    <Modal
      isOpen={isModalClienteOpen}
      onRequestClose={handleClose}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h2 className="text-center mb-2">Editar Cliente</h2>
      <hr />
      <form onSubmit={handleSubmit} className="container">
        <div className="form-group mb-1">
          <label>Dni</label>
          <input
            type="text"
            className="form-control"
            placeholder="Dni"
            name="dni"
            value={formValues.dni}
            onChange={handleInputChange}
            disabled
          />
        </div>
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
          <label>Apellido</label>
          <input
            type="text"
            className="form-control"
            placeholder="Apellido"
            name="apellido"
            value={formValues.apellido}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group mb-1">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group mb-1">
          <label>Telefono</label>
          <input
            type="number"
            className="form-control"
            placeholder="Telefono"
            name="telefono"
            value={formValues.telefono}
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
