import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
export const MenuItemCliente = () => {

   return (
    <>
      <li class="nav-item dropdown">
        <button class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Gestión Cliente        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Alta de Cliente</a></li>
          <li><a class="dropdown-item" href="#">Consultar Cliente</a></li>
        </ul>
      </li>
    </>
    
  )
}
