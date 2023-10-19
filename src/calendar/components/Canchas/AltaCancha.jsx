import React, { useEffect, useState } from 'react'
import { Navbar } from '../Navbar';
import './canchas.css';
import { useCanchaStore } from '../../../hooks/useCanchaStore';
import { useForm } from '../../../hooks';
import Swal from 'sweetalert2';

const registrarCancha = {
    registerNombre:'',
    registerMedidas:'',
}

export const AltaCancha = () => {
const {startRegister} = useCanchaStore();
const [ formSubmitted, setFormSubmitted ] = useState(false);
const { registerNombre, registerMedidas, onInputChange } 
= useForm( registrarCancha);
// Agrega las funciones setRegisterNombre y setRegisterMedidas
const setRegisterNombre = (registerNombre) => {
    setFormSubmitted(false);
    setRegisterNombre(registerNombre);
};

const setRegisterMedidas = (registerMedidas) => {
    setFormSubmitted(false);
    setRegisterMedidas(registerMedidas);
};
const registerSubmit = ( event ) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (registerNombre.length <= 0 || registerMedidas <= 0) return;

    startRegister({nombre: registerNombre, medidas: registerMedidas})
    Swal.fire('Alta de cancha', "Cancha registrada" , 'success');
}
useEffect(() => {
    if (formSubmitted) {
        setRegisterNombre('');
        setRegisterMedidas('');
    }
}, [formSubmitted]);


  return (
   <>
        <Navbar />
        <h1 className='display-5'>Gestión Canchas</h1>
        <div className="col-md-6 login-form-2">

            <form  onSubmit={registerSubmit}>
            <div className="form-group mb-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre de la cancha"
                    name="registerNombre"
                    value={ registerNombre }
                    onChange={ onInputChange }
                    onBlur={ () => setRegisterNombre('') }
                />
            </div>
            <div className="form-group mb-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Medidas"
                    name="registerMedidas"
                    value={ registerMedidas }
                    onChange={ onInputChange }
                    onBlur={ () => setRegisterMedidas('') }
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