import React, { useEffect, useMemo, useState } from 'react'
import { Navbar } from '../Navbar';
import Swal from 'sweetalert2';
import { useAuthStore, useForm } from '../../../hooks';
import './usuarios.css';

const registrarUsuario = {
    registerNombre:      '',
    registerApellido:     '',
    registerCelular:  '',
    registerUsuario: '',
    registerTipoUsuario: '',
    registerEmail:'',
    registerPassword: '',
}


export const AltaUsuario = () => {

const {startRegister, errorMessage} = useAuthStore();

const { registerNombre, registerApellido, registerCelular, registerUsuario, registerPassword, registerTipoUsuario, registerEmail,
    onInputChange:onRegisterInputChange } = useForm( registrarUsuario );
    
const registerSubmit = ( event ) => {
    event.preventDefault();

    startRegister({ nombre: registerNombre, apellido: registerApellido, celular:registerCelular, user: registerUsuario, tipo_usuario: registerTipoUsuario,
         email: registerEmail, password: registerPassword });
}

useEffect(() => {
    if (errorMessage !== undefined)  {
        Swal.fire('Error en el registro', errorMessage, 'error');
    }
}, [errorMessage]);

  return (
    <>
    <Navbar />
    <h1 className='display-5'>Gestión Usuarios</h1>
    <div className="col-md-6 login-form-2">
        
                    <form  onSubmit={registerSubmit}>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name="registerNombre"
                                value={ registerNombre }
                                onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Apellido"
                                name="registerApellido"
                                value={ registerApellido }
                                onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Celular"
                                name="registerCelular"
                                value={ registerCelular }
                                onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                name="registerEmail"
                                value={ registerEmail }
                                onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Usuario"
                                name="registerUsuario"
                                value={ registerUsuario }
                                onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Clave"
                                name="registerPassword"
                                value={ registerPassword }
                                onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <select className="form-select user" 
                                // type="text"
                                placeholder="tipo usuario"
                                name="registerTipoUsuario"
                                value={ registerTipoUsuario }
                                onChange={ onRegisterInputChange }
                            >
                                <option selected></option>
                                <option value="Administrador">Administrador</option>
                                <option value="Estandar">Estandar</option>
                            </select>
                        </div>
                        <div className="d-grid gap-2">
                            <input 
                                type="submit" 
                                className="btnSubmitUsuario" 
                                value="Guardar" />
                        </div>
                    </form>
                </div>
    </>
    
  );
}
export default AltaUsuario;