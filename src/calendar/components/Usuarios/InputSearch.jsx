import React, { useState } from 'react'

export const InputSearch = () => {
    const [value, setValue] = useState("");
    const handleChange = (event) => {
        setValue(event.target.value);
        console.log(event.target.value)
    };
  
    return (
        <div className="form-group mb-2">
            <input
                type="text"
                placeholder="Buscar Usuario"
                value={value}
                onChange={handleChange}
            />
        </div>
  )
}
export default InputSearch;