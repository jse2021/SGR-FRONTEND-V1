import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
import { Link } from "react-router-dom";
export const MenuItemConfig = () => {

   return (
    <>
      <li className="nav-item dropdown">
        <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Configuración        </button>
        <ul className="dropdown-menu">
          <li><Link className="dropdown-item" to="/PrecioCancha">Precio de la Cancha</Link></li>
          {/* <li><Link className="dropdown-item" to="/PrecioSena">Precio de la Seña</Link></li> */}
        </ul>
      </li>
    </>
  )
}
