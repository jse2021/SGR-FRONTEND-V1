import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
export const MenuItemConfig = () => {

   return (
    <>
      <li className="nav-item dropdown">
        <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Configuración        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href="#">Precio de la Cancha</a></li>
          <li><a className="dropdown-item" href="#">Precio de la Seña</a></li>
        </ul>
      </li>
    </>
    
  )
}
