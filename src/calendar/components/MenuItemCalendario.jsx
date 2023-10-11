import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
import {Link} from "react-router-dom";
export const MenuItemCalendario = () => {

   return (
    <>
    <li className="nav-item dropdown">
          <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Calendario
          </button>
          <ul className="dropdown-menu">
            <li><Link className="dropdown-item" to="/pages/CalendarPage">Ver Calendario</Link></li>
          </ul>
        </li>
    </>
  )
}
