
"""
 Importa la instancia del objeto SQLAlchemy (comúnmente llamado 'db')
 desde un archivo de configuración de la base de datos (database.py).
 Este objeto conecta la aplicación Flask con la base de datos.
 """
from database import db

"""
 Define el modelo de datos del usuario.
 Cada instancia de esta clase representará una fila (un usuario) en la tabla 'users'.
 La clase hereda de `db.Model`, lo que le otorga las funcionalidades de SQLAlchemy
 para interactuar con la base de datos.
 """
class User(db.Model):
    """
     Define explícitamente el nombre de la tabla en la base de datos.
     Si no se especifica, SQLAlchemy lo inferiría como 'user'.
     """
    __tablename__ = 'users'

    """
     Define la columna 'id'.
     - `db.Integer`: El tipo de dato será un número entero.
     - `primary_key=True`: Marca esta columna como la clave primaria,
     lo que asegura que cada valor sea único y se use para identificar cada fila.
     Generalmente, la base de datos se encargará de autoincrementar este valor.
     """
    id = db.Column(db.Integer, primary_key=True)

    """
     Define la columna 'email'.
     - `db.String(255)`: El tipo de dato es una cadena de texto con un máximo de 255 caracteres.
     - `unique=True`: Asegura que no puede haber dos usuarios con el mismo email.
     - `nullable=False`: Indica que esta columna no puede estar vacía; siempre debe tener un valor.
     """
    email = db.Column(db.String(255), unique=True, nullable=False)

    """
     Define la columna 'password_hash'.
     Almacenará el hash de la contraseña del usuario, nunca la contraseña en texto plano.
     - `db.String(255)`: Espacio suficiente para la mayoría de los algoritmos de hash.
     - `nullable=False`: Es un campo obligatorio para cada usuario.
     """
    password_hash = db.Column(db.String(255), nullable=False)

    """
     Define la columna 'pin_hash'.
     Almacenará el hash de un PIN de seguridad del usuario.
     - `db.String(255)`: Espacio para el hash del PIN.
     - `nullable=False`: Es un campo obligatorio.
     """
    pin_hash = db.Column(db.String(255), nullable=False)