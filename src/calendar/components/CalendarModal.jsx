import { useMemo, useState, useEffect } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';
import moment from 'moment';
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
import '../../calendar/components/CalendarModal.css'

registerLocale( 'es', es );

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

export const CalendarModal = ({date,cliente,selectedClient }) => {
    const { isDateModalOpen, closeDateModal } = useUiStore();
    const { activeEvent, startSavingEvent, setActiveEvent } = useCalendarStore();
    const [ formSubmitted, setFormSubmitted ] = useState(false);
    const [cancha, setCancha] = useState([]);
    const [results, setResults] = useState([]);   

        
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
        
        useEffect(() => {
            if (cliente) {
                // Guardamos el cliente en el estado local
                setFormValues({
                    ...formValues,
                    cliente,
                });
            }
        }, [cliente]);

        const [formValues, setFormValues] = useState({
            title:'',
            start:'',
            end:'',
            cliente:'',
            cancha: '',
            fecha: date,
            hora: '',
            forma_pago:'',
            estado_pago:'',
            observacion:'',

        });

    // para mostrar los datos del modal(reserva)
    useEffect(() => {
      if ( activeEvent !== null ) {
        console.log('ACTIVE: ',activeEvent)
          setFormValues({ ...activeEvent});
      }    
    }, [ activeEvent ])

    const onInputChanged = ({ target }) => {
        console.log(target)
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onCloseModal = () => {
        closeDateModal();
    }

    const onSubmit = async( event ) => {

        event.preventDefault();     

            setActiveEvent({
                title:'',
                start:'',
                end:'',
                cliente:'',
                cancha: '',
                fecha: date,
                hora: '',
                forma_pago:'',
                estado_pago:'',
                observacion:'',
            });

            setFormSubmitted(true);
        // if ( formValues.cliente.length <= 0 ) return;
        
        await startSavingEvent({ ...formValues, 
            fecha: date,
            cliente : formValues.cliente.dni} ); // mandamos toda la info del formulario
            closeDateModal();
            setFormSubmitted(false);
    }
    
    const fechaReserva = new Date(date).toLocaleDateString(
        'es-AR',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      );

  return (
    
    <Modal
        isOpen={ isDateModalOpen }
        onRequestClose={ onCloseModal }
        style={ customStyles }
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={ 200 }
    >
        <h1 className="display-6"id='titulo' >Gestión de la Reserva</h1>
        <hr />
        <form className="container" onSubmit={ onSubmit }>
            <div className="form-group mb-2">
            <h5 style={{ textAlign: 'center' }}>{fechaReserva}</h5>
            </div>
            <div className="form-group mb-2">

                <InputCliente setResults = {setResults} cliente={cliente}/>
                <ListaCliente results = {results}/>

            </div>
            <div className="form-group mb-2">
                <select
                    className="form-select"
                    name="cancha"
                    id="select-cancha"
                    value={formValues.cancha}
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
                    name="hora"
                    id="select-hora"
                    value={formValues.hora}
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
                    name="estado_pago"
                    id="select-ePago"
                    value={formValues.estado_pago}
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
                    name="forma_pago"
                    id="select-fPago"
                    value={formValues.forma_pago}
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
                    name="observacion"
                    value={formValues.observacion}
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
