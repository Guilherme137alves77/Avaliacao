/* dashboard.js */

document.addEventListener('DOMContentLoaded', () => {
  // Garante que existe um conjunto inicial de avaliações no localStorage.
  if (!localStorage.getItem('barberReviews')) {
    // Seed de avaliações apenas para demonstração.
    const seedData = [
      { rating: 5, comment: "Serviço impecável, atendimento de primeiro mundo.", date: "24/06/2026", categories: ["Corte", "Ambiente"] },
      { rating: 4, comment: "Muito bom, mas demorou um pouco.", date: "23/06/2026", categories: ["Corte"] },
      { rating: 5, comment: "Melhor barbearia da região.", date: "22/06/2026", categories: ["Barba", "Ambiente"] },
      { rating: 3, comment: "Regular, esperava mais pelo preço.", date: "20/06/2026", categories: ["Atendimento"] }
    ];

    // Persiste o seed no localStorage.
    localStorage.setItem('barberReviews', JSON.stringify(seedData));
  }

  // Renderiza o dashboard assim que a base estiver pronta.
  renderDashboard();

  // Botão demo para voltar à página inicial.
  const btnNew = document.getElementById('btn-new-review');
  if (btnNew) {
    btnNew.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Atalhos para as páginas novas
  const btnGoClients = document.getElementById('btn-go-clients');
  if (btnGoClients) {
    btnGoClients.addEventListener('click', () => {
      window.location.href = 'clients.html';
    });
  }

  const btnGoSettings = document.getElementById('btn-go-settings');
  if (btnGoSettings) {
    btnGoSettings.addEventListener('click', () => {
      window.location.href = 'admin-settings.html';
    });
  }
});

/**
 * Renderiza os dados das avaliações no dashboard.
 *
 * Responsabilidades:
 * - Ler avaliações do localStorage.
 * - Calcular métricas (total, média e satisfação).
 * - Montar gráfico de barras (distribuição por nota).
 * - Montar tabela com as avaliações mais recentes.
 */
function renderDashboard() {
  // Carrega avaliações do localStorage (ou array vazio se não houver).
  const reviews = JSON.parse(localStorage.getItem('barberReviews')) || [];

  // =====================
  // 1) Métricas
  // =====================
  const total = reviews.length;

  // Soma das notas para calcular a média.
  const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const avg = total > 0 ? (sum / total).toFixed(1) : 0;

  // Satisfação: percentual de avaliações com rating >= 4.
  const satisfaction = total > 0
    ? Math.round((reviews.filter(r => r.rating >= 4).length / total) * 100)
    : 0;

  const elTotal = document.getElementById('metric-total');
  const elAvg = document.getElementById('metric-avg');
  const elSat = document.getElementById('metric-satisfaction');

  // Atualiza os elementos da UI (se existirem).
  if (elTotal) elTotal.innerText = total;
  if (elAvg) elAvg.innerText = avg;
  if (elSat) elSat.innerText = satisfaction + "%";

  // =====================
  // 2) Gráfico de Barras (Distribuição)
  // =====================
  // Estrutura de contagem por nota.
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => counts[r.rating]++);

  const chartContainer = document.getElementById('chart-bars');
  if (chartContainer) {
    // Limpa antes de renderizar.
    chartContainer.innerHTML = '';

    // Renderiza da nota 5 até 1.
    for (let i = 5; i >= 1; i--) {
      const count = counts[i];
      const percentage = total > 0 ? (count / total) * 100 : 0;

      // Monta o HTML do grupo de barras.
      const html = `
<div class="bar-group">
  <div class="bar-label">
    <span><i class="fas fa-star text-gold" style="font-size:0.7rem"></i> ${i}</span>
    <span>${count} (${Math.round(percentage)}%)</span>
  </div>
  <div class="progress-bg">
    <div class="progress-fill" style="width: ${percentage}%"></div>
  </div>
</div>
`;

      chartContainer.innerHTML += html;
    }
  }

  // =====================
  // 3) Tabela (avaliações recentes)
  // =====================
  const tbody = document.getElementById('reviews-table-body');
  if (tbody) {
    // Limpa antes de renderizar.
    tbody.innerHTML = '';

    // Mostrar apenas as 5 mais recentes.
    reviews.slice(0, 5).forEach(r => {
      // Monta as estrelas para exibir a nota (cheias e vazias).
      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        starsHtml += i < r.rating
          ? '<i class="fas fa-star"></i>'
          : '<i class="far fa-star" style="opacity:0.3"></i>';
      }

      // Monta a linha da tabela.
      const row = `
<tr>
  <td>${r.date}</td>
  <td><span style="color:white; font-size:0.8rem">${r.categories.join(', ')}</span></td>
  <td>${r.comment}</td>
  <td class="rating-badge">${starsHtml}</td>
</tr>
`;

      tbody.innerHTML += row;
    });
  }
}

