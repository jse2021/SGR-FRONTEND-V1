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

    /**
     * CREO FORMULARIO
     */
      const [formValues, setFormValues] = useState({
        start: new Date(),
        cancha:''
    });

  const onInputChanged = (event) =>{
    const canchaSeleccionada = event.target.value;
    console.log(canchaSeleccionada)
  }

  /**
   * TOMA LAS NUEVAS FECHAS SELECCIONADA
   */
  const ondDateChanged = (event, changing)=>{
    setFormValues({
        ...formValues,
        [changing]:event
    })

  }
  
  return (
    <>
      <Navbar />
        <div>
          <h1 className='display-5'>Recaudación</h1>
          
          <div className="col-md-6 login-form-2">
          <form  >
              <div className="container">
                    <DatePicker 
                      id='DatePickerFecha'
                      className="form-control"
                      dateFormat="Pp"
                      locale="es"
                      onChange={(event)=>ondDateChanged(event,'start')}
                    />
              
                <select
                  className="form-select"
                  name="cancha"
                  id="cancha-reca"
                  onChange={onInputChanged}
                  placeholder="Seleccione una cancha"
                  >
                  <option key="0" value="" disabled>Selecciona una cancha</option>
                      {cancha && cancha.length > 0 ? cancha.map((cancha) => (
                          <option key={cancha.id} value={cancha.nombre}>
                          {cancha.nombre}
                          </option>
                      )) : null}
                </select> 
                <div className="d-grid gap-2">
                  <input 
                      type="submit" 
                      className="btnBuscarReca" 
                      value="Buscar" />
                </div>
                <table className="table table-hover">
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
                                            {/* MOSTRAR  */}
                    </tr>
                  </tbody>
                </table>         
              </div>
            </form>
        </div>
      </div>
          
    </>
    
  );
}
export default Recaudacion;