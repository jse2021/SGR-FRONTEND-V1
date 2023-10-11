import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
import { CalendarPage } from "../pages/CalendarPage";
import { useNavigate } from "react-router-dom";
export const MenuItemCalendario = () => {

   return (
    <>
      <li className="nav-item ">
      <button className="btn btn-dark" data-bs-toggle="dropdown" aria-expanded="false" onClick={() => useNavigate("/pages/CalendarPage")}>
          Calendario        
        </button>
      </li>
    </>
    
  )
}
