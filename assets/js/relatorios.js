/**
 * Relatórios — indicadores, ranking e exportação fictícia.
 */
document.addEventListener('DOMContentLoaded', () => {
  window.AppLayout.initAdminPage('relatorios', 'Relatórios');

  const reviews = window.AppUtils.seedReviewsIfEmpty();
  const { total, avg, satisfaction } = window.AppUtils.calcMetrics(reviews);

  setText('report-total', total);
  setText('report-avg', avg);
  setText('report-satisfaction', satisfaction + '%');
  setText('report-weekly', '4.5');
  setText('report-monthly', avg);

  renderDistribution(reviews, total);
  renderBarberRanking(reviews);
  renderServiceRanking(reviews);
  renderMonthlyTable();

  document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
    alert('Exportação PDF (demo): relatório gerado com sucesso!\n\nEm produção, este botão geraria um arquivo PDF para download.');
  });

  document.getElementById('btn-export-excel')?.addEventListener('click', () => {
    alert('Exportação Excel (demo): planilha gerada com sucesso!\n\nEm produção, este botão geraria um arquivo .xlsx para download.');
  });
});

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderDistribution(reviews, total) {
  const container = document.getElementById('report-distribution');
  if (!container) return;

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { counts[r.rating] += 1; });
  container.innerHTML = '';

  for (let i = 5; i >= 1; i--) {
    const count = counts[i];
    const pct = total > 0 ? (count / total) * 100 : 0;
    container.insertAdjacentHTML('beforeend', `
      <div class="bar-group">
        <div class="bar-label"><span>Nota ${i}</span><span>${count} (${Math.round(pct)}%)</span></div>
        <div class="progress-bg"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>`);
  }
}

function renderBarberRanking(reviews) {
  const list = document.getElementById('barber-ranking');
  if (!list) return;

  const stats = window.AppData.calcBarberStats(reviews);
  list.innerHTML = '';

  stats.forEach((b, i) => {
    list.insertAdjacentHTML('beforeend', `
      <li>
        <span><span class="rank-position">#${i + 1}</span> ${window.AppUtils.escapeHtml(b.name)}</span>
        <span class="text-gold">${b.avg.toFixed(1)} ${window.AppUtils.renderStars(b.avg)}</span>
      </li>`);
  });
}

function renderServiceRanking(reviews) {
  const list = document.getElementById('service-ranking');
  if (!list) return;

  const stats = window.AppData.calcServiceStats(reviews);
  list.innerHTML = '';

  stats.forEach((s, i) => {
    list.insertAdjacentHTML('beforeend', `
      <li>
        <span><span class="rank-position">#${i + 1}</span> ${window.AppUtils.escapeHtml(s.name)}</span>
        <span>${s.count} aval. — ${s.avg.toFixed(1)} <i class="fas fa-star" aria-hidden="true"></i></span>
      </li>`);
  });
}

function renderMonthlyTable() {
  const tbody = document.getElementById('relatorios-table-body');
  if (!tbody) return;

  const months = [
    { periodo: 'Jan/2026', avaliacoes: 42, media: 4.5, satisfacao: 88, evolucao: '+5%' },
    { periodo: 'Fev/2026', avaliacoes: 38, media: 4.3, satisfacao: 84, evolucao: '-2%' },
    { periodo: 'Mar/2026', avaliacoes: 51, media: 4.6, satisfacao: 90, evolucao: '+8%' },
    { periodo: 'Abr/2026', avaliacoes: 47, media: 4.4, satisfacao: 86, evolucao: '+3%' },
    { periodo: 'Mai/2026', avaliacoes: 55, media: 4.7, satisfacao: 92, evolucao: '+6%' },
    { periodo: 'Jun/2026', avaliacoes: 49, media: 4.5, satisfacao: 89, evolucao: '+4%' },
  ];

  tbody.innerHTML = '';
  months.forEach((m) => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${m.periodo}</td>
        <td>${m.avaliacoes}</td>
        <td>${m.media.toFixed(1)}</td>
        <td>${m.satisfacao}%</td>
        <td><span class="badge badge-success">${m.evolucao}</span></td>
      </tr>`);
  });
}
