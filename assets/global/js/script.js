/* script.js */

/**
* Inicializa a tela de avaliação quando o DOM estiver pronto.
*/
document.addEventListener('DOMContentLoaded', () => {
// Setup inicial das estrelas
const stars = document.querySelectorAll('.star-input');
const ratingText = document.getElementById('rating-text');

// Mapeamento de notas para texto
const labels = ["Péssimo", "Ruim", "Regular", "Bom", "Excelente"];

// Listener para cada estrela (radio button)
stars.forEach(star => {
star.addEventListener('change', (e) => {
// e.target.value é string, converte para int e ajusta índice (base 0)
const index = parseInt(e.target.value) - 1;
if (ratingText) {
ratingText.innerText = labels[index];
}
});
});

// Configurar botão de envio
const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
submitBtn.addEventListener('click', handleSubmit);
}
});

/**
* Alterna a classe CSS 'active' em uma categoria.
* @param {HTMLElement} element - Elemento clicado.
*/
function toggleCategory(element) {
element.classList.toggle('active');
}

/**
* Executa o fluxo de envio da avaliação.
*/
function handleSubmit() {
// 1. Validação da Nota
const ratingEl = document.querySelector('input[name="star"]:checked');

if (!ratingEl) {
alert("Por favor, selecione uma nota de estrelas.");
return;
}

// 2. Coleta de Dados
const rating = parseInt(ratingEl.value);
const commentInput = document.getElementById('comment');
const comment = commentInput? commentInput.value.trim(): "";

// Coletar categorias ativas
const activeCats = [];
document.querySelectorAll('.cat-item.active span').forEach(span => {
activeCats.push(span.innerText);
});

// 3. Interface de Loading
const overlay = document.getElementById('loading-overlay');
const msg = document.getElementById('loading-msg');

if (overlay) overlay.classList.remove('hidden');

// Sequência de mensagens
const steps = [
"Enviando avaliação...",
"Processando dados...",
"Salvando informações...",
"Finalizando..."
];

let step = 0;

// 4. Simulação de Processo e Salvamento
const interval = setInterval(() => {
step++;

if (step < steps.length) {
if (msg) msg.innerText = steps[step];
} else {
clearInterval(interval);

// Salva no LocalStorage
saveData(rating, comment, activeCats);

if (msg) msg.innerText = "Sucesso!";

// Redirecionamento Final
setTimeout(() => {
if (overlay) overlay.classList.add('hidden');
// Redirecionamento solicitado
window.location.href = 'assets/global/pages/dashboard.html';
}, 800);
}
}, 800);
}

/**
* Salva a avaliação no localStorage.
*/
function saveData(rating, comment, categories) {
try {
const storageKey = 'barberReviews';
const existingData = localStorage.getItem(storageKey);
const reviews = existingData? JSON.parse(existingData): [];

const newReview = {
rating: rating,
comment: comment || "Sem comentário",
date: new Date().toLocaleDateString('pt-BR'),
timestamp: new Date().getTime(), // Útil para ordenação precisa
categories: categories.length > 0? categories: ["Geral"]
};

// Adiciona no início do array
reviews.unshift(newReview);

localStorage.setItem(storageKey, JSON.stringify(reviews));
} catch (e) {
console.error("Erro ao salvar no localStorage:", e);
}
}
