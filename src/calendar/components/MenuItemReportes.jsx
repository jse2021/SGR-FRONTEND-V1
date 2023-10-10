import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
export const MenuItemReportes = () => {

   return (
    <>
      <li className="nav-item dropdown">
        <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Reportes        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Estado de Pagos de Reserva</a></li>
          <li><a class="dropdown-item" href="#">Recaudación</a></li>
          <li><a class="dropdown-item" href="#">Formas de Pago</a></li>
        </ul>
      </li>
    </>
    
  )
}
