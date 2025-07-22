import random

# Lista de primos pequeños y sus generadores conocidos
PRIMES_AND_GENERATORS = [
    (17, 3), (17, 5), (23, 5), (23, 7), (31, 3), (31, 11),
    (29, 2), (29, 3), (19, 2), (19, 3), (13, 2), (13, 6),
    # ... y así sucesivamente
]

def generate_finite_field_challenge():
    p, g = random.choice(PRIMES_AND_GENERATORS)
    challenge = {
        "p": p,
        "g": g,
        "question": f"Sea p={p}, g={g}. ¿Cuánto es g^PIN mod {p}? (Usa tu PIN como exponente)",
    }
    return challenge 