import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./styles.css";
import { Link } from "react-router-dom";

export const MenuItemReserva = () => {
  return (
    <>
      <li className="nav-item dropdown">
        <button
          className="btn btn-dark dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Gestión Reserva{" "}
        </button>
        <ul className="dropdown-menu">
          <li>
            <Link className="dropdown-item" to="/ReservaPorCliente">
              Consultar Reserva por Cliente
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/ReservaDelaFecha">
              Consultar Reserva de la fecha
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};
