import React, { useEffect, useState } from 'react'
import { Navbar } from '../Navbar';
import { calendarApi } from '../../../api';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Recaudacion.css'

export const Recaudacion = () => {
  const [cancha, setCancha] = useState([]);

      //obtengo Canchas
      async function fetchData() {
        const {data} = await calendarApi.get("/cancha");
              
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

    const [formValues, setFormValues] = useState({
      cancha: '',
  });

  return (
    <>
      <Navbar />
        <div>
        <h1 className='display-5'>Recaudación</h1>
        <div className="col-md-6 login-form-2">
            <DatePicker 
              id='DatePickerFecha'
              className="form-control"
              dateFormat="Pp"
              locale="es"
            />
       
          <select
            className="form-select"
            name="cancha"
            id="select-cancha"
            value={formValues.cancha}
            onChange={(event) => onInputChanged(event)}
            placeholder="Seleccione una cancha"
            >
            <option key="0" value="" disabled>Selecciona una cancha</option>
                {cancha && cancha.length > 0 ? cancha.map((cancha) => (
                    <option key={cancha.id} value={cancha.nombre}>
                    {cancha.nombre}
                    </option>
                )) : null}
          </select> 
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Cancha</th>
                <th scope="col">Monto Consolidado</th>
                <th scope="col">Señas</th>
                <th scope="col">Deuda</th>
              </tr>
            </thead>
            <tbody>
              <tr>

              </tr>
            </tbody>
          </table>         
        </div>
      </div>
    </>
    
  );
}
export default Recaudacion;