import React, { useEffect, useState } from 'react'
import { Navbar } from '../Navbar';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { calendarApi } from '../../../api';

export const ReservasFecha = () => {
  const [cancha, setCancha] = useState([]);

  async function fetchData() {
   
    const {data} = await calendarApi.get("/cancha");
      console.log( data.canchas );
      
      if (data.canchas instanceof Array) {
        setCancha(data.canchas.map((cancha) => {
          return {
            id: cancha.id,
            nombre: cancha.nombre,
          };
        }));
      }
    }
    useEffect(() => {
      fetchData();
    }, []);



  return (
    <>
     <Navbar />
     <h1 className='display-5'>Consultar reserva de la fecha</h1>
    <div className="col-md-8 login-form-3">        
      <form>
          <div className="datepickers-container">
              <div className="form-group col-md-10 mb-4">
                <div className="form-group">
                      <DatePicker 
                        id='datePicker'
                        className="form-control"
                        dateFormat="Pp"
                        locale="es"
                      />
                  </div>
              </div>
          </div>
          <div className="form-group mb-2">
                <select
                  class="form-select"
                  name="registerNombreCancha"
                  id="cancha"
                  // value={registerNombre}
                  // onChange={onInputChange}
                  placeholder="Seleccione una cancha"
                >
                  <option key="0" value="" disabled>Seleccione una cancha</option>
                  {cancha && cancha.length > 0 ? cancha.map((cancha) => (
                    <option key={cancha.id} value={cancha.nombre}>
                      {cancha.nombre}
                    </option>
                  )) : null}
                </select>
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
                <th scope="col">Cliente</th>
                <th scope="col">Horario</th>
                <th scope="col">Cancha</th>
                <th scope="col">E.Pago</th>
                <th scope="col">Forma de Pago</th>
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
    
  )
}
export default ReservasFecha;