def validar_cedula_ecuatoriana(cedula):
    cedula = cedula.replace(' ', '').replace('-', '')
    
    if len(cedula) != 10:
        return {'valida': False, 'mensaje': 'La cédula debe tener 10 dígitos'}
    if not cedula.isdigit():
        return {'valida': False, 'mensaje': 'La cédula debe contener solo números'}
    
    provincia = int(cedula[:2])
    if provincia < 1 or provincia > 24:
        return {'valida': False, 'mensaje': 'Provincia inválida'}
    
    digitos = [int(d) for d in cedula]
    ultimo_digito = digitos[-1]
    suma = 0
    
    for i in range(9):
        valor = digitos[i]
        if i % 2 == 0:
            valor *= 2
            if valor >= 10:
                valor -= 9
        suma += valor
    
    digito_verificador = (10 - (suma % 10)) % 10
    
    if digito_verificador != ultimo_digito:
        return {'valida': False, 'mensaje': 'Cédula inválida'}
    
    return {'valida': True, 'mensaje': 'Cédula válida'}