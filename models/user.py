from database import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    y = db.Column(db.String(255), nullable=False)  # El verificador público
    # Puedes agregar más campos si lo necesitas (p, g, etc.)
