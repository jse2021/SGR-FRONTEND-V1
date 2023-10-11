import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
import { Link } from "react-router-dom";
export const MenuItemCliente = () => {

   return (
    <>
      <li className="nav-item dropdown">
        <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Gestión Cliente        </button>
        <ul className="dropdown-menu">
          <li><Link className="dropdown-item" to="/AltaCliente">Alta del Cliente</Link></li>
          <li><Link className="dropdown-item" to="/ConsultarCliente">Consultar Cliente</Link></li>
        </ul>
      </li>
    </>
    
  )
}
