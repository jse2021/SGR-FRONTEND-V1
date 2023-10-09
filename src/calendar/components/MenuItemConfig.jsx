import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
export const MenuItemConfig = () => {

   return (
    <>
      <li class="nav-item dropdown">
        <button class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Configuración        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Precio de la Cancha</a></li>
          <li><a class="dropdown-item" href="#">Precio de la Seña</a></li>
        </ul>
      </li>
    </>
    
  )
}
