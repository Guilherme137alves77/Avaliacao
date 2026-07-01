/**
 * Login administrativo (pages/login.html).
 */
document.addEventListener('DOMContentLoaded', () => {
  const { demo, paths } = window.AppConfig;

  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitBtn = document.getElementById('submitBtn');
  const togglePassBtn = document.getElementById('togglePass');
  const emailError = document.getElementById('emailError');
  const passError = document.getElementById('passError');
  const loaderIcon = document.getElementById('loader');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

  if (!loginForm || !emailInput || !passwordInput || !submitBtn) {
    console.error('[login.js] Elementos do formulário não encontrados.');
    return;
  }

  if (window.AppAuth && window.AppAuth.isAuthed()) {
    window.location.href = paths.dashboard;
    return;
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();

  if (togglePassBtn) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassBtn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');

      const icon = togglePassBtn.querySelector('i');
      if (icon) icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  emailInput.addEventListener('input', () => clearError(emailInput, emailError));
  passwordInput.addEventListener('input', () => clearError(passwordInput, passError));

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    resetLoadingUI();

    let isValid = true;
    const emailValue = emailInput.value.trim().toLowerCase();
    const passValue = passwordInput.value.trim();

    if (!emailValue) {
      showError(emailInput, emailError, 'Por favor, insira seu email.');
      isValid = false;
    }

    if (!passValue) {
      showError(passwordInput, passError, 'Por favor, insira sua senha.');
      isValid = false;
    }

    if (!isValid) return;

    if (emailValue !== demo.email || passValue !== demo.password) {
      showError(emailInput, emailError, 'Email ou senha incorretos.');
      showError(passwordInput, passError, 'Email ou senha incorretos.');
      return;
    }

    window.AppAuth.login(emailValue);
    startLoginAnimation();
  });

  function resetLoadingUI() {
    submitBtn.disabled = false;
    if (loaderIcon) loaderIcon.classList.add('hidden');
    if (btnText) btnText.style.display = '';
  }

  function clearError(input, errorElement) {
    if (!input || !errorElement) return;
    input.classList.remove('input-error');
    errorElement.style.opacity = '0';
    errorElement.textContent = '';
  }

  function showError(input, errorElement, message) {
    if (!input || !errorElement) return;
    input.classList.add('input-error');
    errorElement.textContent = message;
    errorElement.style.opacity = '1';

    if (input.parentElement && input.parentElement.animate) {
      input.parentElement.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' },
      ], { duration: 300, iterations: 1 });
    }
  }

  function startLoginAnimation() {
    submitBtn.disabled = true;
    emailInput.disabled = true;
    passwordInput.disabled = true;

    if (btnText) btnText.style.display = 'none';
    if (loaderIcon) loaderIcon.classList.remove('hidden');

    // Redireciona após breve feedback visual (corrige loader infinito)
    setTimeout(() => {
      window.location.href = paths.dashboard;
    }, 1200);
  }
});
