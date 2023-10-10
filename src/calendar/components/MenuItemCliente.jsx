import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
export const MenuItemCliente = () => {

   return (
    <>
      <li className="nav-item dropdown">
        <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Gestión Cliente        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href="#">Alta de Cliente</a></li>
          <li><a className="dropdown-item" href="#">Consultar Cliente</a></li>
        </ul>
      </li>
    </>
    
  )
}
