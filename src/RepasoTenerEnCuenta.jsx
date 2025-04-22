import {BrowserRouter} from 'react-router-dom'
import { AppRouter } from "./router/AppRouter"
import { Provider } from 'react-redux'
import {store} from './store'
import React, { useState,useEffect } from 'react'



export const CalendarApp =()=> {
    
    const [result, setResult] = React.useState({});
    
    const [nombre, setNombre] = useState("");
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");  // Estado para la búsqueda
    
    const manejarEnvio = (e) => {
      e.preventDefault(); // Evita que se recargue la página
    
      // Validación: mínimo 3 letras y no vacío
      if (nombre.trim().length < 3) {
        setError("El nombre debe tener al menos 3 caracteres.");
        return;
      }    
      
      // Validación: evitar duplicados
      const existe = productos.find(
        (producto) => producto.nombre.toLowerCase() === nombre.trim().toLowerCase()
      );
      
      if (existe) {
        setError("Ese producto ya existe en la lista.");
        return;
      }
    
        const nuevoProducto = {
          id: Date.now(),
          nombre: nombre.trim()
        };
    
        setProductos([...productos, nuevoProducto]);
        setNombre(""); // Limpia el input
    }

    const eliminarProducto = (id) => {
      const nuevaLista = productos.filter((p) => p.id !== id);
      setProductos(nuevaLista);
    };
    // Filtrar los productos según el término de búsqueda
    const productosFiltrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return(
      //  <Provider store={store}>
      //       <BrowserRouter>
      //           <AppRouter />
      //       </BrowserRouter>
      //   </Provider>

      <div style={{ padding: "2rem" }}>
      <h2>Agregar Producto 📝</h2>

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

      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "0.5rem", marginTop: "1rem" }}
      />

     {/* Mostrar mensaje de error si existe */}
     {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

     <ul style={{ marginTop: "1.5rem" }}>
        {productos.map((prod) => (
          <li key={prod.id} style={{ marginBottom: "0.5rem" }}>
            🧩 {prod.nombre}
            <button
              onClick={() => eliminarProducto(prod.id)}
              style={{
                marginLeft: "1rem",
                backgroundColor: "crimson",
                color: "white",
                border: "none",
                padding: "0.3rem 0.6rem",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  
  );
  
}