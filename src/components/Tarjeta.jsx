import React, { useState } from "react";

function Tarjeta({ titulo, descripcion, imagen }) {
  const [likes, setLikes] = useState(0);

  const manejarLike = () => {
    setLikes(likes + 1);
  };
  

  return (
    <div style={estilos.card}>
      <img src={imagen} alt={titulo} style={estilos.imagen} />
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
      <button onClick={manejarLike}>❤️ Me gusta ({likes})</button>

    </div>
  );
}

const estilos = {
  card: {
    border: "1px solid #ccc",
    padding: "1rem",
    borderRadius: "8px",
    maxWidth: "250px",
    margin: "1rem",
    textAlign: "center"
  },
  imagen: {
    width: "100%",
    borderRadius: "8px"
  }
};

export default Tarjeta;
