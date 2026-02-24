// static/auth.js
// Sistema completo de autenticación con Firebase

// ===== ESTADO GLOBAL DE AUTENTICACIÓN =====
let currentUser = null;

// Escuchar cambios en el estado de autenticación
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    // Usuario ha iniciado sesión
    currentUser = user;
    console.log('Usuario autenticado:', user.email);
    
    // Guardar en sessionStorage/localStorage
    if (document.getElementById('rememberMe')?.checked) {
      localStorage.setItem('webcraft_user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
    } else {
      sessionStorage.setItem('webcraft_user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
    }

    // Redirigir al editor si estamos en login
    if (window.location.pathname.includes('login.html')) {
      showToast('¡Bienvenido de vuelta! ✨', 'green');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }
  } else {
    // Usuario no autenticado
    currentUser = null;
    localStorage.removeItem('webcraft_user');
    sessionStorage.removeItem('webcraft_user');
    
    // Si no estamos en login y no es una página pública, redirigir
    if (!window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('public/')) {
      window.location.href = 'login.html';
    }
  }
});

// ===== FUNCIONES DE AUTENTICACIÓN =====

// Iniciar sesión con email y contraseña
async function signInWithEmail(email, password) {
  try {
    showLoading(true);
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    showToast('¡Inicio de sesión exitoso!', 'green');
    return userCredential.user;
  } catch (error) {
    handleAuthError(error);
    throw error;
  } finally {
    showLoading(false);
  }
}

// Registrar nuevo usuario
async function signUpWithEmail(email, password, displayName) {
  try {
    showLoading(true);
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    
    // Actualizar perfil con nombre
    await userCredential.user.updateProfile({
      displayName: displayName
    });

    // Crear documento en Firestore para el usuario
    await db.collection('users').doc(userCredential.user.uid).set({
      email: email,
      displayName: displayName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      projects: [],
      settings: {
        theme: 'light',
        defaultDevice: 'desktop'
      }
    });

    showToast('¡Cuenta creada exitosamente!', 'green');
    return userCredential.user;
  } catch (error) {
    handleAuthError(error);
    throw error;
  } finally {
    showLoading(false);
  }
}

// Iniciar sesión con Google
async function signInWithGoogle() {
  try {
    showLoading(true);
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await firebase.auth().signInWithPopup(provider);
    
    // Verificar si es primer inicio y crear documento
    const userDoc = await db.collection('users').doc(result.user.uid).get();
    if (!userDoc.exists) {
      await db.collection('users').doc(result.user.uid).set({
        email: result.user.email,
        displayName: result.user.displayName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        projects: [],
        settings: {
          theme: 'light',
          defaultDevice: 'desktop'
        }
      });
    }
    
    showToast('¡Bienvenido!', 'green');
  } catch (error) {
    handleAuthError(error);
  } finally {
    showLoading(false);
  }
}

// Iniciar sesión con Microsoft
async function signInWithMicrosoft() {
  try {
    showLoading(true);
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    provider.addScope('User.Read');
    
    const result = await firebase.auth().signInWithPopup(provider);
    
    // Verificar si es primer inicio
    const userDoc = await db.collection('users').doc(result.user.uid).get();
    if (!userDoc.exists) {
      await db.collection('users').doc(result.user.uid).set({
        email: result.user.email,
        displayName: result.user.displayName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        projects: [],
        settings: {
          theme: 'light',
          defaultDevice: 'desktop'
        }
      });
    }
    
    showToast('¡Bienvenido!', 'green');
  } catch (error) {
    handleAuthError(error);
  } finally {
    showLoading(false);
  }
}

// Cerrar sesión
async function signOut() {
  try {
    await firebase.auth().signOut();
    showToast('Sesión cerrada', 'green');
    window.location.href = 'login.html';
  } catch (error) {
    handleAuthError(error);
  }
}

// Restablecer contraseña
async function resetPassword(email) {
  try {
    showLoading(true);
    await firebase.auth().sendPasswordResetEmail(email);
    showToast('Correo de restablecimiento enviado', 'green');
  } catch (error) {
    handleAuthError(error);
  } finally {
    showLoading(false);
  }
}

// ===== MANEJADORES DE EVENTOS =====

// Evento del formulario de login
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        await signInWithEmail(email, password);
      } catch (error) {
        // Error ya manejado en signInWithEmail
      }
    });
  }

  // Verificar si hay sesión guardada
  const savedUser = localStorage.getItem('webcraft_user');
  if (savedUser && !currentUser) {
    // Intentar reautenticación silenciosa
    firebase.auth().signInWithEmailAndPassword(
      JSON.parse(savedUser).email, 
      sessionStorage.getItem('temp_password') || ''
    ).catch(() => {
      localStorage.removeItem('webcraft_user');
    });
  }
});

