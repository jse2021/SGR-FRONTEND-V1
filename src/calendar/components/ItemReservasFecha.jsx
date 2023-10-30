import React from 'react'
import { Link } from "react-router-dom";

export const ItemReservasFecha = () => {
  return (

        <li className="nav-item">
            <a > <Link className="nav-link" to="/ReservasFecha" >Consultar Reservas de la fecha</Link> </a>
        </li>

  )
}

export default ItemReservasFecha;
