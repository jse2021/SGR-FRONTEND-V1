import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { calendarApi } from "../../../api";
import { BsPencil } from "react-icons/bs";
import { useUiStore } from "../../../hooks";

export const SearchResult = ({ result, onDeleteCliente }) => {
  const { setActiveCliente, openModalCliente } = useUiStore();
  /**
   * MANEJO EL CONTROL PARA ELMINAR
   */
  const handleEliminarCliente = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await calendarApi.delete(`/cliente/${result.id}`);
        onDeleteCliente(result.id);
        Swal.fire(
          "Eliminado",
          "El cliente fue eliminado correctamente",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.msg || "No se pudo eliminar el cliente",
          "error"
        );
      }
    }
  };
  /**
   * MANEJO EL CONTROL PARA EDITAR
   */
  const handleEditarCliente = () => {
    setActiveCliente(result);
    openModalCliente(); // Abre el modal
  };
  return (
    <>
      <tr style={{ cursor: "pointer" }}>
        <td className="search-result">{result.dni}</td>
        <td className="search-result">{result.nombre}</td>
        <td className="search-result">{result.apellido}</td>
        <td className="search-result">{result.email}</td>
        <td className="search-result">{result.celular}</td>
        <td>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm me-2"
            onClick={handleEditarCliente}
            title="Editar cliente"
          >
            <BsPencil />
          </button>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleEliminarCliente}
            title="Eliminar Cliente"
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    </>
  );
};
export default SearchResult;
