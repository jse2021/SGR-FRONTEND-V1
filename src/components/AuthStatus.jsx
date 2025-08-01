import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { onLogin, onLogout } from "../store/auth/authSlice";

export const AuthStatus = () => {
  const dispatch = useDispatch();
  const { status, user } = useSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(onLogin({ name: "José", email: "jose@mail.com" }));
  };

  const handleLogout = () => {
    dispatch(onLogout());
  };

  return (
    <div
      style={{ border: "1px solid #ddd", padding: "1rem", marginTop: "1rem" }}
    >
      <h3>Estado de Autenticación</h3>
      <p>
        <strong>Status:</strong> {status}
      </p>

      {user ? (
        <p>
          <strong>Usuario:</strong> {user.name} ({user.email})
        </p>
      ) : (
        <p>No hay usuario logueado</p>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleLogin} style={{ marginRight: "1rem" }}>
          Simular Login
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};
