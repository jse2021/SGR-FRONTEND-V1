import React from "react";
import "./SearchResult.css";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { calendarApi } from "../../../api";
import { BsPencil } from "react-icons/bs";
import { useUiStore } from "../../../hooks";

export const SearchResult = ({ result, onDeleteUsuario }) => {
  const { setActiveUsuario, openModalUsuario } = useUiStore();
  /**
   * MANEJO EL CONTROL PARA ELMINAR
   */
  const handleEliminarUsuario = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await calendarApi.put(`/auth/${result.id}`);
        onDeleteUsuario(result.id);
        Swal.fire(
          "Eliminado",
          "El usuario fue eliminado correctamente",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        Swal.fire(
          "Error",
          error.response?.data?.msg || "No se pudo eliminar el usuario",
          "error"
        );
      }
    }
  };
  /**
   * MANEJO EL CONTROL PARA EDITAR
   */
  const handleEditarUsuario = () => {
    setActiveUsuario(result); // Carga el usuario seleccionado en el store
    openModalUsuario(); // Abre el modal
  };

  return (
    <tr>
      <td className="search-result">{result.nombre}</td>
      <td className="search-result">{result.apellido}</td>
      <td className="search-result">{result.celular}</td>
      <td className="search-result">{result.email}</td>
      <td className="search-result">{result.user}</td>
      <td className="search-result">{result.tipo_usuario}</td>
      <td>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm me-2"
          onClick={handleEditarUsuario}
          title="Editar usuario"
        >
          <BsPencil />
        </button>
      </td>
      <td>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleEliminarUsuario}
          title="Eliminar Usuario"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default SearchResult;
