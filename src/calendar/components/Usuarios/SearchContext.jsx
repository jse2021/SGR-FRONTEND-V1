import React, { createContext } from "react";

export const SearchContext = createContext({
  result: {},
  setResult: (result) => {
    // Actualiza el estado del contexto
    context.state.result = result;
  },
});

export default SearchContext;