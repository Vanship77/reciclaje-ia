// TODO: Implementar validaciones
// - validarCedulaEcuatoriana(cedula): Algoritmo módulo 10
// - validarEmail(email): Validar formato email
// - validarPassword(password): Mínimo 6 caracteres

export const validarCedulaEcuatoriana = (cedula) => {
  const limpia = String(cedula).replace(/[\s-]/g, '');

  if (!/^\d{10}$/.test(limpia)) {
    return { valida: false, mensaje: 'La cédula debe tener 10 dígitos numéricos' };
  }

  const provincia = parseInt(limpia.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) {
    return { valida: false, mensaje: 'Código de provincia inválido' };
  }

  const tercerDigito = parseInt(limpia[2], 10);
  if (tercerDigito > 6) {
    return { valida: false, mensaje: 'Cédula inválida' };
  }

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const digitoVerificador = parseInt(limpia[9], 10);

  const suma = coeficientes.reduce((acc, coef, i) => {
    let valor = parseInt(limpia[i], 10) * coef;
    if (valor > 9) valor -= 9;
    return acc + valor;
  }, 0);

  const modulo = suma % 10;
  const resultado = modulo === 0 ? 0 : 10 - modulo;

  if (resultado !== digitoVerificador) {
    return { valida: false, mensaje: 'Cédula inválida' };
  }

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
