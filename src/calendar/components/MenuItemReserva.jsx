import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
import { altaUsuario } from "./usuario/altaUsuario";
export const MenuItemReserva = () => {

   return (
    <>
      <li class="nav-item dropdown">
        <button class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Gestión Reserva        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#" onClick={altaUsuario}>Consultar Reserva por Cliente</a></li>
        </ul>
      </li>
    </>
    
  )
}
