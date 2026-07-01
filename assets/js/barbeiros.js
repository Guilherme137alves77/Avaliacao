/**
 * Barbeiros — perfis, médias e últimas avaliações.
 */
document.addEventListener('DOMContentLoaded', () => {
  window.AppLayout.initAdminPage('barbeiros', 'Barbeiros');

  const reviews = window.AppUtils.seedReviewsIfEmpty();
  const barbers = window.AppData.getBarbers();
  const stats = window.AppData.calcBarberStats(reviews);

  setText('metric-barbeiros-total', barbers.length);
  setText('metric-barbeiros-atendimentos', barbers.reduce((a, b) => a + b.attendances, 0));

  const topAvg = stats.length ? stats[0].avg.toFixed(1) : '0.0';
  setText('metric-barbeiros-media', topAvg);

  const grid = document.getElementById('barbeiros-grid');
  if (!grid) return;
  grid.innerHTML = '';

  barbers.forEach((b) => {
    const stat = stats.find((s) => s.name === b.name) || { avg: 0, count: 0, lastReviews: [] };
    const miniReviews = stat.lastReviews.map((r) =>
      `<li>${window.AppUtils.escapeHtml(r.clientName)} — ${window.AppUtils.renderStars(r.rating)}</li>`
    ).join('') || '<li>Sem avaliações recentes</li>';

    grid.insertAdjacentHTML('beforeend', `
      <article class="barber-card">
        <img class="barber-photo" src="${b.photo}" alt="Foto de ${window.AppUtils.escapeHtml(b.name)}" loading="lazy">
        <div class="barber-body">
          <h3 class="barber-name">${window.AppUtils.escapeHtml(b.name)}</h3>
          <p class="barber-specialty">${window.AppUtils.escapeHtml(b.specialty)}</p>
          <div class="barber-stats">
            <span>Média: <strong class="text-gold">${stat.avg.toFixed(1)}</strong> ${window.AppUtils.renderStars(stat.avg)}</span>
            <span>${stat.count} aval. | ${b.attendances} atend.</span>
          </div>
          <div class="barber-reviews-mini">
            <strong style="color:var(--gold-light);font-size:0.8rem;">Últimas avaliações:</strong>
            <ul>${miniReviews}</ul>
          </div>
        </div>
      </article>`);
  });
});

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
