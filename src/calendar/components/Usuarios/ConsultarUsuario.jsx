import React from 'react'
import { Navbar } from '../Navbar';

export const ConsultarUsuario = () => {
  return (
    <>
    <Navbar />
    <h1 className='display-5'>Consultar Usuarios</h1>
    <div className="col-md-8 login-form-3">        
      <form>
          <div className="form-group mb-2">
              <input 
                  id='btn-consultar'
                  type="text"
                  className="form-control"
                  placeholder="Ingrese Usuario"
                  name="searchText"
                  autoComplete='off'
                  // value={ registerName }
                  // onChange={ onRegisterInputChange }
              />
          </div>
          <table class="table table-hover table-responsive">
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
                <td>Ariel</td>
                <td>Mendez</td>
                <td>2964473552</td>
                <td>maldonadojose201422@gmail.com</td>
                <td>jose2022</td>
                <td>Estandar</td>
                <td><a class="display-8" href="#">Eliminar</a></td>
                <td><a class="display-8" href="#">Modificar</a></td>
              </tr>
            </tbody>
          </table>
      </form>
    </div>
    </>
  )
}
export default ConsultarUsuario;