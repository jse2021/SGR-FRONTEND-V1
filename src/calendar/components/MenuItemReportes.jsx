import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./styles.css";
import { Link } from "react-router-dom";
export const MenuItemReportes = () => {
  return (
    <>
      <li className="nav-item dropdown">
        <button
          className="btn btn-dark dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Reportes{" "}
        </button>
        <ul className="dropdown-menu">
          <li>
            <Link className="dropdown-item" to="/FormasPago">
              Formas de Pago
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/PagosDeReserva">
              Estado de Pagos de Reserva
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/Recaudacion">
              Recaudación
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/ReservasEliminadas">
              Reservas Eliminadas
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};
