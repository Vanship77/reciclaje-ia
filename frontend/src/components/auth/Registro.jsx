import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

# TODO: Implementar Registro
# 1. Formulario con: cédula, email, nombre, password, confirmPassword
# 2. Validar cédula ecuatoriana con validarCedulaEcuatoriana()
# 3. Validar email y contraseña
# 4. Llamar a función registro del contexto

const Registro = () => {
  const [formData, setFormData] = useState({
    cedula: '',
    email: '',
    nombre: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    # TODO: Implementar registro con validaciones
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Crear cuenta
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          # TODO: Implementar formulario completo
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cédula
            </label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={(e) => setFormData({...formData, cedula: e.target.value})}
              className="input-field mt-1"
              maxLength="10"
              placeholder="1234567890"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Registrarse
          </button>
          <Link to="/login" className="text-green-600 text-sm">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Registro;
