document.addEventListener('DOMContentLoaded', () => {
// Inicializa os ícones do Lucide
lucide.createIcons();

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassBtn = document.getElementById('togglePass');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const loader = document.getElementById('loader');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');

// Mensagens de erro
const emailError = document.getElementById('emailError');
const passError = document.getElementById('passError');

// Credenciais Demo
const DEMO_EMAIL = 'admin@barberpro.com';
const DEMO_PASS = '123456';

// --- 1. Toggle Password Visibility ---
togglePassBtn.addEventListener('click', () => {
const type = passwordInput.getAttribute('type') === 'password'? 'text': 'password';
passwordInput.setAttribute('type', type);

// Troca o ícone
const icon = togglePassBtn.querySelector('i');
// Nota: Em um ambiente real com Lucide dinâmico, precisaríamos recriar o ícone ou trocar a classe SVG.
// Para simplificar neste demo, vamos apenas alternar a lógica visual se necessário,
// mas o Lucide renderiza SVGs estáticos. Vamos focar na funcionalidade.
if (type === 'text') {
icon.setAttribute('data-lucide', 'eye-off');
} else {
icon.setAttribute('data-lucide', 'eye');
}
lucide.createIcons(); // Re-renderiza o ícone atualizado
});

// --- 2. Validação em Tempo Real (Limpa erros ao digitar) ---
emailInput.addEventListener('input', () => {
emailInput.classList.remove('input-error');
emailError.style.opacity = '0';
});

passwordInput.addEventListener('input', () => {
passwordInput.classList.remove('input-error');
passError.style.opacity = '0';
});

function showError(input, errorElement) {

input.classList.add('input-error');
errorElement.style.opacity = '1';
// Pequena animação de shake no input
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

// --- 4. Simulação de Login com Animações ---
function startLoginSimulation() {
// 1. Estado inicial do botão
submitBtn.disabled = true;
btnText.style.display = 'none';
loader.classList.remove('hidden');

// Simula verificação rápida no botão (opcional, mas dá feedback tátil)
setTimeout(() => {
// 2. Exibe Overlay de Carregamento Full Screen
loadingOverlay.classList.remove('hidden');
loadingOverlay.style.opacity = '0';

// Fade in do overlay
setTimeout(() => {
loadingOverlay.style.transition = 'opacity 0.5s ease';
loadingOverlay.style.opacity = '1';
}, 50);

// Sequência de mensagens
runLoadingSequence();
}, 600);
}

function runLoadingSequence() {
const steps = [
{ text: "Verificando credenciais...", delay: 1500 },
{ text: "Carregando painel...", delay: 1500 },
{ text: "Finalizando acesso...", delay: 1000 }
];

let currentStep = 0;

function nextStep() {
if (currentStep < steps.length) {
// Fade out texto antigo
loadingText.style.opacity = '0';

setTimeout(() => {
// Troca texto e Fade in
loadingText.innerText = steps[currentStep].text;
loadingText.style.opacity = '1';

currentStep++;
setTimeout(nextStep, steps[currentStep - 1].delay);
}, 300); // Tempo para o fade out
} else {
// Finaliza e redireciona
redirectToDashboard();
}
}

// Inicia a sequência
nextStep();
}

function redirectToDashboard() {
  // Marca sessão local (demo sem backend)
  localStorage.setItem('isAuthed', 'true');
  localStorage.setItem('authUser', emailInput.value.trim().toLowerCase());

  // Animação final de saída (opcional, para suavizar a troca de página)
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 500);
}



// --- 5. Autenticação fake (login + senha) ---
function isFakeAuthValid() {
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  return email === DEMO_EMAIL && password === DEMO_PASS;
}

// --- Hooks de autenticação antes de rodar simulação ---
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let isValid = true;

  // Validação Email
  if (!emailInput.value.trim()) {
    showError(emailInput, emailError);
    isValid = false;
  }

  // Validação Senha
  if (!passwordInput.value.trim()) {
    showError(passwordInput, passError);
    isValid = false;
  }

  if (!isValid) return;

  // Credenciais fake
  if (!isFakeAuthValid()) {
    // Mensagem única: marca os dois campos
    emailInput.classList.add('input-error');
    passwordInput.classList.add('input-error');

    emailError.textContent = 'Email ou senha incorretos.';
    passError.textContent = 'Email ou senha incorretos.';
    emailError.style.opacity = '1';
    passError.style.opacity = '1';

    // Feedback visual rápido
    emailInput.parentElement.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(0)' }
    ], { duration: 300, iterations: 1 });

    return;
  }

  // Bloqueia múltiplos submits
  if (submitBtn.disabled) return;

  startLoginSimulation();
});

});

