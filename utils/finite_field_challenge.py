import random

# Lista de primos pequeños y sus generadores conocidos
PRIMES_AND_GENERATORS = [
    (17, 3),
    (23, 5),
    (31, 3),
    (29, 2),
    (19, 2),
]

def generate_finite_field_challenge():
    p, g = random.choice(PRIMES_AND_GENERATORS)
    challenge = {
        "p": p,
        "g": g,
        "question": f"Sea p={p}, g={g}. ¿Cuánto es g^PIN mod {p}? (Usa tu PIN como exponente)",
    }
    return challenge 