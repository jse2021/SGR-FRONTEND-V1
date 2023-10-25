import React, { useContext, useState } from 'react'

const SearchContext = React.createContext({});

export const TablaUsuarios = ({ searchContext }) => {
  const [usuarios, setUsuarios] = useState([]);

  const { result } = useContext(searchContext);
  
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
            <tr key={usuario.id}>
              <td>{usuario.result.nombre}</td>
              <td>{usuario.result.apellido}</td>
            </tr>
          ))}

        </tbody>
  </table>
  )
}
export default TablaUsuarios;
