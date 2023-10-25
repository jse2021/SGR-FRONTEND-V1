import {BrowserRouter} from 'react-router-dom'
import { AppRouter } from "./router/AppRouter"
import { Provider } from 'react-redux'
import {store} from './store'
import SearchContext from './calendar/components/Usuarios/SearchContext'



export const CalendarApp =()=> {
    return(

        <Provider store={store}>
             <SearchContext.Provider value={{ result: {} }}>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
            </SearchContext.Provider>
        </Provider>
        
        
        
    )
}