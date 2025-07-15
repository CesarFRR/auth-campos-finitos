from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

def connect_to_database(app):
    # Puedes usar variables de entorno personalizadas o la URI completa
    db_uri = os.environ.get('MYSQL_ADDON_URI')
    if not db_uri:
        # Si prefieres variables separadas
        DB_USER = os.getenv('DB1_USER')
        DB_PASSWORD = os.getenv('DB1_PASSWORD')
        DB_HOST = os.getenv('DB1_HOST')
        DB_NAME = os.getenv('DB1_NAME')
        DB_PORT = os.getenv('DB1_PORT', '3306')
        db_uri = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

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
