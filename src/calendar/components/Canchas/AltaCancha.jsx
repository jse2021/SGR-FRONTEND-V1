import React from 'react'
import { Navbar } from '../Navbar';
import './canchas.css';

export const AltaCancha = () => {
  console.log("AltaUsuario is rendering");
  return (
<>
    <Navbar />
    <h1 className='display-5'>Gestión Canchas</h1>
    <div className="col-md-6 login-form-2">
      <form >
          <div className="form-group mb-2">
              <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de la cancha"
                  name="registerName"
                  // value={ registerName }
                  // onChange={ onRegisterInputChange }
              />
          </div>
          <div className="form-group mb-2">
              <input
                  type="text"
                  className="form-control"
                  placeholder="Medidas"
                  name="registerName"
                  // value={ registerName }
                  // onChange={ onRegisterInputChange }
              />
          </div>
          <div className="d-grid gap-2">
              <input 
                  type="submit" 
                  className="btnSubmit" 
                  value="Guardar" />
          </div>
      </form>
      </div>
    </>
    
  );
}
export default AltaCancha;