import { useMemo, useState, useEffect, useRef } from 'react';
import { useReservaStore } from '../../hooks'; 
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

    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);// manejo de boton guardar


/**
 * TRABAJO CLIENTE PARA MANDARLO A ASYNCSELECT.
 */
useEffect(() => {
const buscarCliente = async() => {
    const {data} = await calendarApi.get('/cliente')       
        cliente = Array.from(data.clientes);
    const opciones  = cliente.map((clientes) => ({
        value: clientes.dni,
        label: `${clientes.dni} - ${clientes.apellido} ${clientes.nombre}`,
    }));
    //almacena los clientes
    setOpciones(opciones);
};            
    buscarCliente();
}, []);


// Cargo Clientes por filtro - para pasarle al asyncSelect.
const loadOptions =  (searchValue, callback) => {

    const opcionesFiltradas = opciones.filter((opcion) =>
        opcion.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
    );

    callback(opcionesFiltradas);
};
//_-------------------------------------------------------------------------------------
/**
 * TRABAJO CANCHAS PARA TRAERLAS DESDE EL BACKEND
 */
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
//---------------------------------------------------------------------------------------


/**
 * MANEJO DE INICIO DE FORMULARIO: RESETEA LOS CAMPOS CADA VEZ QUE ABRO MODAL
 */
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
    }
);
/**
 * MANEJO DE INICIO DE FORMULARIO: LEVANTO TODOS LOS DATOS DE UNA RESERVE ESPECIFICA.
 * SIRVE PARA LA MODIFICACION
 */
useEffect(() => {
    if (activeEvent !== null) {
        const cliente = activeEvent.cliente;
        setFormValues({...activeEvent, cliente });
        }    
    }, [activeEvent]);
//---------------------------------------------------------------------------------------
       
/**
 * TRABAJO LOS HORARIOS: SOLO CONSULTO TRAIGO LAS HORAS SIN RESERVAS
 */
const obtenerHorarios = async (canchaSeleccionada) => {
    try {
        if (!date) {
            console.warn('Fecha no proporcionada al modal');
        return;
        }
    
            const fechaISO = new Date(date).toISOString(); // Usa la prop `date` directamente
            const { data } = await calendarApi.post('/reserva/horarios-disponibles', {
            fecha: fechaISO,
            cancha: canchaSeleccionada,
        });
    
        if (data.ok) {
            setHorariosDisponibles(data.horasDisponibles);// guardo las horas
        } else {
        Swal.fire('Error', 'No se pudieron obtener los horarios disponibles', 'error');
        }
    } catch (error) {
            console.error('Error al obtener horarios:', error);
        Swal.fire('Error', 'Error al obtener horarios disponibles', 'error');
    }
    };
//---------------------------------------------------------------------------------------
/**
 * TRABAJO MONTOS: OBTENGO LOS MONTOS SEGUN CANCHA SELECCIONADA
 */
    useEffect(() => {
    const obtenerMonto = async () => {
        if (formValues.cancha && formValues.fecha && formValues.estado_pago) {
            try {
                const { data } = await calendarApi.post('/reserva/obtener-monto', {
                    cancha: formValues.cancha,
                    fecha: formValues.fecha,
                    estado_pago: formValues.estado_pago,
                });

                setFormValues(prev => ({
                    ...prev,
                    monto: data.monto,
                }));
            } catch (error) {
                console.error("Error al obtener monto:", error);
            }
        }
    };

    obtenerMonto();
    }, [formValues.cancha, formValues.fecha, formValues.estado_pago]);
//---------------------------------------------------------------------------------------

/** 
* MANEJO DE LOS INPUTCHANGED
*/

//Seteo del cliente.  Para que quede seleccionado al enviar al backend
const onClienteChanged = ({target}, value) => {
    if (value && value.value) {
        setDni(value.value);
    }
        setFormValues({
        ...formValues,
        [target.name]: target.value
    });
}
/*
* MANEJO DEL CAMBIO DE ESTADO DE LOS COMPONENTES:TAMBIEN EL CAMBIO DE ESTADO DE ESTADO DE PAGO E INPUT MONTO 
*/ 
const onInputChanged = async ({ target }) => {
    const { name, value } = target;
  
    const newFormValues = {
      ...formValues,
      [name]: value,
    };
  
    setFormValues(newFormValues);
  
    const { cancha, fecha, estado_pago } = newFormValues;
  
    if (cancha &&  estado_pago) {
      try {
        const { data } = await calendarApi.post('/reserva/obtener-monto', {
          cancha,
          estado_pago
        });
  
        setFormValues((prev) => ({
          ...prev,
          monto: data.monto
        }));
      } catch (error) {
        console.error("Error al obtener monto:", error);
      }
    }
  };
//---------------------------------------------------------------------------------------  
/**
 * MANEJOD EL BOTON GUARDAR: REINICIO BOTON GUARDAR
 */
    useEffect(() => {
        setIsSubmitting(false); // se reinicia cuando cambia la fecha
    }, [date]);
          
//---------------------------------------------------------------------------------------
/**
 * MANEJO DEL CIERRE DE MODAL
 */
    const onCloseModal = () => {
        closeDateModal();
    }
//---------------------------------------------------------------------------------------
/**
 * TRABAJO ENVIO DE RESERVA AL BACKEND
 */

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
        setIsSubmitting(true); // cuando estoy por mandar a backend, cambia estado de boton
        setFormSubmitted(true);

        
    await startSavingEvent({ ...formValues,
        fecha: date,
        cliente: dni,
    });

        closeDateModal();
        setFormSubmitted(false);
} 
//---------------------------------------------------------------------------------------
/**
 * MANEJO LA FECHA DEL CALENDARIO PRINCIPAL
 */
    
const fechaReserva = new Date(date).toLocaleDateString(
    'es-AR',
    {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }
);
//---------------------------------------------------------------------------------------
   
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
                placeholder='Buscar Cliente'
                loadOptions={loadOptions}
                defaultOptions
                value={formValues.cliente}
                onChange={(value) => onClienteChanged({ target: { name: 'cliente', value: value } }, value)}
            />

        </div>
        <div className="form-group mb-2">
            <select
                className="form-select"
                name="cancha"
                id="select-cancha"
                value={formValues.cancha}
                onChange={(event) => {
                    const nuevaCancha = event.target.value;
                    setFormValues(prev => ({
                    ...prev,
                    cancha: nuevaCancha
                    }));

                    setHorariosDisponibles([]); //Limpia los horarios anteriores
                    
                    //Llamada al backend.
                    obtenerHorarios(nuevaCancha); 
                }}
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
                onChange={(e) =>
                setFormValues(prev => ({
                    ...prev,
                    hora: e.target.value
                }))
                }
            >
                <option key="0" value="" disabled>Seleccione horario</option>

                {horariosDisponibles.map((hora, index) => (
                <option key={index} value={hora}>
                    {hora}
                </option>
                ))}
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
                type="number"
                name="monto"
                placeholder='Monto'
                id='input-monto'
                value={formValues.monto || ''}
                className="form-control"
                disabled // si no querés que lo editen
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
                <button
                    type="submit"
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Reserva'}
                </button>
        </div>
    </form>
</Modal>
)
}