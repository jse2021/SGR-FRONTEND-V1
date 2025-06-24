// src/calendar/components/CustomToolbar.jsx
import React from "react";
import "./CustomToolbar.css";

export const CustomToolbar = ({ label, onNavigate }) => {
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
    </div>
  );
};

export default CustomToolbar;
