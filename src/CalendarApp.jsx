import {BrowserRouter} from 'react-router-dom'
import { AppRouter } from "./router/AppRouter"
import { Provider } from 'react-redux'
import {store} from './store'
import React, { useState } from 'react'


export const CalendarApp =()=> {
    
    const [result, setResult] = React.useState({});
    /**/ 
    const [tarea, setTarea] = useState("");
    const [tareas, setTareas] = useState([]);
  
    const manejarCambio = (e) => {
      setTarea(e.target.value);
    };
    const agregarTarea = (e) => {
      e.preventDefault();
  
      if (tarea.trim() === "") return;
  
      setTareas([...tareas, tarea]);
      setTarea("");
    };


    return(
       // <Provider store={store}>
        //     <BrowserRouter>
        //         <AppRouter />
        //     </BrowserRouter>
        // </Provider>
      
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h2>Lista de Tareas 📝</h2>
  
        <form onSubmit={agregarTarea}>
          <input
            type="text"
            value={tarea}
            onChange={manejarCambio}
            placeholder="Escribí una tarea"
          />
          <button type="submit">Agregar</button>
        </form>
  
        <ul>
          {tareas.map((t, index) => (
            <li key={index}>✅ {t}</li>
          ))}
        </ul>
      </div>
        
        
    )
}