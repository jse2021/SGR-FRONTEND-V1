import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './styles.css';
import  altaUsuario  from "./altaUsuario";
import {BrowserRouter ,Route, Routes, NavLink, Outlet} from "react-router-dom";

export const MenuItemUser = () => {

   return (
   <>
      <li className="nav-item dropdown">
          <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Gestión Usuarios</button>
          <ul class="dropdown-menu">

          <li><NavLink className="dropdown-item" to="/altaUsuario">Alta de Usuario</NavLink></li>
          <li><NavLink className="dropdown-item" to="/consultarUsuario">Consultar Usuario</NavLink></li>
          </ul>
        </li>
        
      
      <Routes>
        <Route path="/altaUsuario" element={ <altaUsuario />} ></Route>
        <Route path="/consultarUsuario" element={ <consultarUsuario />} ></Route>
        
      </Routes>
   </>
  )
}
