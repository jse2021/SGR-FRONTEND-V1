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
            Gestión Usuarios
          </button>
          <ul className="dropdown-menu">
          <li><NavLink className="dropdown-item" to="/components/altaUsuario">Alta de Usuario</NavLink></li>
          <li><NavLink className="dropdown-item" to="/consultarUsuario">Consultar Usuario</NavLink></li>
          </ul>
        </li>
      
      <Routes>
        <Route path="/components/altaUsuario" element={ <altaUsuario />} ></Route>
        <Route path="/consultarUsuario" element={ <consultarUsuario />} ></Route>
      </Routes>
   </>
  )
}
