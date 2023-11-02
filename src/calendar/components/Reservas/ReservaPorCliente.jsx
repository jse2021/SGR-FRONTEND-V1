import React from 'react'
import { Navbar } from '../Navbar';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './reservas.css'

export const ReservaPorCliente = () => {
  return (
<>
    <Navbar />
    <h1 className='display-5'>Consultar Reserva por Cliente</h1>
    <div className="col-md-8 login-form-3">        
      <form>
          <div className="form-group mb-2">
              <input 
                  id='buscar-cliente'
                  type="text"
                  className="form-control"
                  placeholder="Ingrese Cliente"
                  name="searchText"
                  autoComplete='off'
                  // value={ registerName }
                  // onChange={ onRegisterInputChange }
              />
          </div>

          <div className="datepickers-container">
              <div className="form-group col-md-10 mb-4">
                <div className="form-group">
                      <label
                      id='label-desde'
                      >Desde</label>
                      <DatePicker 
                        id='datePickerDesde'
                        className="form-control"
                        dateFormat="Pp"
                        locale="es"
                      />
                  </div>
                  <div className="form-group">
                  <label
                      id='label-hasta'
                      >Hasta</label>
                      <DatePicker 
                        id='datePickerHasta'
                        className="form-control"
                        dateFormat="Pp"
                        locale="es"
                  />
                </div>
              </div>
          </div>

            <div className="d-grid gap-2">
              <input 
                type="submit" 
                className="btnSubmit" 
                value="Buscar" />
            </div>

          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Horario</th>
                <th scope="col">Cancha</th>
                <th scope="col">E.Pago</th>
                <th scope="col">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>

              </tr>
            </tbody>
          </table>
      </form>
    </div>
    </>
    
  );
}
export default ReservaPorCliente;