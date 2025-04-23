import {BrowserRouter} from 'react-router-dom'
import { AppRouter } from "./router/AppRouter"
import { Provider } from 'react-redux'
import {store} from './store'
import React, { useState } from 'react'
import { AuthStatus } from "./components/AuthStatus";




export const CalendarApp =()=> {
    
    const [result, setResult] = React.useState({});

    return(
      //  <Provider store={store}>
      //       <BrowserRouter>
      //           <AppRouter />
      //       </BrowserRouter>
      //   </Provider>
      <Provider store={store}>
      <BrowserRouter>
        {/* App principal envuelta en Router y Redux */}
        <div style={{ padding: "2rem" }}>
          {/* Componente que muestra el estado de autenticación (Redux) */}
          <AuthStatus />

        </div>
      </BrowserRouter>
    </Provider>
    )
}