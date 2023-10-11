import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { LoginPage } from '../auth';
import { CalendarPage,AltaUsuario, ConsultarUsuario } from '../calendar';
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
                            <Route path="/*" element={ <Navigate to="/" /> } />
                        </>
                    )
            }
             
        </Routes>
    )
}
