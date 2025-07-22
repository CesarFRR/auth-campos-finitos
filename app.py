import os
from dotenv import load_dotenv
from flask import Flask, redirect, url_for
from database import db, connect_to_database

load_dotenv()  # <--- Esto carga las variables del .env

# Factory de la aplicación

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

app = create_app()  # <-- Esto es lo que Vercel necesita

if __name__ == '__main__':
    app.run(debug=True) 