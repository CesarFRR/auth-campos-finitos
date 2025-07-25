"""
 Importa las dependencias necesarias.
 - `SQLAlchemy`: El Object-Relational Mapper (ORM) que facilita la interacción con la base de datos.
 - `os`: Para acceder a las variables de entorno donde se almacenan las credenciales de la base de datos.
 """
from flask_sqlalchemy import SQLAlchemy
import os

"""
 Crea una instancia global del objeto SQLAlchemy.
 Esta instancia 'db' se asociará con la aplicación Flask más adelante
 y se usará en todo el proyecto para definir modelos y ejecutar consultas.
 @type {SQLAlchemy}
 """
db = SQLAlchemy()

"""
 Configura y establece la conexión con la base de datos para la aplicación Flask.
 Esta función lee las credenciales de la base de datos desde las variables de entorno,
 construye la URI de conexión, inicializa la instancia 'db' con la aplicación,
 y finalmente intenta crear todas las tablas definidas en los modelos.
 @param {Flask} app - La instancia de la aplicación Flask a la que se conectará la base de datos.
 """
def connect_to_database(app):
    # Puedes usar variables de entorno personalizadas o la URI completa
    db_uri = os.environ.get('MYSQL_ADDON_URI')
    if not db_uri:
        # Si prefieres variables separadas
        DB_USER = os.getenv('MYSQL_ADDON_USER')
        DB_PASSWORD = os.getenv('MYSQL_ADDON_PASSWORD')
        DB_HOST = os.getenv('MYSQL_ADDON_HOST')
        DB_NAME = os.getenv('MYSQL_ADDON_DB')
        DB_PORT = os.getenv('MYSQL_ADDON_PORT', '3306')
        db_uri = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        print(" db uri: " + db_uri)

    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    # Crear las tablas automáticamente al inicializar la app
    try:
        with app.app_context():
            db.create_all()
            print("¡Tablas creadas correctamente!")
    except Exception as e:
        print("Error al crear las tablas:", e)
