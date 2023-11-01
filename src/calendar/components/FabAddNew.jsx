import { addHours } from 'date-fns';
import { useCalendarStore, useUiStore } from '../../hooks';


export const FabAddNew = () => {

    const { openDateModal } = useUiStore();
    const { setActiveEvent } = useCalendarStore();

    const handleClickNew = () => {
        setActiveEvent({
            registerCliente:'',
            registerCancha: '',
            registerFecha:'',
            registerHorario: '',
            registerForma_Pago:'',
            registerEstado_Pago:'',
            registerObservacion:'',
            user: {
            }
        });
        
        openDateModal();
    }


  return (
    <button
        className="btn btn-primary fab"
        onClick={ handleClickNew }
    >
        <i className="fas fa-plus"></i>
    </button>
  )
}
