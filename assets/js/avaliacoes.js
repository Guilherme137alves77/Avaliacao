/**
 * Avaliações — listagem com busca, filtros e paginação.
 */
document.addEventListener('DOMContentLoaded', () => {
  window.AppLayout.initAdminPage('avaliacoes', 'Avaliações');

  const allReviews = window.AppUtils.seedReviewsIfEmpty();
  const state = { search: '', rating: '', barber: '', page: 1, perPage: 6 };

  const barberSelect = document.getElementById('filter-barber');
  if (barberSelect) {
    window.AppData.getBarbers().forEach((b) => {
      barberSelect.insertAdjacentHTML('beforeend', `<option value="${b.name}">${b.name}</option>`);
    });
  }

  function getFiltered() {
    return allReviews.filter((r) => {
      const q = state.search.toLowerCase();
      const matchSearch = !q ||
        r.clientName.toLowerCase().includes(q) ||
        r.barberName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.service.toLowerCase().includes(q);
      const matchRating = !state.rating || String(r.rating) === state.rating;
      const matchBarber = !state.barber || r.barberName === state.barber;
      return matchSearch && matchRating && matchBarber;
    });
  }

  function render() {
    const filtered = getFiltered();
    const { total, avg, satisfaction } = window.AppUtils.calcMetrics(filtered);
    const paginated = window.AppData.paginate(filtered, state.page, state.perPage);

    setText('metric-av-total', total);
    setText('metric-av-avg', avg);
    setText('metric-av-satisfaction', satisfaction + '%');

    const tbody = document.getElementById('avaliacoes-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!paginated.items.length) {
      tbody.innerHTML = '<tr><td colspan="7">Nenhuma avaliação encontrada.</td></tr>';
    } else {
      paginated.items.forEach((r) => {
        tbody.insertAdjacentHTML('beforeend', `
          <tr>
            <td>${window.AppUtils.escapeHtml(r.clientName)}</td>
            <td>${window.AppUtils.escapeHtml(r.barberName)}</td>
            <td><span style="color:white;font-size:0.8rem">${window.AppUtils.escapeHtml(r.service)}</span></td>
            <td class="rating-badge">${window.AppUtils.renderStars(r.rating)}</td>
            <td>${window.AppUtils.escapeHtml(r.comment)}</td>
            <td>${window.AppUtils.escapeHtml(r.date)}</td>
            <td><span class="badge badge-info">${r.rating}/5</span></td>
          </tr>`);
      });
    }

    window.AppUtils.renderPagination(
      document.getElementById('pagination'),
      paginated.page,
      paginated.totalPages,
      (p) => { state.page = p; render(); }
    );
  }

  document.getElementById('search-avaliacoes')?.addEventListener('input', (e) => {
    state.search = e.target.value;
    state.page = 1;
    render();
  });

  document.getElementById('filter-rating')?.addEventListener('change', (e) => {
    state.rating = e.target.value;
    state.page = 1;
    render();
  });

  document.getElementById('filter-barber')?.addEventListener('change', (e) => {
    state.barber = e.target.value;
    state.page = 1;
    render();
  });

  render();
});

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
