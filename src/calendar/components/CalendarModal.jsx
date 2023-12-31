import { useMemo, useState, useEffect, useRef } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';
import moment from 'moment';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import AsyncSelect from 'react-select/async'
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

export const CalendarModal = ({date,cliente }) => {
    
    const { isDateModalOpen, closeDateModal } = useUiStore();
    const { activeEvent, startSavingEvent, setActiveEvent, startLoadingEvents } = useCalendarStore();
    const [ formSubmitted, setFormSubmitted ] = useState(false);
    const [cancha, setCancha] = useState([]);
    const [results, setResults] = useState([]);   
    const [opciones, setOpciones] = useState([]);
    const [dni, setDni] = useState('');

    // Obtengo Clientes
    useEffect(() => {
    const buscarCliente = async() => {
        const {data} = await calendarApi.get('/cliente')       
         cliente = Array.from(data.clientes);
        const opciones  = cliente.map((clientes) => ({
            value: clientes.dni,
            label: `${clientes.dni} - ${clientes.apellido} ${clientes.nombre}`,
        }));
        setOpciones(opciones);
    };
        buscarCliente();

    }, []);
    
    // Cargo Clientes
    const loadOptions =  (searchValue, callback) => {

        const opcionesFiltradas = opciones.filter((opcion) =>
            opcion.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
        );
        console.log(opcionesFiltradas)
        callback(opcionesFiltradas);
    };

    //obtengo Canchas
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

    const [formValues, setFormValues] = useState({
        title:'',
        start:'',
        end:'',
        cancha: '',
        fecha: date,
        hora: '',
        forma_pago:'',
        estado_pago:'',
        observacion:'',
        cliente:''
    });

    // para mostrar los datos del modal(reserva)
    useEffect(() => {
        if (activeEvent !== null) {
            console.log(activeEvent)
            const cliente = activeEvent.cliente;
            setFormValues({...activeEvent, cliente });
          }    
       }, [activeEvent]);

      const onInputChanged = ({target}, value) => {
        if (value && value.value) {
            setDni(value.value);
            console.log(value.value)
        }
        console.log(formValues.cliente);
          setFormValues({
            ...formValues,
            [target.name]: target.value
        });
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
          
        await startSavingEvent({ ...formValues,
            fecha: date,
            cliente: dni,
        });
   
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

    const obtengoHorarios= () =>{
        // Al seleccionar canchas obtengo los horarios registrados en un array.
        // const {data} = await calendarApi.get(`/reserva/${date}${cancha}`)
        // Crear un array con todos los horarios, y cruzarlos con el array anterior.
        // crear un nuevo array que solo contendra los ressultados distinto del cruce de los anteriores
        //ese aarray deberá mostrarse en el select. 
    }
   
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

                <AsyncSelect
                    className="select-option"
                    name="cliente"
                    placeholder='Ingresar Cliente'
                    loadOptions={loadOptions}
                    defaultOptions
                    value={formValues.cliente}
                    onChange={(value) => onInputChanged({ target: { name: 'cliente', value: value } }, value)}
                />
                 {/* <InputCliente setResults = {setResults} cliente={cliente}/>  */}
                {/* <ListaCliente results = {results}/>   */}

            </div>
            <div className="form-group mb-2">
                <select
                   className="form-select"
                    name="cancha"
                    id="select-cancha"
                    value={formValues.cancha}
                    onChange={(event) => onInputChanged(event)}
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
                    placeholder='Monto'
                    id='input-monto'
                    name="registerMonto"
                    disabled
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