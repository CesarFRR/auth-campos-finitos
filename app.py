import os
from flask import Flask, redirect, url_for
from database import db

# Factory de la aplicación

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'supersecreto')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('MYSQL_ADDON_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Asegura que la carpeta instance exista
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

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