import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
import { Link } from "react-router-dom";
export const MenuItemCancha = () => {

   return (
    <>
      NavB
      <li className="nav-item dropdown">
        <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Gestión Cancha        </button>
        <ul className="dropdown-menu">
        <li><Link className="dropdown-item" to="/AltaCancha">Alta de Cancha</Link></li>
        <li><Link className="dropdown-item" to="/ConsultarCancha">Consultar Cancha</Link></li>
        </ul>
      </li>
    </>
    
  )
}
