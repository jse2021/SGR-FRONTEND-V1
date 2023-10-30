import { useAuthStore } from "../../hooks/useAuthStore"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { MenuItemUser } from "./MenuItemUser";
import { MenuItemReportes } from "./MenuItemReportes";
import { MenuItemConfig } from "./MenuItemConfig";
import { MenuItemCancha } from "./MenuItemCancha";
import { MenuItemCliente } from "./MenuItemCliente";
import { MenuItemCalendario } from "./MenuItemCalendario";
import { MenuItemReserva } from "./MenuItemReserva";
import './styles.css';
import { ReservasFecha } from "./ReservasFecha";
import ItemReservasFecha from "./ItemReservasFecha";



export const NavbarReserva = () => {
  

  return (
    <>
      <div className="navbar navbar-dark bg-dark mb-4 px-4">
        <ul class="nav justify-content-center">
            <li class="nav-item">
              <a class="nav-link" href="#">Alta Reserva</a>
            </li>
            <ItemReservasFecha />
        </ul>
      </div>
    </>
    
  )
}
