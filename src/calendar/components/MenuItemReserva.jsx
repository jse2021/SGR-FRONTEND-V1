import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';

export const MenuItemReserva = () => {

   return (
    <>
      <li className="nav-item dropdown">
        <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Gestión Reserva        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Consultar Reserva por Cliente</a></li>
        </ul>
      </li>
    </>
    
  )
}
