from flask import Flask
import os

# Factory de la aplicación

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='supersecreto',
        DATABASE=os.path.join(app.instance_path, 'usuarios.db')
    )

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
        return '¡Bienvenido! La app está funcionando.'

    return app

app = create_app()  # <-- Esto es lo que Vercel necesita

if __name__ == '__main__':
    app.run(debug=True) 