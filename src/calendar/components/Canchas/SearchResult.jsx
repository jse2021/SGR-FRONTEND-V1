import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { calendarApi } from "../../../api";
import { BsPencil } from "react-icons/bs";
import { useUiStore } from "../../../hooks";

export const SearchResult = ({ result, onDeleteCancha }) => {
  const { setActiveCancha, openModalCancha } = useUiStore();
  /**
   * MANEJO EL CONTROL PARA ELMINAR
   */
  const handleEliminarCancha = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar cancha?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await calendarApi.delete(`/cancha/${result.id}`);
        onDeleteCancha(result.id);
        Swal.fire(
          "Eliminada",
          "La cancha fue eliminado correctamente",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.msg || "No se pudo eliminar la cancha",
          "error"
        );
      }
    }
  };
  /**
   * MANEJO EL CONTROL PARA EDITAR
   */
  const handleEditarCancha = () => {
    setActiveCancha(result);
    openModalCancha(); // Abre el modal
  };
  return (
    <>
      <tr style={{ cursor: "pointer" }}>
        <td className="search-result">{result.nombre}</td>
        <td className="search-result">{result.medidas}</td>
        <td>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm me-2"
            onClick={handleEditarCancha}
            title="Editar cancha"
          >
            <BsPencil />
          </button>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleEliminarCancha}
            title="Eliminar cancha"
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    </>
  );
};
export default SearchResult;
