import React from 'react'
import { Navbar } from '../Navbar';
import Swal from 'sweetalert2';
import { useAuthStore, useForm } from '../../../hooks';
import './usuarios.css';

export const AltaUsuario = () => {
  const registerFormFields = {
    registerName:      '',
    registerEmail:     '',
    registerPassword:  '',
    registerPassword2: '',
}
const {startRegister} = useAuthStore();
const { registerEmail, registerName, registerPassword, registerPassword2, onInputChange:onRegisterInputChange } = useForm( registerFormFields );
  const registerSubmit = ( event ) => {
    event.preventDefault();
    if ( registerPassword !== registerPassword2 ) {
        Swal.fire('Error en registro', 'Contraseñas no son iguales', 'error');
        return;
    }

    startRegister({ name: registerName, email: registerEmail, password: registerPassword });
}
  return (
    <>
    <Navbar />
    <h1 className='display-5'>Gestión Cliente</h1>
    <div className="col-md-6 login-form-2">
        
                    <form onSubmit={ registerSubmit }>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name="registerName"
                                value={ registerName }
                                onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Correo"
                                name="registerEmail"
                                value={ registerEmail }
                                onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña" 
                                name="registerPassword"
                                value={ registerPassword }
                                onChange={ onRegisterInputChange }
                            />
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Repita la contraseña" 
                                name="registerPassword2"
                                value={ registerPassword2 }
                                onChange={ onRegisterInputChange }
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
export default AltaUsuario;