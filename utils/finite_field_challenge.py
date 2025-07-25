import random

"""
 Una lista de tuplas que contiene pares de números primos pequeños (p) y 
 uno de sus generadores (g) o raíces primitivas.
 Estos valores se utilizan para seleccionar aleatoriamente los parámetros 
 de un desafío criptográfico.
 @const {list[tuple[int, int]]}
 """
PRIMES_AND_GENERATORS = [
    (17, 3), (17, 5), (23, 5), (23, 7), (31, 3), (31, 11),
    (29, 2), (29, 3), (19, 2), (19, 3), (13, 2), (13, 6),
    # ... y así sucesivamente
]

"""
 Genera un desafío de criptografía basado en el problema del logaritmo discreto
 en un campo finito.
 Esta función selecciona aleatoriamente un par de primo (p) y generador (g) de la 
 lista `PRIMES_AND_GENERATORS`. Luego, construye un diccionario que contiene estos
 parámetros y una pregunta formulada para el usuario. El desafío consiste en que el
 usuario debe calcular `g` elevado a su PIN, todo ello en módulo `p`.
 *
 @returns {dict} Un diccionario que contiene el primo 'p', el generador 'g' y la 'pregunta' para el usuario.
 """
def generate_finite_field_challenge():
    p, g = random.choice(PRIMES_AND_GENERATORS)
    challenge = {
        "p": p,
        "g": g,
        "question": f"Sea p={p}, g={g}. ¿Cuánto es g^PIN mod {p}? (Usa tu PIN como exponente)",
    }
    return challenge 