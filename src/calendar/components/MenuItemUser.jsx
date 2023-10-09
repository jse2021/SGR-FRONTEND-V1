import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
import  altaUsuario  from "./usuario/altaUsuario";
import { BrowserRouter, Route,Routes, NavLink,Link } from "react-router-dom";

export const MenuItemUser = () => {

   return (
    
  
   <>
   
      <li class="nav-item dropdown">
          <button class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Gestión Usuarios        </button>
          <ul class="dropdown-menu">

          <li><Link className="dropdown-item" to="/usuario/altaUsuario">Alta de Usuario</Link></li>
            {/* <li><a class="dropdown-item" href="#">Consultar Usuario</a></li> */}
          </ul>
        </li>
        
        <Routes>
          <Route path="/usuario/altaUsuario" element={ <altaUsuario />} />
        </Routes>
   </>

   
   
    
    
    
    
    
  )
}
