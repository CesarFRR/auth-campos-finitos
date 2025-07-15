from flask import Blueprint, render_template, request, redirect, url_for, session, flash, current_app, g
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os

# Blueprint de autenticación
auth_bp = Blueprint('auth', __name__)

# --- Utilidades de base de datos ---
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(current_app.config['DATABASE'])
        g.db.row_factory = sqlite3.Row
    return g.db

@auth_bp.teardown_app_request
def close_db(exception=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    db.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )''')
    db.commit()

# --- Rutas ---
@auth_bp.before_app_request
def initialize_database():
    init_db()

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if not email or not password:
            flash('Correo y contraseña requeridos')
            return redirect(url_for('auth.register'))
        hashed = generate_password_hash(password)
        try:
            db = get_db()
            db.execute('INSERT INTO users (email, password) VALUES (?, ?)', (email, hashed))
            db.commit()
            flash('Registro exitoso, ahora puedes iniciar sesión')
            return redirect(url_for('auth.login'))
        except sqlite3.IntegrityError:
            flash('El correo ya está registrado')
            return redirect(url_for('auth.register'))
    return render_template('register.html')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        db = get_db()
        user = db.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['email'] = user['email']
            username = user['email'].split('@')[0]
            flash('Bienvenido, ' + username)
            return redirect(url_for('auth.dashboard'))
        else:
            flash('Correo o contraseña incorrectos')
            return redirect(url_for('auth.login'))
    return render_template('login.html')

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada')
    return redirect(url_for('auth.login'))

@auth_bp.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash('Debes iniciar sesión')
        return redirect(url_for('auth.login'))
    return render_template('dashboard.html', email=session['email'])
