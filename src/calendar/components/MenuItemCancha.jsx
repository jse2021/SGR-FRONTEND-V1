import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
export const MenuItemCancha = () => {

   return (
    <>
      <li className="nav-item dropdown">
        <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Gestión Cancha        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Alta de Cancha</a></li>
          <li><a class="dropdown-item" href="#">Consultar Cancha</a></li>
        </ul>
      </li>
    </>
    
  )
}
