import Modal from "react-modal";
// import "../../calendar/components/CalendarModal.css"; //cambiar
import { useUiStore } from "../../../hooks";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { useEffect, useState } from "react";
import "./modalUsuarios.css";
import { calendarApi } from "../../../api";
import Swal from "sweetalert2";
registerLocale("es", es);

Modal.setAppElement("#root");

export const ModalUsuarios = () => {
  const {
    isModalUsuarioOpen,
    closeDateModal,
    activeUsuario,
    closeModalUsuario,
  } = useUiStore();

  /**
   * MANEJO TODOS LOS CAMPOS DEL FORMULARIO
   */
  const [formValues, setFormValues] = useState({
    nombre: "",
    apellido: "",
    celular: "",
    email: "",
    user: "",
    password: "",
    tipo_usuario: "Estandar",
  });
  /**
   * CARGO LOS DATOS CUANDO ABRO MODAL
   */
  useEffect(() => {
    if (activeUsuario) {
      setFormValues({ ...activeUsuario, password: "" }); // reseteamos password
    }
  }, [activeUsuario]);
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
    closeModalUsuario();
  };
  /**
   * ENVIO DATOS AL BACKEND
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Creamos una copia de los valores del formulario
    const datosEnviar = { ...formValues };

    //Si el campo contraseña está vacío, lo eliminamos antes de enviar al backend
    if (!datosEnviar.password || datosEnviar.password.trim() === "") {
      delete datosEnviar.password;
    }

    try {
      const { data } = await calendarApi.put(
        `/auth/actualizar/${formValues.id}`,
        datosEnviar
      );

      Swal.fire("Actualizado", "Usuario actualizado con éxito", "success");
      closeModalUsuario();
    } catch (error) {
      Swal.fire(
        "Atención",
        error.response?.data?.msg || "No se pudo actualizar el usuario",
        "warning"
      );
    }
  };

  return (
    <Modal
      isOpen={isModalUsuarioOpen}
      onRequestClose={handleClose}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h2 className="text-center mb-2">Editar Usuario</h2>
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
          <label>Celular</label>
          <input
            type="text"
            className="form-control"
            placeholder="Celular"
            name="celular"
            value={formValues.celular}
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
          <label>Usuario</label>
          <input
            type="text"
            className="form-control"
            placeholder="Usuario"
            name="user"
            value={formValues.user}
            disabled
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group mb-1">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            name="password"
            value={formValues.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group mb-1">
          <label>Tipo de Usuario</label>
          <select
            id="select-tipo"
            className="form-control"
            name="tipo_usuario"
            value={formValues.tipo_usuario}
            onChange={handleInputChange}
          >
            <option value="Administrador">Administrador</option>
            <option value="Estandar">Estandar</option>
          </select>
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
