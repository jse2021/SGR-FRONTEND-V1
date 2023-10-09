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


export const Navbar = () => {

  const { startLogout, user } = useAuthStore();

  return (
    <>
   
    <div className="navbar navbar-dark bg-dark mb-4 px-4">
        <span className="navbar-brand">
            <i className="fas fa-calendar-alt"></i>
            &nbsp;
            { user.user }
            
        </span>
          <MenuItemCalendario />
          <MenuItemReserva />
          <MenuItemCliente />   
          <MenuItemCancha />   
          <MenuItemUser />       
          <MenuItemReportes />
          <MenuItemConfig />
        
        <button 
          className="btn btn-outline-danger"
          onClick={ startLogout }
        >
            <i className="fas fa-sign-out-alt"></i>
            &nbsp;
            <span>Salir</span>
        </button>
    </div>
    
 
    
    </>
    
  )
}
