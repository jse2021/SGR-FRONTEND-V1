import React, { useEffect, useState } from "react";
import "./ListaCliente.css";
import { ResultadoPorCliente } from "./ResultadoPorCliente";
import { InputCliente } from "./InputCliente";

export const ListaCliente = ({ results }) => {
  return (
    <>
      <div className="results-list">
        {results.map((result, id) => {
          return <ResultadoPorCliente result={result} key={id} />;
        })}
      </div>
    </>
  );
};
