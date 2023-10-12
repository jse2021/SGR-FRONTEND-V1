import React from 'react'
import { Navbar } from '../Navbar';

export const ConsultarCancha = () => {
  console.log("AltaUsuario is rendering");
  return (
    <>
        <Navbar />
    <h1 className='display-5'>Consultar Cancha</h1>
    <div className="col-md-8 login-form-3">        
      <form>
          <div className="form-group mb-2">
              <input
                  id='btn-consultar'
                  type="text"
                  className="form-control"
                  placeholder="Ingrese Cancha"
                  name="searchText"
                  autoComplete='off'
                  // value={ registerName }
                  // onChange={ onRegisterInputChange }
              />
          </div>
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Nombre de Cancha</th>
                <th scope="col">Medidas</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cancha 3</td>
                <td>20x20</td>
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
export default ConsultarCancha;