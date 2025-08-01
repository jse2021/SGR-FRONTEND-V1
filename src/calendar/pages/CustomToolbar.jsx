// src/calendar/components/CustomToolbar.jsx
import React from "react";
import "./CustomToolbar.css";
import { getMessagesES } from "../../helpers/getMessages";
const messages = getMessagesES();

export const CustomToolbar = ({ label, onNavigate, onView, views }) => {
  return (
    <div className="custom-toolbar">
      <div className="toolbar-left">
        <button onClick={() => onNavigate("TODAY")} className="toolbar-btn">
          Hoy
        </button>
        <button onClick={() => onNavigate("PREV")} className="toolbar-btn">
          ⟨
        </button>
        <button onClick={() => onNavigate("NEXT")} className="toolbar-btn">
          ⟩
        </button>
      </div>

      <div className="toolbar-center">
        <span className="toolbar-label">{label.toUpperCase()}</span>
      </div>

      {/* <div className="toolbar-right">
        {views.map((view) => (
          <button
            key={view}
            onClick={() => onView(view)}
            className="toolbar-btn"
          >
            {messages[view] || view}
          </button>
        ))}
          QUITO BOTON AGENDA. HASTA ENCONTRAR SOLUCION A LOS EVENTOS. YA QUE NO MUESTRA LA DESCRIPCION DE TODOS LOS EVENTOS DE UN DIA
      </div> */}
    </div>
  );
};

export default CustomToolbar;
