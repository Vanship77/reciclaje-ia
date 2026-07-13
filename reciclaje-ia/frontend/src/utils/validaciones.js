export const validarCedulaEcuatoriana = (cedula) => {
  const cedulaLimpia = cedula.replace(/\D/g, '');
  
  if (cedulaLimpia.length !== 10) {
    return { valida: false, mensaje: 'La cédula debe tener 10 dígitos' };
  }

  if (/^0{10}$/.test(cedulaLimpia)) {
    return { valida: false, mensaje: 'Cédula inválida' };
  }

  const provincia = parseInt(cedulaLimpia.substring(0, 2));
  if (provincia < 1 || provincia > 24) {
    return { valida: false, mensaje: 'Provincia inválida' };
  }

  const digitos = cedulaLimpia.split('').map(Number);
  const primerDigito = digitos[9];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let multiplicador = i % 2 === 0 ? 2 : 1;
    let valor = digitos[i] * multiplicador;
    if (valor >= 10) valor -= 9;
    suma += valor;
  }

  const digitoVerificador = (10 - (suma % 10)) % 10;

  if (digitoVerificador !== primerDigito) {
    return { valida: false, mensaje: 'Cédula inválida - dígito verificador incorrecto' };
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