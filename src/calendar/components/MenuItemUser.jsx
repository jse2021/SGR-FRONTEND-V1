import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./styles.css";
import { Link } from "react-router-dom";

export const MenuItemUser = () => {
  return (
    <>
      <li className="nav-item dropdown">
        <button
          className="btn btn-dark dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Gestión Usuarios
        </button>
        <ul className="dropdown-menu">
          <li>
            <Link className="dropdown-item" to="/AltaUsuario">
              Alta de Usuario
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/ConsultarUsuario">
              Consultar Usuario
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};
