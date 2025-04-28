import React, { useMemo, useState } from 'react'
import { Navbar } from '../Navbar';
import './clientes.css';
import { useClienteStore } from '../../../hooks/useClienteStore';
import { useForm } from '../../../hooks';
import Swal from 'sweetalert2';

/**
 * FALTA CONTROLAR LOS ERRORES QUE VIENEN DEL BACKEND
 */

const registrarCliente = {
    registerDni: '',
    registerNombre: '',
    registerApellido: '',
    registerEmail: '',
    registerCelular: ''
}

export const AltaCliente = () => {

    const {startRegister} = useClienteStore();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const { registerDni,registerNombre,registerApellido,registerEmail,registerCelular, onInputChange} = useForm(registrarCliente);

    const dniClass = useMemo(() => {
        if ( !formSubmitted ) return '';

        return ( registerDni.length > 0 )
            ? ''
            : 'is-invalid';
    }, [ registerDni, formSubmitted ]);

    const nombreClass = useMemo(() => {
        if ( !formSubmitted ) return '';

        return ( registerNombre.length > 0 )
            ? ''
            : 'is-invalid';
    }, [ registerNombre, formSubmitted ]);

    const apellidoClass = useMemo(() => {
        if ( !formSubmitted ) return '';

        return ( registerApellido.length > 0 )
            ? ''
            : 'is-invalid';
    }, [ registerApellido, formSubmitted ]);

    const emailClass = useMemo(() => {
        if ( !formSubmitted ) return '';

        return ( registerEmail.length > 0 )
            ? ''
            : 'is-invalid';
    }, [ registerEmail, formSubmitted ]);

    const celularClass = useMemo(() => {
        if ( !formSubmitted ) return '';

        return ( registerCelular.length > 0 )
            ? ''
            : 'is-invalid';
    }, [ registerCelular, formSubmitted ]);

    const registerSubmit = (event) => {

        event.preventDefault();
        setFormSubmitted(true);
        
        // Mando al hook.  
        if (registerDni.length <= 0 || registerNombre <= 0 || registerApellido <= 0 || registerEmail <= 0 || registerCelular <= 0)  return;
            startRegister({dni:registerDni,nombre: registerNombre, apellido:registerApellido,email: registerEmail, celular:registerCelular});
                
            // El cartel se mantiene hasta dar ok y dispara formulario
            const promise = Swal.fire('Alta de cliente', "Cliente registrado" , 'success');
                promise.then(() => {
                document.getElementById('formAltaCliente').submit();// para limpiar formulario
            });
    }

  return (
    <>
        <Navbar />
            <h1 className='display-5'>Gestión Clientes</h1>
                <div className="col-md-6 login-form-2">
                    <form onSubmit={registerSubmit} id="formAltaCliente">
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className={ `form-control ${ dniClass }`}
                                placeholder="Dni"
                                name="registerDni"
                                value={ registerDni }
                                onChange={ onInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className={ `form-control ${ nombreClass }`}
                                placeholder="Nombre"
                                name="registerNombre"
                                value={ registerNombre }
                                onChange={ onInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className={ `form-control ${ apellidoClass}`}
                                placeholder="Apellido"
                                name="registerApellido"
                                value={ registerApellido }
                                onChange={ onInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="Email"
                                className={ `form-control ${ emailClass }`}
                                placeholder="Email"
                                name="registerEmail"
                                value={ registerEmail }
                                onChange={ onInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="number"
                                className={ `form-control ${ celularClass}`}
                                placeholder="Celular"
                                name="registerCelular"
                                value={ registerCelular }
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
export default AltaCliente;