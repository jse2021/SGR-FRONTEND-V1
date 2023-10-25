import React, { useContext, useState } from 'react'
import SearchContext from "./SearchContext";

export const  TablaUsuarios =()=> {
  const [usuarios, setUsuarios] = useState([]);
  const { result } = useContext(SearchContext);

  return (
    <table className="table table-hover">
    <thead>
      <tr>
        <th scope="col">Nombre</th>
        <th scope="col">Apellido</th>
        <th scope="col">Celular</th>
        <th scope="col">Email</th>
        <th scope="col">Usuario</th>
        <th scope="col">T.Usuario</th>
      </tr>
    </thead>
    <tbody>
    {usuarios && usuarios.map((usuario) => (
          <tr key={usuario.id}>
            <td>{usuario.nombre}</td>
            <td>{usuario.apellido}</td>
            <td>{usuario.celular}</td>
            <td>{usuario.email}</td>
            <td>{usuario.usuario}</td>
            <td>{usuario.t_usuario}</td>
          </tr>
        ))}
        </tbody>
  </table>
  )
}
export default TablaUsuarios;
