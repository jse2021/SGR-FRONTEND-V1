import {BrowserRouter} from 'react-router-dom'
import { AppRouter } from "./router/AppRouter"
import { Provider } from 'react-redux'
import {store} from './store'
import React from 'react'
import Tarjeta from "./components/Tarjeta";



export const CalendarApp =()=> {
    
    const [result, setResult] = React.useState({});
    
    return(
<div style={{ padding: "2rem" }}>
      <h1>Componentes con Props y Estado</h1>

      <Tarjeta
        titulo="React JS"
        descripcion="Una librería para construir interfaces."
        imagen="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
      />

      <Tarjeta
        titulo="Vite"
        descripcion="Un bundler súper rápido para proyectos modernos."
        imagen="https://vitejs.dev/logo.svg"
      />
    </div>
        // <Provider store={store}>
        //     <BrowserRouter>
        //         <AppRouter />
        //     </BrowserRouter>
        // </Provider>
        
        
        
    )
}