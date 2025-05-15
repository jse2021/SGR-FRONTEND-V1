import React, { useEffect, useMemo, useState } from 'react'
import { Navbar } from '../Navbar';
import './canchas.css';
import { useCanchaStore } from '../../../hooks/useCanchaStore';
import { useForm } from '../../../hooks';
import Swal from 'sweetalert2';

/**
 * FALTA CONTROLAR LOS ERRORES QUE VIENEN DEL BACKEND
 */

const registrarCancha = {
    registerNombre:'',
    registerMedidas:'',
}

export const AltaCancha = () => {
const {startRegister} = useCanchaStore();
const [ formSubmitted, setFormSubmitted ] = useState(false);
const { registerNombre, registerMedidas, onInputChange } = useForm( registrarCancha);

    const nombreClass = useMemo(() => {
        if ( !formSubmitted ) return '';

        return ( registerNombre.length > 0 )
            ? ''
            : 'is-invalid';
    }, [ registerNombre, formSubmitted ]);

    const medidasClass = useMemo(() => {
        if ( !formSubmitted ) return '';

        return ( registerMedidas.length > 0 )
            ? ''
            : 'is-invalid';
    }, [ registerNombre, formSubmitted ]);

    const registerSubmit = ( event ) => {
        event.preventDefault();
        setFormSubmitted(true);

        if (registerNombre.length <= 0 || registerMedidas <= 0) return;

            startRegister({nombre: registerNombre, medidas: registerMedidas})

            // El cartel se mantiene hasta dar ok y dispara formulario
            const promise = Swal.fire('Alta de cancha', "Cancha registrada, Por favor no olvidar cargar precios!" , 'success');
            promise.then(() => {
                document.getElementById('formAltaCancha').submit();
            });
    }
  return (
   <>
        <Navbar />
        <h1 className='display-5'>Gestión Canchas</h1>
            <div className="col-md-6 login-form-2">
                <form onSubmit={registerSubmit} id="formAltaCancha">
                    <div className="form-group mb-2">
                        <input
                            type="text"
                            className={ `form-control ${ nombreClass }`}
                            placeholder="Nombre de la cancha"
                            name="registerNombre"
                            value={ registerNombre }
                            onChange={ onInputChange }
                        />
                    </div>
                    <div className="form-group mb-2">
                        <input
                            type="text"
                            className={ `form-control ${ medidasClass }`}
                            placeholder="Medidas"
                            name="registerMedidas"
                            value={ registerMedidas }
                            onChange={ onInputChange }
                        />
                    </div>
                    <div className="d-grid gap-2">
                        <input 
                            type="submit" 
                            className="btnSubmit" 
                            value="Guardar"
                        />
                    </div>
                </form>
           </div>
    </>
    
  );
}
export default AltaCancha;