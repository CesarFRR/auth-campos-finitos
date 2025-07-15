import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, id, email, password_hash):
        self.id = id
        self.email = email
        self.password_hash = password_hash

    @staticmethod
    def create(db, email, password):
        password_hash = generate_password_hash(password)
        try:
            db.execute('INSERT INTO users (email, password) VALUES (?, ?)', (email, password_hash))
            db.commit()
            return True
        except sqlite3.IntegrityError:
            return False

    @staticmethod
    def find_by_email(db, email):
        user = db.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        if user:
            return User(user['id'], user['email'], user['password'])
        return None

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
