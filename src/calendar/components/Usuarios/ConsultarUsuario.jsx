import React, { useEffect, useState } from 'react'
import { Navbar } from '../Navbar';
import TablaUsuarios from './TablaUsuarios';
import InputSearch from './InputSearch';
import { getUsuarioByApellido } from './getUsuarioByApellido';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string'
import { useForm } from '../../../hooks';


/**
 * 1 - SEPARAR LA TABLA EN OTRO COMPONENTE
 * 2- INCORPORAR EL COMPONENTE AL CONSULTAR USUARIO
 * 3- DISEÑAR EL GetUsuarioByApellido
 * 4- LLAMARLO AL CONSULTAR USUARIO
 */
export const ConsultarUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit  = async () => {
    const {mostrarUsuarios} = getUsuarioByApellido();
    const usuarios = await mostrarUsuarios(value);
    setUsuarios(usuarios);
    console.log("handleSubmit() called!");
  };

  return (
    <>
    <Navbar />
    <h1 className='display-5'>Consultar Usuarios</h1>
    <div className="col-md-8 login-form-3">        
    <form onSubmit={(event) => {
       event.preventDefault();
       handleSubmit();
    }}>
        <InputSearch value={value} onChange={handleChange} />
          <hr />
          <TablaUsuarios usuarios = {usuarios}/>
      </form>
    </div>
    </>
  )
}
export default ConsultarUsuario;