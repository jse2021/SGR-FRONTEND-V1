import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { LoginPage } from '../auth';
import { CalendarPage,AltaUsuario, AltaCliente, ConsultarUsuario, AltaCancha, ConsultarCancha, PrecioCancha, 
PagosDeReserva, Recaudacion, FormaPago, ConsultarCliente, ReservaPorCliente } from '../calendar';
import { useAuthStore } from '../hooks';





export const AppRouter = () => {

    const { status, checkAuthToken } = useAuthStore();
    // const authStatus = 'not-authenticated'; // 'authenticated'; // 'not-authenticated';

    useEffect(() => {
        checkAuthToken();
    }, [])
    
    if ( status === 'checking' ) {
        return (
            <h3>Cargando...</h3>
        )
    }

    
    return (
        <Routes>
            {
                ( status === 'not-authenticated')  
                    ? (
                        <>
                            <Route path="/auth/*" element={ <LoginPage /> } />
                            <Route path="/*" element={ <Navigate to="/auth/login" /> } />
                        </>
                    )
                    : (
                        <>
                            <Route path="/" element={ <CalendarPage /> } />
                            <Route path="/pages/CalendarPage" element={<CalendarPage />} />
                            
                            <Route path="/AltaUsuario" element = {<AltaUsuario />} />
                            <Route path="/ConsultarUsuario" element = {<ConsultarUsuario />} />

                            <Route path="/AltaCancha" element = {<AltaCancha />} />
                            <Route path="/ConsultarCancha" element = {<ConsultarCancha />} />

                            <Route path="/PrecioCancha" element = {<PrecioCancha />} />

                            <Route path="/PagosDeReserva" element = {<PagosDeReserva />} />
                            <Route path="/Recaudacion" element = {<Recaudacion />} />
                            <Route path="/FormasPago" element = {<FormaPago />} />

                            <Route path="/AltaCliente" element = {<AltaCliente />} />
                            <Route path="/ConsultarCliente" element = {<ConsultarCliente />} />

                            <Route path="/ReservaPorCliente" element = {<ReservaPorCliente />} />

                            <Route path="/*" element={ <Navigate to="/" /> } />
                        </>
                    )
            }
             
        </Routes>
    )
}
