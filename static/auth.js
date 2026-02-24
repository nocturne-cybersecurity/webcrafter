// auth.js - Manejo de autenticación

// Función para mostrar toasts/notificaciones
function showToast(message, type = 'green') {
  const toasts = document.getElementById('toasts');
  if (!toasts) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${type === 'green' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
  
  toasts.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Función para mostrar/ocultar contraseña
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

// Función para recuperar contraseña
function forgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById('email')?.value;
  
  if (!email) {
    showToast('Por favor ingresa tu correo electrónico', 'red');
    return;
  }
  
  auth.sendPasswordResetEmail(email)
    .then(() => {
      showToast('Correo de recuperación enviado. Revisa tu bandeja de entrada.', 'green');
    })
    .catch(error => {
      console.error('Error al enviar correo de recuperación:', error);
      let errorMessage = 'Error al enviar correo de recuperación';
      
      switch(error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo electrónico';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta más tarde';
          break;
      }
      
      showToast(errorMessage, 'red');
    });
}

// Función para mostrar formulario de registro
function showRegister(event) {
  event.preventDefault();
  // Aquí puedes redirigir a tu página de registro
  // window.location.href = '/register.html';
  showToast('Redirigiendo al registro...', 'green');
}

// Funciones para autenticación social (placeholder)
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  auth.signInWithPopup(provider)
    .then(result => {
      // El usuario inició sesión exitosamente
      showToast(`¡Bienvenido ${result.user.displayName || ''}!`, 'green');
      // Redirigir al dashboard después de 1 segundo
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    })
    .catch(error => {
      console.error('Error al iniciar sesión con Google:', error);
      showToast('Error al iniciar sesión con Google', 'red');
    });
}

function signInWithMicrosoft() {
  const provider = new firebase.auth.OAuthProvider('microsoft.com');
  
  auth.signInWithPopup(provider)
    .then(result => {
      showToast(`¡Bienvenido ${result.user.displayName || ''}!`, 'green');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    })
    .catch(error => {
      console.error('Error al iniciar sesión con Microsoft:', error);
      showToast('Error al iniciar sesión con Microsoft', 'red');
    });
}

// Manejar envío del formulario de login
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const rememberMe = document.getElementById('rememberMe')?.checked || false;
      
      if (!email || !password) {
        showToast('Por favor completa todos los campos', 'red');
        return;
      }
      
      // Deshabilitar botón mientras se procesa
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
      
      try {
        // Configurar persistencia basado en "Recordarme"
        const persistence = rememberMe 
          ? firebase.auth.Auth.Persistence.LOCAL 
          : firebase.auth.Auth.Persistence.SESSION;
        
        await auth.setPersistence(persistence);
        
        // Intentar iniciar sesión
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        showToast(`¡Bienvenido ${userCredential.user.email}!`, 'green');
        
        // Redirigir después de 1 segundo
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1000);
        
      } catch (error) {
        console.error('Error de inicio de sesión:', error);
        
        let errorMessage = 'Error al iniciar sesión';
        
        switch(error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Correo electrónico inválido';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Esta cuenta ha sido deshabilitada';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Correo o contraseña incorrectos';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Error de conexión. Verifica tu internet';
            break;
          default:
            errorMessage = error.message;
        }
        
        showToast(errorMessage, 'red');
        
        // Reactivar botón
        loginBtn.disabled = false;
        loginBtn.innerHTML = 'Iniciar sesión';
      }
    });
  }
  
  // Verificar si el usuario ya está autenticado
  auth.onAuthStateChanged(user => {
    if (user) {
      // Usuario ya autenticado, opcionalmente redirigir
      console.log('Usuario autenticado:', user.email);
      // Descomentar para redirigir automáticamente
      // window.location.href = '/dashboard.html';
    }
  });
});

// Exponer funciones globalmente para los onclick
window.togglePassword = togglePassword;
window.forgotPassword = forgotPassword;
window.showRegister = showRegister;
window.signInWithGoogle = signInWithGoogle;
window.signInWithMicrosoft = signInWithMicrosoft;
