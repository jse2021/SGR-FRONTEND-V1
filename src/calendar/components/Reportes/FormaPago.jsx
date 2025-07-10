import React from "react";
import { Navbar } from "../Navbar";
import DatePicker from "react-datepicker";
import AsyncSelect from "react-select/async";

export const FormaPago = () => {
  return (
    <>
      <Navbar />
      <h1 className="text-center my-4">
        Control Formas de Pago(en construccion)
      </h1>
      <div className="col-md-8 login-form-3 mx-auto">
        <form>
          <div className="row align-items-end g-2">
            {/* Fecha */}
            <div className="col-md-3">
              <DatePicker
                className="form-control w-100"
                placeholderText="Seleccionar fecha"
                dateFormat="dd/MM/yyyy"
                locale="es"
              />
            </div>

            {/* Cancha */}
            <div className="col-md-3">
              <AsyncSelect
                classNamePrefix="react-select"
                className="w-100"
                name="cancha"
                placeholder="Cancha"
                defaultOptions
              />
            </div>

            {/* Forma de pago */}
            <div className="col-md-3">
              <AsyncSelect
                classNamePrefix="react-select"
                className="w-100"
                name="f.pago"
                placeholder="Forma de pago"
                defaultOptions
              />
            </div>

            {/* Estado */}
            <div className="col-md-3">
              <AsyncSelect
                classNamePrefix="react-select"
                className="w-100"
                name="e.pago"
                placeholder="Estado de pago"
                defaultOptions
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <input
              type="button"
              className="btn btn-dark px-5 py-2 rounded-pill"
              value="Buscar"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default FormaPago;
