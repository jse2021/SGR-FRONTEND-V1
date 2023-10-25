import React, { useContext, useState } from 'react'

export const  TablaUsuarios = ()=> {
  const [usuarios, setUsuarios] = useState([]);
  
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

    {usuarios.map((usuario) => (
            <tr key={setResult.id}>
              <td>{setResult.result.nombre}</td>
              <td>{setResult.result.apellido}</td>
            </tr>
          ))}

        </tbody>
  </table>
  )
}
export default TablaUsuarios;
