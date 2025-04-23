import {BrowserRouter} from 'react-router-dom'
import { AppRouter } from "./router/AppRouter"
import { Provider, useDispatch, useSelector } from 'react-redux'
import {agregarProducto, eliminarProducto, store} from './store'

import React, { useState} from 'react'


export const CalendarApp =()=> {
    
    const [result, setResult] = React.useState({});

    const [nombre, setNombre] = useState("");
    const [error, setError] = useState("");
    const productos = useSelector(state => state.productos.lista);
    const dispatch = useDispatch();
  
    const manejarEnvio = (e) => {
      e.preventDefault();
  
      if (nombre.trim().length < 3) {
        setError("El nombre debe tener al menos 3 caracteres.");
        return;
      }
  
      const existe = productos.find(
        (producto) => producto.nombre.toLowerCase() === nombre.trim().toLowerCase()
      );
      if (existe) {
        setError("Ese producto ya existe.");
        return;
      }
  
      const nuevoProducto = {
        id: Date.now(),
        nombre: nombre.trim()
      };
  
      dispatch(agregarProducto(nuevoProducto));
      setNombre("");
      setError("");
    };

    return(

      <div style={{ padding: "2rem" }}>
      <h2>Productos 🛒 (Redux)</h2>
      <form onSubmit={manejarEnvio}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />
        <button type="submit">Agregar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ marginTop: "1.5rem" }}>
        {productos.map((prod) => (
          <li key={prod.id}>
            🧩 {prod.nombre}
            <button
              onClick={() => dispatch(eliminarProducto(prod.id))}
              style={{
                marginLeft: "1rem",
                backgroundColor: "crimson",
                color: "white",
                border: "none",
                padding: "0.3rem 0.6rem",
                borderRadius: "4px"
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  
    )

}




      //  <Provider store={store}>
      //       <BrowserRouter>
      //           <AppRouter />
      //       </BrowserRouter>
      //   </Provider>