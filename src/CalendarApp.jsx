import {BrowserRouter} from 'react-router-dom'
import { AppRouter } from "./router/AppRouter"
import { Provider } from 'react-redux'
import {store} from './store'
import React, { useState} from 'react'



export const CalendarApp =()=> {
    
    const [result, setResult] = React.useState({});
    
    return(
       <Provider store={store}>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </Provider>
  );
  
}