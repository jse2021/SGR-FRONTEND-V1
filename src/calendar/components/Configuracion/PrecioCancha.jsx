import React from 'react'
import { Navbar } from '../Navbar';
import './precios.css'

export const PrecioCancha = () => {
  console.log("AltaUsuario is rendering");
  return (
    <>
    <Navbar />
    <h1 className='display-5'>Precio de la Cancha</h1>
    <div className="col-md-8 login-form-3"> 
    <form action="">
    <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Fecha Modificación</th>
                <th scope="col">Cancha Chica</th>
                <th scope="col">Cancha Mediana</th>
                <th scope="col">Cancha Grande</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2023/05/20</td>
                <td>6000</td>
                <td>2000</td>
                <td>500</td>
              </tr>
            </tbody>
          </table>

          <h1 className='display-6'>Nuevos Precios</h1>
          <hr></hr>
          <div class="container">
          <div class="row col-6">
            <div class="form-group mb-2">
              <select class="form-select user" >
                <option selected></option>
                <option value="1"></option>
                <option value="2"></option>
              </select>
            </div>

            <div class="form-group mb-2">
              <input
                type="number"
                class="form-control"
                placeholder="Monto"
                name="registerEmail"
              />
            </div>
        </div>
        </div>        
    </form>
    
    </div>
    
    </>
    
  );
}
export default PrecioCancha;