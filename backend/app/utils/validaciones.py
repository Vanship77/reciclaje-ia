def validar_cedula_ecuatoriana(cedula):
    """
    Valida una cédula ecuatoriana usando el algoritmo de Módulo 10.
    Retorna un diccionario con 'valida' (bool) y 'mensaje' (str).
    """
    # 1. Debe ser una cadena de texto
    if not isinstance(cedula, str):
        cedula = str(cedula)

    # 2. Debe tener exactamente 10 dígitos y ser numérica
    if not cedula.isdigit() or len(cedula) != 10:
        return {'valida': False, 'mensaje': 'La cédula debe tener 10 dígitos numéricos'}

    # 3. Los dos primeros dígitos representan la provincia (01-24)
    provincia = int(cedula[0:2])
    if provincia < 1 or provincia > 24:
        return {'valida': False, 'mensaje': 'El código de provincia no es válido'}

    # 4. El tercer dígito debe ser menor a 6 para cédulas de persona natural
    tercer_digito = int(cedula[2])
    if tercer_digito >= 6:
        return {'valida': False, 'mensaje': 'El tercer dígito de la cédula no es válido'}

    # 5. Algoritmo de Módulo 10
    coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
    suma = 0

    for i in range(9):
        digito = int(cedula[i]) * coeficientes[i]
        if digito >= 10:
            digito -= 9
        suma += digito

    digito_verificador_calculado = (10 - (suma % 10)) % 10
    digito_verificador_real = int(cedula[9])

    if digito_verificador_calculado != digito_verificador_real:
        return {'valida': False, 'mensaje': 'El dígito verificador no coincide'}

    return {'valida': True, 'mensaje': 'Cédula válida'}