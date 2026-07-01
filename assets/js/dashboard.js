/**
 * Dashboard — visão geral da barbearia.
 */
document.addEventListener('DOMContentLoaded', () => {
  const { paths } = window.AppConfig;

  window.AppLayout.initAdminPage('dashboard', 'Dashboard', { requireAuth: false });

  const reviews = window.AppUtils.seedReviewsIfEmpty();
  renderDashboard(reviews);

  bindAction('btn-new-review', () => { window.location.href = paths.index; });
  bindAction('btn-go-clientes', () => { window.location.href = paths.clientes; });
  bindAction('btn-go-settings', () => { window.location.href = paths.configuracoes; });
});

function bindAction(id, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', handler);
}

function renderDashboard(reviews) {
  const { total, avg, satisfaction, clients, barbers } = window.AppUtils.calcMetrics(reviews);

  setText('metric-total', total);
  setText('metric-avg', avg);
  setText('metric-satisfaction', satisfaction + '%');
  setText('metric-clients', clients);
  setText('metric-barbers', barbers);

  renderChart(reviews, total);
  renderServiceRanking(reviews);
  renderTable(reviews);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderChart(reviews, total) {
  const chartContainer = document.getElementById('chart-bars');
  if (!chartContainer) return;

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { counts[r.rating] += 1; });
  chartContainer.innerHTML = '';

  for (let i = 5; i >= 1; i--) {
    const count = counts[i];
    const percentage = total > 0 ? (count / total) * 100 : 0;
    chartContainer.insertAdjacentHTML('beforeend', `
      <div class="bar-group">
        <div class="bar-label">
          <span><i class="fas fa-star text-gold" style="font-size:0.7rem" aria-hidden="true"></i> ${i}</span>
          <span>${count} (${Math.round(percentage)}%)</span>
        </div>
        <div class="progress-bg" role="progressbar" aria-valuenow="${Math.round(percentage)}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-fill" style="width:${percentage}%"></div>
        </div>
      </div>`);
  }
}

function renderServiceRanking(reviews) {
  const stats = window.AppData.calcServiceStats(reviews);
  const bestEl = document.getElementById('service-best');
  const worstEl = document.getElementById('service-worst');

  if (bestEl && stats.length) {
    const best = stats[0];
    bestEl.innerHTML = `<strong>${window.AppUtils.escapeHtml(best.name)}</strong> — ${best.avg.toFixed(1)} <i class="fas fa-star text-gold" aria-hidden="true"></i> (${best.count} aval.)`;
  }

  if (worstEl && stats.length) {
    const worst = stats[stats.length - 1];
    worstEl.innerHTML = `<strong>${window.AppUtils.escapeHtml(worst.name)}</strong> — ${worst.avg.toFixed(1)} <i class="fas fa-star text-gold" aria-hidden="true"></i> (${worst.count} aval.)`;
  }
}

function renderTable(reviews) {
  const tbody = document.getElementById('reviews-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  reviews.slice(0, 5).forEach((r) => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${window.AppUtils.escapeHtml(r.date)}</td>
        <td>${window.AppUtils.escapeHtml(r.clientName)}</td>
        <td>${window.AppUtils.escapeHtml(r.barberName)}</td>
        <td><span style="color:white;font-size:0.8rem">${window.AppUtils.escapeHtml(r.service)}</span></td>
        <td>${window.AppUtils.escapeHtml(r.comment)}</td>
        <td class="rating-badge">${window.AppUtils.renderStars(r.rating)}</td>
      </tr>`);
  });
}