// Mostrar/ocultar contraseña
function togglePassword() {
  const passwordInput = document.getElementById('password');
  const toggleIcon = document.querySelector('.toggle-password');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
  }
}

// Olvidé mi contraseña
function forgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById('email')?.value;
  
  if (!email) {
    showToast('Ingresa tu correo primero', 'red');
    return;
  }
  
  resetPassword(email);
}

// Mostrar formulario de registro
function showRegister(event) {
  event.preventDefault();
  const loginTitle = document.querySelector('.login-title');
  const loginSubtitle = document.querySelector('.login-subtitle');
  const loginBtn = document.getElementById('loginBtn');
  const signupPrompt = document.querySelector('.signup-prompt');
  
  if (loginTitle.textContent === 'Bienvenido de vuelta') {
    // Cambiar a modo registro
    loginTitle.textContent = 'Crea tu cuenta';
    loginSubtitle.textContent = 'Comienza a diseñar páginas increíbles gratis';
    loginBtn.innerHTML = '<span>Registrarse</span>';
    signupPrompt.innerHTML = '¿Ya tienes cuenta? <a href="#" onclick="showLogin(event)">Inicia sesión</a>';
    
    // Añadir campo de nombre si no existe
    if (!document.getElementById('displayName')) {
      const emailGroup = document.querySelector('.input-group');
      const nameGroup = document.createElement('div');
      nameGroup.className = 'input-group';
      nameGroup.innerHTML = `
        <label for="displayName">Nombre completo</label>
        <div class="input-wrapper">
          <i class="fas fa-user"></i>
          <input type="text" id="displayName" placeholder="Ana García" required>
        </div>
      `;
      emailGroup.parentNode.insertBefore(nameGroup, emailGroup);
    }
  } else {
    // Mostrar formulario de registro
    showLogin(event);
  }
}

// Volver a modo login
function showLogin(event) {
  event.preventDefault();
  const loginTitle = document.querySelector('.login-title');
  const loginSubtitle = document.querySelector('.login-subtitle');
  const loginBtn = document.getElementById('loginBtn');
  const signupPrompt = document.querySelector('.signup-prompt');
  const nameGroup = document.getElementById('displayName')?.parentNode?.parentNode;
  
  if (nameGroup) nameGroup.remove();
  
  loginTitle.textContent = 'Bienvenido de vuelta';
  loginSubtitle.textContent = 'Inicia sesión para continuar creando páginas increíbles';
  loginBtn.innerHTML = '<span>Iniciar sesión</span>';
  signupPrompt.innerHTML = '¿No tienes una cuenta? <a href="#" onclick="showRegister(event)">Regístrate gratis</a>';
}

function showToast(message, type = '') {
  const container = document.getElementById('toasts');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2900);
}

// Mostrar loading
function showLoading(show) {
  const btn = document.getElementById('loginBtn');
  if (!btn) return;
  
  if (show) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
  } else {
    btn.disabled = false;
    btn.innerHTML = '<span>Iniciar sesión</span>';
  }
}

function handleAuthError(error) {
  console.error('Error de autenticación:', error);
  
  let message = 'Error al iniciar sesión';
  switch (error.code) {
    case 'auth/invalid-email':
      message = 'Correo electrónico inválido';
      break;
    case 'auth/user-disabled':
      message = 'Usuario deshabilitado';
      break;
    case 'auth/user-not-found':
      message = 'Usuario no encontrado';
      break;
    case 'auth/wrong-password':
      message = 'Contraseña incorrecta';
      break;
    case 'auth/email-already-in-use':
      message = 'El correo ya está registrado';
      break;
    case 'auth/weak-password':
      message = 'La contraseña debe tener al menos 6 caracteres';
      break;
    case 'auth/popup-closed-by-user':
      message = 'Ventana de autenticación cerrada';
      break;
    default:
      message = error.message;
  }
  
  showToast(message, 'red');
}

async function saveProjectToFirestore(projectData) {
  if (!currentUser) {
    showToast('Debes iniciar sesión para guardar', 'red');
    return false;
  }
  
  try {
    showLoading(true);
    
    const projectRef = db.collection('users').doc(currentUser.uid)
      .collection('projects').doc(projectData.id || Date.now().toString());
    
    await projectRef.set({
      ...projectData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    showToast('Proyecto guardado', 'green');
    return true;
  } catch (error) {
    console.error('Error al guardar:', error);
    showToast('Error al guardar', 'red');
    return false;
  } finally {
    showLoading(false);
  }
}

async function loadUserProjects() {
  if (!currentUser) return [];
  
  try {
    const snapshot = await db.collection('users').doc(currentUser.uid)
      .collection('projects')
      .orderBy('updatedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
    return [];
  }
}

window.auth = {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithMicrosoft,
  signOut,
  resetPassword,
  saveProjectToFirestore,
  loadUserProjects,
  currentUser: () => currentUser
};