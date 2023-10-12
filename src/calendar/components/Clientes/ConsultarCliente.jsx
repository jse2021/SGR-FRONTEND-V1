import React from 'react'
import { Navbar } from '../Navbar';

export const ConsultarCliente = () => {
  return (
    <>
    <Navbar />
    <h1 className='display-5'>Consultar Clientes</h1>
    <div className="col-md-8 login-form-3">        
      <form>
          <div className="form-group mb-2">
              <input 
                  id='btn-consultar'
                  type="text"
                  className="form-control"
                  placeholder="Ingrese Cliente"
                  name="searchText"
                  autoComplete='off'
                  // value={ registerName }
                  // onChange={ onRegisterInputChange }
              />
          </div>
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Dni</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Email</th>
                <th scope="col">Celular</th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
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
    
  );
}
export default ConsultarCliente;