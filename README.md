# Cripto Login: Autenticación con Retos de Campos Finitos

## ¿Qué es este proyecto?

Este proyecto es una aplicación de autenticación que utiliza retos matemáticos basados en **campos finitos** y **generadores**. El objetivo es reforzar conceptos de criptografía y seguridad de la información, aplicando operaciones modulares que son la base de muchos sistemas criptográficos modernos.

---

## ¿Cómo funciona el reto?

1. **Al iniciar sesión**, el usuario debe resolver un reto matemático:
   - Se le da un número primo \( p \) y un generador \( g \).
   - El usuario debe calcular \( g^{PIN} mod p \), usando su PIN como exponente.
2. **El backend valida** que el PIN sea correcto y que la respuesta matemática sea la esperada.

---

## ¿Qué es un campo finito?

Un **campo finito** (o cuerpo finito) es un conjunto de números con un número finito de elementos donde se pueden hacer sumas, restas, multiplicaciones y divisiones (excepto por cero), y siempre se obtiene otro elemento del mismo conjunto. En criptografía, se usan mucho los campos de la forma \( \mathbb{Z}_p \), donde \( p \) es un número primo.

---

## ¿Qué es un generador?

En el grupo multiplicativo de un campo finito \( \mathbb{Z}_p^* \) (los números del 1 al \( p-1 \) con la operación multiplicación módulo \( p \)), un **generador** \( g \) es un número tal que, al elevarlo a todas las potencias posibles, genera todos los elementos del grupo.

**Formalmente:**
\[
\{g^1 mod p, g^2 mod p, ..., g^{p-1} mod p\}
\]
produce todos los números del 1 al \( p-1 \) sin repetir.

### Ejemplo:
Para \( p = 7 \), el grupo es \( \{1, 2, 3, 4, 5, 6\} \).
Si tomas \( g = 3 \):
- \( 3^1 mod 7 = 3 \)
- \( 3^2 mod 7 = 2 \)
- \( 3^3 mod 7 = 6 \)
- \( 3^4 mod 7 = 4 \)
- \( 3^5 mod 7 = 5 \)
- \( 3^6 mod 7 = 1 \)

¡Obtienes todos los elementos del grupo! Por eso, 3 es un generador de \( \mathbb{Z}_7^* \).

---

## ¿Por qué es importante un generador?

- Los generadores son la base de muchos sistemas criptográficos (como Diffie-Hellman, ElGamal, etc.).
- Permiten que, al elegir un exponente secreto (como el PIN), el resultado \( g^{PIN} mod p \) sea impredecible y cubra todo el grupo, lo que da seguridad.

---

## ¿Cómo se usa en este proyecto?

1. **Selección de parámetros:**  
   Cuando un usuario intenta iniciar sesión, el sistema selecciona aleatoriamente un número primo \( p \) y un generador \( g \) asociados a ese primo. Estos valores se eligen de una lista de pares conocidos donde \( g \) es un generador del grupo multiplicativo de \( \mathbb{Z}_p^* \).

2. **Presentación del reto:**  
   Al usuario se le muestra un reto matemático que consiste en calcular la expresión \( g^{PIN} mod p \), donde:
   - \( g \) es el generador elegido,
   - \( p \) es el número primo,
   - y el **PIN** es el valor secreto que el usuario eligió al registrarse (similar a una contraseña numérica).

3. **Resolución por parte del usuario:**  
   El usuario debe recordar su PIN y realizar la operación de exponenciación modular:  
   - Eleva el generador \( g \) a la potencia de su PIN,
   - Calcula el resultado módulo \( p \),
   - Ingresa ese resultado como respuesta al reto.

4. **Validación en el backend:**  
   El sistema, al recibir la respuesta y el PIN ingresado, realiza dos comprobaciones:
   - Verifica que el PIN ingresado sea correcto (comparándolo de forma segura con el PIN almacenado de ese usuario).
   - Calcula internamente \( g^{PIN} mod p \) y compara el resultado con la respuesta enviada por el usuario.

5. **Acceso o rechazo:**  
   - Si ambas comprobaciones son correctas, el usuario accede al sistema.
   - Si alguna es incorrecta, se le niega el acceso y puede intentarlo de nuevo.

### ¿Por qué este mecanismo?

Este proceso obliga al usuario a entender y aplicar operaciones de aritmética modular, que son la base de muchos algoritmos criptográficos modernos. Además, al usar el PIN como exponente, se refuerza la importancia de mantenerlo secreto y se demuestra cómo un dato aparentemente simple puede ser usado en un contexto matemático seguro gracias a las propiedades de los campos finitos y los generadores.

En resumen, este proyecto no solo protege el acceso, sino que también sirve como herramienta educativa para comprender cómo funcionan los sistemas de autenticación basados en criptografía moderna.

---

## Esquema de la base de datos

Para el correcto funcionamiento del sistema, se requiere una tabla de usuarios con el siguiente esquema:

| Campo         | Tipo           | Clave primaria | Único | Permite nulo | Descripción                |
|---------------|---------------|----------------|-------|--------------|----------------------------|
| id            | Integer       | Sí             | No    | No           | Identificador del usuario  |
| email         | String(255)   | No             | Sí    | No           | Correo electrónico         |
| password_hash | String(255)   | No             | No    | No           | Hash de la contraseña      |
| pin_hash      | String(255)   | No             | No    | No           | Hash del PIN               |

### Descripción de campos:

- **id:** Identificador único para cada usuario en la base de datos.
- **email:** Correo electrónico del usuario, utilizado para el inicio de sesión y recuperación de cuenta.
- **password_hash:** Hash de la contraseña del usuario, almacenado por razones de seguridad.
- **pin_hash:** Hash del PIN del usuario, utilizado en el proceso de autenticación basado en retos.

> **Nota:** Todos los campos son obligatorios y no pueden ser nulos, excepto el campo `id` que se genera automáticamente.
