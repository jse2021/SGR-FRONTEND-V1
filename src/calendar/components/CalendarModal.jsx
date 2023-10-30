import { useMemo, useState, useEffect } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import Modal from 'react-modal';

import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import es from 'date-fns/locale/es';
import { useCalendarStore, useUiStore } from '../../hooks';
import { InputCliente } from './Components Modal/Cliente/InputCliente';
import { ListaCliente } from './Components Modal/Cliente/ListaCliente';
import { calendarApi } from '../../api';
import { NavbarReserva } from './NavBarReserva';


registerLocale( 'es', es );

const registrarReserva = {
    registerCancha:''
  }

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {
    
    const { isDateModalOpen, closeDateModal } = useUiStore();
    const { activeEvent, startSavingEvent } = useCalendarStore();
    const [ formSubmitted, setFormSubmitted ] = useState(false);
    const [cancha, setCancha] = useState([]);
        
    async function fetchData() {
        const {data} = await calendarApi.get("/cancha");
        console.log( data.canchas );
            
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
            registerCancha: '',
            registerHorario: '',

        });
    

    const titleClass = useMemo(() => {
        if ( !formSubmitted ) return '';

        return ( formValues.title.length > 0 )
            ? ''
            : 'is-invalid';

    }, [ formValues.title, formSubmitted ])

    useEffect(() => {
      if ( activeEvent !== null ) {
          setFormValues({ ...activeEvent });
      }    
    }, [ activeEvent ])
    

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onDateChanged = ( event, changing ) => {
        setFormValues({
            ...formValues,
            [changing]: event
        })
    }

    const onCloseModal = () => {
        closeDateModal();
    }

    const onSubmit = async( event ) => {
        event.preventDefault();
        setFormSubmitted(true);
        
        if ( formValues.title.length <= 0 ) return;
        console.log(formValues);

        await startSavingEvent( formValues ); // mandamos toda la info del formulario
        closeDateModal();
        setFormSubmitted(false);
    }

    const [results, setResults] = useState([]);

  return (
    
    <Modal
        isOpen={ isDateModalOpen }
        onRequestClose={ onCloseModal }
        style={ customStyles }
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={ 200 }
    >
        <h1 className='display-6'> Gestión de la Reserva </h1>
        <NavbarReserva />
        <hr />
        <form className="container" onSubmit={ onSubmit }>
            <div className="form-group mb-2">
                <InputCliente setResults={setResults}/>
                <ListaCliente results = {results}/>
            </div>
            <div className="form-group mb-2">
                <select
                    className="form-select"
                    name="registerCancha"
                    id="select-cancha"
                    value={formValues.registerCancha}
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
            </div>

            <div className="form-group mb-2">
                <select
                    className="form-select"
                    name="registerHora"
                    id="select-hora"
                    value={formValues.registerCancha}
                    onChange={onInputChanged}
                    >
                    <option key="0" value="" disabled>Seleccione horario</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00</option>
                    <option value="23:00">23:00</option>
                    <option value="00:00">00:00</option>
                    <option value="01:00">01:00</option>
                </select>
            </div>

            <div className="form-group mb-2">
                <select
                    className="form-select"
                    name="registerEPago"
                    id="select-ePago"
                    value={formValues.registerCancha}
                    onChange={onInputChanged}
                    >
                    <option key="0" value="" disabled>Seleccione estado de pago</option>
                    <option value="TOTAL">TOTAL</option>
                    <option value="SEÑA">SEÑA</option>
                    <option value="IMPAGO">IMPAGO</option>
                </select>
            </div>

            <div className="form-group mb-2">
                <input 
                    type="Number"
                    className='form-control'           
                    placeholder='Ingrese Monto'
                    id='input-monto'
                    name="registerMonto"
               />
                <select
                    className="form-select"
                    name="registerFPago"
                    id="select-fPago"
                    value={formValues.registerCancha}
                    onChange={onInputChanged}
                    >
                    <option key="0" value="" disabled>Forma de pago</option>
                    <option value="TARJETA">TARJETA</option>
                    <option value="DEBITO">DEBITO</option>
                    <option value="EFECTIVO">EFECTIVO</option>
                    <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                </select>
            </div>

            <div className="form-group mb-2">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Observaciones"
                    id='ta-observaciones'
                    rows="5"
                    name="notes"
                    // value={formValues.notes}
                    onChange={onInputChanged}
            >
                </textarea>
            </div>
            
        <hr />
            <div className="d-grid gap-2">
                <input 
                    type="submit" 
                    className="btnSubmit" 
                    value="Guardar" />
            </div>

        </form>
    </Modal>
  )
}
