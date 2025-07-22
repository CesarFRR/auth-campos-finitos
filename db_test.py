from flask import Flask
from database import db, connect_to_database

app = Flask(__name__)
connect_to_database(app)

with app.app_context():
    try:
        # Mostrar todas las tablas
        inspector = db.inspect(db.engine)
        tablas = inspector.get_table_names()
        print("Tablas en la base de datos:", tablas)

        # Mostrar el contenido de una tabla específica (por ejemplo, la primera)
        if tablas:
            from sqlalchemy import text
            nombre_tabla = tablas[0]  # Cambia esto por el nombre de la tabla que quieres ver
            print(f"Contenido de la tabla '{nombre_tabla}':")
            resultado = db.session.execute(text(f"SELECT * FROM {nombre_tabla}"))
            filas = resultado.fetchall()
            for fila in filas:
                print(dict(fila._mapping))
        else:
            print("No hay tablas en la base de datos.")
    except Exception as e:
        print("Error al consultar las tablas:", e)