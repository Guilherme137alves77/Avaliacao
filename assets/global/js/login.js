document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // 1. CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
  // ========================================

  // Credenciais para o Demo
  const DEMO_EMAIL = 'admin@barberpro.com';
  const DEMO_PASSWORD = '123456';

  // Elementos do Formulário
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitBtn = document.getElementById('submitBtn');
  const togglePassBtn = document.getElementById('togglePass');

  // Elementos de Erro
  const emailError = document.getElementById('emailError');
  const passError = document.getElementById('passError');

  // Elementos de Loading/Animação
// Overlay de carregamento (no login.html atual existem: #loader e o próprio botão #submitBtn)
  // Mantemos referências opcionais para não quebrar caso IDs não existam.
  const loaderIcon = document.getElementById('loader');
  const loadingOverlay = document.getElementById('bntlogin'); // opcional (layout antigo)
  const loadingText = document.getElementById('loadingText'); // opcional
  const loadingSubtext = document.getElementById('loadingSubtext'); // opcional
  const loadingSubtextAlt = document.getElementById('loadingSubtextAlt') || loadingSubtext;


  // Texto "ENTRAR" dentro do botão (pode ser null em caso de mudanças de HTML)
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

  // Se faltar algum elemento essencial, não quebre o restante da página.
if (!loginForm || !emailInput || !passwordInput || !submitBtn) {
    console.error('[login.js] Elementos do formulário não encontrados. Verifique IDs no HTML.');
    return;
  }

  // Se for um layout antigo e não houver campos de erro, não quebra o fluxo.
  const hasErrors = !!emailError && !!passError;


  // Inicializa ícones (Lucide)
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }


// ========================================
// 2. FUNCIONALIDADES DE INTERFACE
// ========================================

// Mostrar/Ocultar Senha
if (togglePassBtn) {
  togglePassBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Atualiza ícone visualmente
    const icon = togglePassBtn.querySelector('i');
    if (icon) {
      if (type === 'text') {
        icon.setAttribute('data-lucide', 'eye-off');
      } else {
        icon.setAttribute('data-lucide', 'eye');
      }
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
}

// Limpar erros ao digitar (Melhora a UX)
emailInput.addEventListener('input', () => {
  clearError(emailInput, emailError);
});

passwordInput.addEventListener('input', () => {
  clearError(passwordInput, passError);
});


// ========================================
// 3. LÓGICA DE VALIDAÇÃO
// ========================================

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

  // Animação de "Shake" (Tremida) para indicar erro
  try {
    if (input.parentElement && input.parentElement.animate) {
      input.parentElement.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' }
      ], {
        duration: 300,
        iterations: 1
      });
    }
  } catch (e) {}
}


// ========================================
// 4. SUBMIT DO FORMULÁRIO (LOGIN)
// ========================================

loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Impede o recarregamento da página

  // Reset seguro de UI (evita overlay/loader ficar visível após tentativas inválidas)
  if (submitBtn) submitBtn.disabled = false;
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
    loadingOverlay.style.opacity = '';
  }
  if (loaderIcon) loaderIcon.classList.add('hidden');
  if (btnText) btnText.style.display = '';

  let isValid = true;
  const emailValue = emailInput.value.trim().toLowerCase();
  const passValue = passwordInput.value.trim();



// 4.1 Validação de campos vazios
if (!emailValue) {
  showError(emailInput, emailError, 'Por favor, insira seu email.');
  isValid = false;
}

if (!passValue) {
  showError(passwordInput, passError, 'Por favor, insira sua senha.');
  isValid = false;
}



// Se houver campos vazios, para aqui
if (!isValid) return;

// 4.2 Validação de Credenciais (Senha Errada)
if (emailValue!== DEMO_EMAIL || passValue!== DEMO_PASSWORD) {
showError(emailInput, emailError, 'Email ou senha incorretos.');
showError(passwordInput, passError, 'Email ou senha incorretos.');
return;
}

// 4.3 Sucesso: setar sessão demo e iniciar animação de Login
try {
  localStorage.setItem('isAuthed', 'true');
  localStorage.setItem('authUser', JSON.stringify({ email: emailValue }));
} catch (err) {}
// Garante que o auth.js valide no dashboard
startLoginAnimation();
});

// ========================================
// 5. ANIMAÇÃO E REDIRECIONAMENTO
// ========================================

function startLoginAnimation() {
// Desabilita UI para evitar reenvio/digitação durante o carregamento
submitBtn.disabled = true;
if (emailInput) emailInput.disabled = true;
if (passwordInput) passwordInput.disabled = true;

// Troca texto do botão por spinner
if(btnText) btnText.style.display = 'none';
if(loaderIcon) loaderIcon.classList.remove('hidden');

// Prepara o Overlay de tela cheia (opcional; no layout atual ele não existe)
if (loadingOverlay) {
  loadingOverlay.classList.remove('hidden');
  // Pequeno delay para permitir que o CSS transition funcione no opacity
  setTimeout(() => {
    loadingOverlay.style.opacity = '1';
  }, 50);
}



// Sequência de textos de carregamento
const steps = [
  { title: "Verificando credenciais...", sub: "Aguarde um instante." },
  { title: "Carregando painel...", sub: "Preparando dados." },
  { title: "Sucesso!", sub: "Redirecionando..." }
];

let currentStep = 0;


function runSequence() {
  if (currentStep < steps.length) {
// Atualiza textos
if (loadingText) loadingText.textContent = steps[currentStep].title;
// Suporta variações de ID
const subEl = loadingSubtextAlt || loadingSubtext;
if (subEl) subEl.textContent = steps[currentStep].sub;


currentStep++;

// Aguarda 1.2 segundos entre cada passo
setTimeout(runSequence, 1200);
} else {
// Fim da animação: Redireciona
window.location.href = "dashboard.html";
  // Reinicia a animação/estado do loader caso a página não carregue como esperado
  try {
    const loadingOverlayEl = document.getElementById('bntlogin');
    if (loadingOverlayEl) loadingOverlayEl.classList.add('hidden');
  } catch (e) {}

}
}

// Inicia a sequência. Mesmo se IDs opcionais não existirem, ao final redireciona.
runSequence();
}


});
