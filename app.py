"""
 Importa las dependencias necesarias.
 - `os`: Para interactuar con el sistema operativo, principalmente para acceder a variables de entorno.
 - `dotenv`: Para cargar variables de entorno desde un archivo .env durante el desarrollo local.
 - `Flask`, `redirect`, `url_for`: Componentes centrales de Flask para crear la aplicación y manejar rutas.
 - `db`, `connect_to_database`: Funciones y objetos personalizados del módulo `database` para la gestión de la base de datos.
 """
import os
from dotenv import load_dotenv
from flask import Flask, redirect, url_for
from database import db, connect_to_database

"""
 Carga las variables de entorno definidas en un archivo `.env` en la raíz del proyecto.
 Esto es útil para mantener las configuraciones sensibles (como claves secretas o URLs de bases de datos)
 fuera del código fuente.
 """
load_dotenv()  # <--- Esto carga las variables del .env

"""
 Implementa el patrón "Application Factory". Esta función es responsable de crear y configurar
 la instancia de la aplicación Flask. Este patrón mejora la modularidad y facilita las pruebas.
 @returns {Flask} La instancia de la aplicación Flask configurada.
 """
def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'supersecreto')
    print("secret aqui: "+ app.config['SECRET_KEY'] )
    
    # Usar la función connect_to_database para configurar la base de datos y migraciones
    connect_to_database(app)

    # Importar y registrar blueprints
    from auth.routes import auth_bp
    app.register_blueprint(auth_bp)

    # Ruta raíz
    @app.route('/')
    def index():
        return redirect(url_for('auth.login'))


    return app

"""
 Crea la instancia principal de la aplicación Flask.
 @type {Flask}
 """
app = create_app()  # <-- Esto es lo que Vercel necesita


"""
 Bloque de ejecución principal.
 Este código solo se ejecuta cuando el script `app.py` es ejecutado directamente
 (por ejemplo, con `python app.py`), y no cuando es importado por otro módulo.
 Se utiliza para iniciar el servidor de desarrollo de Flask.
 """
if __name__ == '__main__':
    app.run(debug=True) 