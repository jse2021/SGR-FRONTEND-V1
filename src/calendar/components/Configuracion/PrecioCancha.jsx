import React, { useMemo } from 'react'
import { Navbar } from '../Navbar';
import './precios.css'
import { useState } from 'react';
import { calendarApi } from '../../../api';
import { useEffect } from 'react';
import { useConfiguracionStore } from '../../../hooks/useConfiguracionStore';
import { useForm } from '../../../hooks';
import Swal from 'sweetalert2';


const registrarMontos = {
  registerNombre:'',
  registerPrecio:'',
  registerSena:''
}

export const  PrecioCancha = () => {  

  const [cancha, setCancha] = useState([]);
  
  const [id, setId] = useState(null);
   
  async function fetchData() {
   
    const {data} = await calendarApi.get("/cancha");
      console.log({ data });
      
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

  const {startRegister, error} = useConfiguracionStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { registerNombre,registerPrecio,registerSena, onInputChange} = useForm(registrarMontos);
  
  const precioClass = useMemo(() => {
    if ( !formSubmitted ) return '';

    return ( registerPrecio.length > 0 )
        ? ''
        : 'is-invalid';
}, [ registerPrecio, formSubmitted ]);  

const senaClass = useMemo(() => {
  if ( !formSubmitted ) return '';

  return ( registerSena.length > 0 )
      ? ''
      : 'is-invalid';
}, [ registerSena, formSubmitted ]);  

  const registerSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
      if (registerPrecio.length <=0 || registerSena <= 0) return;

      startRegister({nombre: registerNombre, monto_cancha: registerPrecio, monto_sena: registerSena});
      const promise = Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Precios registrados',
        showConfirmButton: false,
        timer: 1500
      })
        promise.then(() => {
          document.getElementById('formAltaPrecio').submit();// para limpiar formulario
      });

      Swal.fire({
        icon: 'error',
        text: error,
      })
      //  const promise = Swal.fire('Alta de Precios', "Precios y Señas registrados" , 'success');
      
  }
  
  return (
    <>
      <Navbar />
      <h1 className="display-5">Precio de la Cancha</h1>
      <div className="col-md-8 login-form-3">
      <form onSubmit={registerSubmit} id="formAltaPrecio">
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

          <h1 className="display-6">Nuevos Precios</h1>
          <hr />
          <div className="container">
            <div className="row col-6">
              <div className="form-group mb-2">
                <select
                  class="form-select"
                  name="registerNombre"
                  id="cancha"
                  value={registerNombre}
                  onChange={onInputChange}
                >
                  {cancha && cancha.length > 0 ? cancha.map((canchas) => (
                    <option key={canchas.id} value={canchas.nombre}>
                      {canchas.nombre}
                    </option>
                  )) : null}
                </select>
              </div>

              <div className="form-group mb-2">
                <input
                  type="number"
                  className={ `form-control montoCancha ${ precioClass}`}
                  placeholder="Monto Cancha"
                  name="registerPrecio"
                  value={ registerPrecio }
                  onChange={ onInputChange }
                />
              </div>
              <div className="form-group mb-2">
                <input
                  type="number"
                  className={ `form-control montoSena ${ senaClass}`}
                  placeholder="Monto Seña"
                  name="registerSena"
                  value={ registerSena }
                  onChange={ onInputChange }
                />
              </div>
            </div>
            <div className="d-grid gap-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Guardar"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PrecioCancha;
