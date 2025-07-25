from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from models.user import User
from database import db
from utils.finite_field_challenge import generate_finite_field_challenge
from werkzeug.security import generate_password_hash, check_password_hash

"""
 Un Blueprint en Flask que agrupa las rutas relacionadas con la autenticación.
 Permite organizar la aplicación de forma modular.
 @type {Blueprint}
 """
auth_bp = Blueprint('auth', __name__)

# --- Rutas ---
"""
 Gestiona el registro de nuevos usuarios.
 - Método GET: Muestra el formulario de registro.
 - Método POST: Procesa los datos del formulario (email, contraseña, PIN).
 Valida que los campos no estén vacíos, genera hashes seguros para la
 contraseña y el PIN, crea un nuevo objeto `User` y lo guarda en la
 base de datos. Redirige al login si el registro es exitoso, o muestra
 un mensaje de error si el correo ya existe o falla la validación.
 """
@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        pin = request.form['pin']
        if not email or not password or not pin:
            flash('Correo, contraseña y PIN requeridos')
            return redirect(url_for('auth.register'))
        password_hash = generate_password_hash(password)
        pin_hash = generate_password_hash(pin)
        try:
            nuevo_usuario = User(email=email, password_hash=password_hash, pin_hash=pin_hash)
            db.session.add(nuevo_usuario)
            db.session.commit()
            flash('Registro exitoso, ahora puedes iniciar sesión')
            return redirect(url_for('auth.login'))
        except Exception as e:
            print("Error en el registro:", e)
            print("No sé qué pasaaaa")
            db.session.rollback()
            flash('El correo ya está registrado o hubo un error')
            return redirect(url_for('auth.register'))
    return render_template('register.html')

"""
 Gestiona el inicio de sesión de los usuarios.
 - Método GET: Muestra el formulario de login.
 - Método POST: Procesa el email y la contraseña. Busca al usuario en la
 base de datos y verifica que el hash de la contraseña coincida.
 Si las credenciales son correctas, guarda el ID y el email del usuario
 en la sesión y lo redirige al desafío del PIN. En caso contrario,
 muestra un mensaje de error.
 """
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            session['email'] = user.email
            username = user.email.split('@')[0]
            # Después de un login exitoso, redirige al reto
            return redirect(url_for('auth.reto'))
        else:
            flash('Correo o contraseña incorrectos')
            return redirect(url_for('auth.login'))
    return render_template('login.html')

"""
 Cierra la sesión del usuario actual.
 Limpia todas las variables de la sesión y redirige al usuario a la
 página de inicio de sesión con un mensaje de confirmación.
 """
@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada')
    return redirect(url_for('auth.login'))

"""
 Muestra el panel de control principal del usuario.
 Primero, verifica si el usuario ha iniciado sesión comprobando la existencia
 de 'user_id' en la sesión. Si no ha iniciado sesión, lo redirige al login.
 Si está autenticado, renderiza la plantilla del dashboard.
 """
@auth_bp.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash('Debes iniciar sesión')
        return redirect(url_for('auth.login'))
    return render_template('dashboard.html', email=session['email'])

"""
 Gestiona el desafío criptográfico de segundo factor (PIN).
 - Método GET: Genera un nuevo desafío de campo finito (p, g, pregunta),
 lo guarda en la sesión y muestra la página del reto al usuario.
 - Método POST: Procesa el PIN y la respuesta del usuario. Verifica que el PIN
 sea correcto comparando su hash con el almacenado en la base de datos.
 Luego, calcula la solución correcta del desafío matemático (g^PIN mod p) y
 la compara con la respuesta del usuario. Redirige al dashboard si es
correcta, o muestra un mensaje de error si falla alguna de las validaciones.
 """
@auth_bp.route('/reto', methods=['GET', 'POST'])
def reto():
    if request.method == 'GET':
        reto = generate_finite_field_challenge()
        session['reto'] = reto
        return render_template('reto.html', question=reto['question'])
    else:
        pin = request.form.get('pin')
        user_answer = request.form.get('answer')
        reto = session.get('reto')
        user_id = session.get('user_id')
        if not (pin and user_answer and reto and user_id):
            flash('Todos los campos son obligatorios')
            return redirect(url_for('auth.reto'))
        user = User.query.get(user_id)
        if not user or not check_password_hash(user.pin_hash, pin):
            flash('PIN incorrecto')
            return redirect(url_for('auth.reto'))
        # Validar el reto matemático
        try:
            p = reto['p']
            g = reto['g']
            solution = pow(g, int(pin), p)
            if int(user_answer) == solution:
                flash('¡Respuesta correcta! Acceso concedido.')
                return redirect(url_for('auth.dashboard'))
            else:
                flash('Respuesta incorrecta. Intenta de nuevo.')
                return redirect(url_for('auth.reto'))
        except Exception:
            flash('Error al validar el reto. Intenta de nuevo.')
            return redirect(url_for('auth.reto'))

"""
 Renderiza la página que contiene la visualización interactiva de p5.js.
 Simplemente muestra la plantilla 'p5.html'.
 """
@auth_bp.route('/p5')
def p5():
    return render_template('p5.html')
