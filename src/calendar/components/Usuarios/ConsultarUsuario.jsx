import React, { useEffect, useState } from 'react'
import { Navbar } from '../Navbar';
import TablaUsuarios from './TablaUsuarios';
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
  
    const {q = ''} = queryString.parse(location.search);

    const {searchText,onInputChange} = useForm({
      searchText:q
    });       
    
    const {mostrarUsuarios} = getUsuarioByApellido();
    
    mostrarUsuarios();  
      
    useEffect(()=>{    
      
        console.log(searchText);
      },[searchText])

  return (
    <>
    <Navbar />
    <h1 className='display-5'>Consultar Usuarios</h1>
    <div className="col-md-8 login-form-3">        
      <form>
          <div className="form-group mb-2">
              <input 
                  id='btn-consultar'
                  type="text"
                  className="form-control"
                  placeholder="Ingrese Usuario"
                  name="searchText"
                  autoComplete='off'
                  value={searchText}
                  onChange={onInputChange}
              />
          </div>
          <hr />
          <TablaUsuarios/>

      </form>
    </div>
    </>
  )
}
export default ConsultarUsuario;