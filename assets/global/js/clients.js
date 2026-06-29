/**
 * clients.js
 *
 * Página admin: Clientes.
 *
 * Abordagem (demo):
 * - Este projeto hoje salva apenas avaliações em localStorage (`barberReviews`).
 * - Para a página de "Clientes", criamos clientes fictícios (Cliente 1..N) mapeando as avaliações em sequência.
 * - Para cada cliente, agregamos:
 *   - quantidade de avaliações
 *   - nota média
 *   - última data
 *   - categoria mais frequente (top categoria)
 *
 * Responsabilidades:
 * - Ler avaliações do localStorage
 * - Construir agregações por cliente fictício
 * - Renderizar métricas e tabela
 * - Permitir reset demo (limpa localStorage e recarrega)
 */

function safeParseReviews() {
  try {
    return JSON.parse(localStorage.getItem('barberReviews')) || [];
  } catch {
    return [];
  }
}

/**
 * Divide avaliações em "clientes fictícios".
 *
 * Heurística simples:
 * - Um cliente recebe até `maxReviewsPerClient` avaliações consecutivas.
 *
 * @param {Array} reviews
 * @param {number} maxReviewsPerClient
 * @returns {Array} avaliações com campo `clientId`
 */
function assignFictionalClients(reviews, maxReviewsPerClient = 3) {
  return reviews.map((r, idx) => {
    const clientIndex = Math.floor(idx / maxReviewsPerClient);
    return {
      ...r,
      clientId: clientIndex,
      clientName: `Cliente ${clientIndex + 1}`
    };
  });
}

/**
 * Calcula agregações por cliente.
 *
 * @param {Array} reviewsWithClient
 * @returns {Object} mapa clientId -> agregado
 */
function buildClientsAggregate(reviewsWithClient) {
  const map = new Map();

  for (const r of reviewsWithClient) {
    const id = r.clientId;
    if (!map.has(id)) {
      map.set(id, {
        clientId: id,
        clientName: r.clientName,
        reviewsCount: 0,
        ratingSum: 0,
        lastDate: r.date,
        topCategory: '—',
        categoryCounts: new Map()
      });
    }

    const agg = map.get(id);
    agg.reviewsCount += 1;
    agg.ratingSum += r.rating;

    // Mantém a "última" data (como reviews são inseridas no início, a ordem tende a ser do mais novo primeiro)
    agg.lastDate = r.date;

    // Contagem de categorias
    const categories = Array.isArray(r.categories) ? r.categories : [];
    categories.forEach((c) => {
      agg.categoryCounts.set(c, (agg.categoryCounts.get(c) || 0) + 1);
    });
  }

  // Finaliza topCategory
  for (const agg of map.values()) {
    let best = null;
    for (const [cat, count] of agg.categoryCounts.entries()) {
      if (!best || count > best.count) best = { cat, count };
    }
    agg.topCategory = best ? best.cat : '—';
    // nota média
    agg.avgRating = agg.reviewsCount > 0 ? (agg.ratingSum / agg.reviewsCount) : 0;
  }

  return map;
}

/**
 * Renderiza a UI.
 *
 * @param {Map} clientsMap
 * @param {Array} allReviews
 */
function renderClients(clientsMap, allReviews) {
  // Métricas
  const clientTotal = clientsMap.size;
  const totalReviews = allReviews.length;

  const avgReviewsPerClient = clientTotal > 0 ? totalReviews / clientTotal : 0;
  const satisfaction = totalReviews > 0
    ? Math.round((allReviews.filter(r => r.rating >= 4).length / totalReviews) * 100)
    : 0;

  const elTotal = document.getElementById('metric-client-total');
  const elRPC = document.getElementById('metric-reviews-per-client');
  const elSat = document.getElementById('metric-client-satisfaction');

  if (elTotal) elTotal.innerText = clientTotal;
  if (elRPC) elRPC.innerText = avgReviewsPerClient.toFixed(1);
  if (elSat) elSat.innerText = satisfaction + '%';

  // Tabela
  const tbody = document.getElementById('clients-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  // Ordena por quantidade de avaliações desc
  const list = Array.from(clientsMap.values()).sort((a, b) => b.reviewsCount - a.reviewsCount);

  for (const c of list) {
    const stars = renderStars(c.avgRating);

    tbody.innerHTML += `
      <tr>
        <td>${escapeHtml(c.clientName)}</td>
        <td>${c.reviewsCount}</td>
        <td>${Number(c.avgRating).toFixed(1)}<div style="margin-top:6px; color: var(--gold); font-size:0.8rem;">${stars}</div></td>
        <td>${escapeHtml(c.lastDate)}</td>
        <td><span style="color: white; font-size:0.8rem">${escapeHtml(c.topCategory)}</span></td>
      </tr>
    `;
  }
}

/**
 * Renderiza estrelas a partir de nota média.
 *
 * @param {number} avgRating
 * @returns {string}
 */
function renderStars(avgRating) {
  const rounded = Math.round(avgRating);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= rounded
      ? '<i class="fas fa-star"></i>'
      : '<i class="far fa-star" style="opacity:0.3"></i>';
  }
  return html;
}

/**
 * Escape básico de HTML para evitar injeção quando renderiza texto.
 *
 * @param {string} str
 */
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
}

function resetDemoData() {
  localStorage.removeItem('barberReviews');
  // Recarrega para reaplicar seed do dashboard/fluxo quando você voltar.
  window.location.href = 'clients.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const reviews = safeParseReviews();

  // Se não tiver reviews, não renderiza vazio; mas cria seed via comportamento do dashboard.
  // Aqui só hidratamos com seed mínima caso seja necessário.
  if (!reviews.length) {
    const seedData = [
      { rating: 5, comment: "Serviço impecável, atendimento de primeiro mundo.", date: "24/06/2026", categories: ["Corte", "Ambiente"] },
      { rating: 4, comment: "Muito bom, mas demorou um pouco.", date: "23/06/2026", categories: ["Corte"] },
      { rating: 5, comment: "Melhor barbearia da região.", date: "22/06/2026", categories: ["Barba", "Ambiente"] },
      { rating: 3, comment: "Regular, esperava mais pelo preço.", date: "20/06/2026", categories: ["Atendimento"] }
    ];
    localStorage.setItem('barberReviews', JSON.stringify(seedData));
  }

  const hydratedReviews = safeParseReviews();
  const reviewsWithClient = assignFictionalClients(hydratedReviews);
  const clientsMap = buildClientsAggregate(reviewsWithClient);

  renderClients(clientsMap, hydratedReviews);

  const btnReset = document.getElementById('btn-reset-clients');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (!confirm('Resetar dados demo? Isso vai apagar avaliações salvas no seu navegador.')) return;
      resetDemoData();
    });
  }
});

