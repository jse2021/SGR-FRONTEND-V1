import { useAuthStore } from "../../hooks/useAuthStore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { MenuItemUser } from "./MenuItemUser";
import { MenuItemReportes } from "./MenuItemReportes";
import { MenuItemConfig } from "./MenuItemConfig";
import { MenuItemCancha } from "./MenuItemCancha";
import { MenuItemCliente } from "./MenuItemCliente";
import { MenuItemCalendario } from "./MenuItemCalendario";
import { MenuItemReserva } from "./MenuItemReserva";
import "./styles.css";

export const Navbar = () => {
  const { startLogout, user } = useAuthStore();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Izquierda: usuario */}
        <span className="navbar-brand mb-0 h6 text-white">
          Usuario: <strong>{user.user}</strong>
        </span>

        {/* Botón hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú colapsable */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarResponsive"
        >
          <ul className="navbar-nav d-flex flex-column flex-lg-row align-items-center gap-2">
            <MenuItemCalendario />
            <MenuItemReserva />
            <MenuItemCliente />
            <MenuItemCancha />
            <MenuItemUser />
            <MenuItemReportes />
            <MenuItemConfig />
          </ul>

          <button
            className="btn btn-outline-danger ms-lg-3 mt-3 mt-lg-0"
            onClick={startLogout}
          >
            <i className="fas fa-sign-out-alt"></i> &nbsp;Salir
          </button>
        </div>
      </div>
    </nav>
  );
};
