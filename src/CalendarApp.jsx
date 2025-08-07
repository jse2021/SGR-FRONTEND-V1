import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router/AppRouter";
import { Provider } from "react-redux";
import { store } from "./store";

export const CalendarApp = () => {
  return (
    /**
     * Pongo el store en contexto general, para que todo el appRouter lo consuma
     * BrowserRouter: para manejar las rutas
     */
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
};
