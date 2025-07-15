from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from models.user import User
from app import db

# Blueprint de autenticación
auth_bp = Blueprint('auth', __name__)

# --- Rutas ---
@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if not email or not password:
            flash('Correo y contraseña requeridos')
            return redirect(url_for('auth.register'))
        # Aquí deberías calcular el verificador público y (por ahora, lo dejamos como el email para pruebas)
        y = email  # Sustituye esto por el cálculo real de y cuando implementes el reto-respuesta
        try:
            nuevo_usuario = User(email=email, y=y)
            db.session.add(nuevo_usuario)
            db.session.commit()
            flash('Registro exitoso, ahora puedes iniciar sesión')
            return redirect(url_for('auth.login'))
        except Exception as e:
            db.session.rollback()
            flash('El correo ya está registrado o hubo un error')
            return redirect(url_for('auth.register'))
    return render_template('register.html')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        # Aquí deberías implementar el reto-respuesta, por ahora solo verifica si existe el usuario
        if user:
            session['user_id'] = user.id
            session['email'] = user.email
            username = user.email.split('@')[0]
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
