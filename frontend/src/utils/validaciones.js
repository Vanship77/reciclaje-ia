# TODO: Implementar validaciones
# - validarCedulaEcuatoriana(cedula): Algoritmo módulo 10
# - validarEmail(email): Validar formato email
# - validarPassword(password): Mínimo 6 caracteres

export const validarCedulaEcuatoriana = (cedula) => {
  # TODO: Implementar validación de cédula ecuatoriana
  # 1. Limpiar entrada (espacios, guiones)
  # 2. Validar longitud 10 dígitos
  # 3. Validar provincia (01-24)
  # 4. Aplicar algoritmo de módulo 10
  # 5. Devolver { valida: true/false, mensaje: string }
  return { valida: true, mensaje: 'Cédula válida' };
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarPassword = (password) => {
  if (password.length < 6) {
    return { valida: false, mensaje: 'La contraseña debe tener al menos 6 caracteres' };
  }
  return { valida: true, mensaje: 'Contraseña válida' };
};
