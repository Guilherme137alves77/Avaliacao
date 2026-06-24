/* script.js */

/**
 * Inicializa a tela de avaliação quando o DOM estiver pronto.
 *
 * Responsabilidades:
 * - Configurar listeners das estrelas (atualizar texto da avaliação).
 * - Configurar o botão de envio para chamar handleSubmit().
 */
document.addEventListener('DOMContentLoaded', () => {
  // Setup inicial das estrelas
  const stars = document.querySelectorAll('.star-input');
  const ratingText = document.getElementById('rating-text');
  const labels = ["Péssimo", "Ruim", "Regular", "Bom", "Excelente"];

  // Para cada estrela (radio), quando o valor mudar, atualiza o texto exibido.
  stars.forEach(star => {
    star.addEventListener('change', (e) => {
      ratingText.innerText = labels[parseInt(e.target.value) - 1];
    });
  });

  // Configurar botão de envio
  document.getElementById('submitBtn').addEventListener('click', handleSubmit);
});

/**
 * Alterna a classe CSS 'active' em uma categoria.
 *
 * @param {HTMLElement} element - Elemento clicado (ex.: div `.cat-item`).
 */
function toggleCategory(element) {
  element.classList.toggle('active');
}

/**
 * Executa o fluxo de envio da avaliação:
 * - Valida se uma nota foi selecionada.
 * - Coleta comentário e categorias ativas.
 * - Mostra um overlay de loading com etapas.
 * - Salva no localStorage via saveData().
 * - Redireciona para dashboard.html.
 */
function handleSubmit() {
  // Busca a estrela selecionada (radio button).
  const ratingEl = document.querySelector('input[name="star"]:checked');

  // Se não houver seleção, mostra um alerta e cancela o envio.
  if (!ratingEl) {
    alert("Por favor, selecione uma nota de estrelas.");
    return;
  }

  // Converte o valor da nota e lê o comentário.
  const rating = parseInt(ratingEl.value);
  const comment = document.getElementById('comment').value;

  // Coletar categorias ativas (aqueles spans dentro de `.cat-item.active`).
  const activeCats = [];
  document
    .querySelectorAll('.cat-item.active span')
    .forEach(span => activeCats.push(span.innerText));

  // Mostrar Loading
  const overlay = document.getElementById('loading-overlay');
  const msg = document.getElementById('loading-msg');
  overlay.classList.remove('hidden');

  // Mensagens exibidas em sequência.
  const steps = [
    "Enviando avaliação...",
    "Processando dados...",
    "Salvando informações...",
    "Finalizando..."
  ];

  // Controla o índice da etapa.
  let step = 0;

  // Atualiza a mensagem e, ao final, salva/redireciona.
  const interval = setInterval(() => {
    step++;

    if (step < steps.length) {
      msg.innerText = steps[step];
    } else {
      clearInterval(interval);

      // Persiste a avaliação no localStorage.
      saveData(rating, comment, activeCats);
      msg.innerText = "Sucesso!";

      // Esconde o overlay e navega para o dashboard.
      setTimeout(() => {
        overlay.classList.add('hidden');
        window.location.href = 'dashboard.html';
      }, 800);
    }
  }, 800);
}

/**
 * Salva uma avaliação no `localStorage`.
 *
 * Estrutura esperada em localStorage:
 * - chave: 'barberReviews'
 * - valor: array de objetos { rating, comment, date, categories }
 *
 * A nova avaliação é inserida no início do array.
 *
 * @param {number} rating - Nota de 1 a 5.
 * @param {string} comment - Comentário do cliente.
 * @param {string[]} categories - Lista de categorias selecionadas.
 */
function saveData(rating, comment, categories) {
  // Lê avaliações existentes (ou cria um array vazio se não existir).
  const reviews = JSON.parse(localStorage.getItem('barberReviews')) || [];

  // Monta o objeto da nova avaliação.
  const newReview = {
    rating: rating,
    comment: comment || "Sem comentário",
    date: new Date().toLocaleDateString('pt-BR'),
    categories: categories.length > 0 ? categories : ["Geral"]
  };

  // Adiciona no início (mais recente primeiro).
  reviews.unshift(newReview);

  // Persiste novamente no localStorage.
  localStorage.setItem('barberReviews', JSON.stringify(reviews));
}

