import React from 'react'

export const  TablaUsuarios =()=> {
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
      <tr>
        <td></td>

        {/* <td><a className="display-8" >Eliminar</a></td>
        <td><a className="display-8" >Modificar</a></td> */}
      </tr>
    </tbody>
  </table>
  )
}
export default TablaUsuarios;
