import React from 'react'
import { Navbar } from '../Navbar';
import './precios.css'
import { useState } from 'react';
import { calendarApi } from '../../../api';
import { useEffect } from 'react';

export const  PrecioCancha = () => {
  const [cancha, setCancha] = useState([]);
  const [id, setId] = useState(null);

  async function fetchData() {
    const response = await calendarApi.get("/cancha");
    console.log({ response });

    if (response.data.length > 0) {
      setCancha(response.data.map((cancha) => {
        return {
          id: cancha.id,
          nombre: cancha.nombre,
        };
      }));
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <h1 className="display-5">Precio de la Cancha</h1>
      <div className="col-md-8 login-form-3">
        <form action="">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Fecha Modificación</th>
                <th scope="col">Cancha Chica</th>
                <th scope="col">Cancha Mediana</th>
                <th scope="col">Cancha Grande</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2023/05/20</td>
                <td>6000</td>
                <td>2000</td>
                <td>500</td>
              </tr>
            </tbody>
          </table>

          <h1 className="display-6">Nuevos Precios</h1>
          <hr />
          <div className="container">
            <div className="row col-6">
              <div className="form-group mb-2">
                <select
                  class="form-select"
                  name="cancha"
                  id="cancha"
                  value={cancha && cancha.length > 0 ? cancha[0].id : null}
                  onChange={(e) => {
                    setId(e.target.value);
                  }}
                >
                  {cancha && cancha.length > 0 ? cancha.map((canchas) => (
                    <option key={canchas.id} value={canchas.id}>
                      {canchas.nombre}
                    </option>
                  )) : null}
                </select>
              </div>

              <div className="form-group mb-2">
                <input
                  type="number"
                  class="form-control montoCancha"
                  placeholder="Monto"
                  name="registerEmail"
                />
              </div>
            </div>
            <div className="d-grid gap-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Guardar"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PrecioCancha;
