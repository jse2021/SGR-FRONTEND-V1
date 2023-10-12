import React from 'react'
import { Navbar } from '../Navbar';
import './clientes.css';
export const AltaCliente = () => {
  console.log("AltaUsuario is rendering");
  return (
    <>
    <Navbar />
    <h1 className='display-5'>Gestión Clientes</h1>
    <div className="col-md-6 login-form-2">
        
                    <form>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Dni"
                                name="registerName"
                                // value={ registerName }
                                // onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name="registerName"
                                // value={ registerName }
                                // onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Apellido"
                                name="registerEmail"
                                // value={ registerEmail }
                                // onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="Email"
                                className="form-control"
                                placeholder="Email"
                                name="registerEmail"
                                // value={ registerEmail }
                                // onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Celular"
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
export default AltaCliente;