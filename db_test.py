from database import db, connect_to_database
from flask import Flask
from sqlalchemy import text

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
connect_to_database(app)

with app.app_context():
    try:
        engine = db.engine  # Usar la propiedad 'engine' en vez de 'get_engine'
        with engine.connect() as connection:
            print("Conexión exitosa a la base de datos.")
            result = connection.execute(text("SHOW TABLES;"))  # Usar 'text' para consultas SQL crudas
            print("Tablas en la base de datos:")
            for row in result:
                print(row[0])
    except Exception as e:
        print("Error al conectar a la base de datos:", e)
