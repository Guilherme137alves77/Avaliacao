/**
 * Clientes — cadastro demo, lista, busca e histórico.
 */
document.addEventListener('DOMContentLoaded', () => {
  window.AppLayout.initAdminPage('clientes', 'Clientes');

  const reviews = window.AppUtils.seedReviewsIfEmpty();
  let clients = buildClientList(reviews);
  let search = '';

  function render() {
    const filtered = clients.filter((c) => {
      const q = search.toLowerCase();
      return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    });

    setText('metric-clientes-total', clients.length);
    setText('metric-clientes-avaliacoes', reviews.length);

    const tbody = document.getElementById('clientes-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    filtered.forEach((c) => {
      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${window.AppUtils.escapeHtml(c.name)}</td>
          <td>${window.AppUtils.escapeHtml(c.email)}</td>
          <td>${window.AppUtils.escapeHtml(c.phone)}</td>
          <td>${c.reviewCount}</td>
          <td>${c.avgRating.toFixed(1)} ${window.AppUtils.renderStars(c.avgRating)}</td>
          <td>${window.AppUtils.escapeHtml(c.lastReview)}</td>
        </tr>`);
    });
  }

  document.getElementById('search-clientes')?.addEventListener('input', (e) => {
    search = e.target.value;
    render();
  });

  document.getElementById('form-cliente')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cliente-nome').value.trim();
    const email = document.getElementById('cliente-email').value.trim();
    const phone = document.getElementById('cliente-phone').value.trim();

    if (!name || !email) {
      alert('Preencha nome e email.');
      return;
    }

    clients.unshift({
      name, email, phone: phone || '—',
      reviewCount: 0, avgRating: 0, lastReview: '—',
    });

    e.target.reset();
    render();
    alert('Cliente cadastrado (demo — salvo apenas na sessão).');
  });

  render();
});

function buildClientList(reviews) {
  const base = window.AppData.getClients();
  const map = new Map();

  base.forEach((c) => {
    map.set(c.name, { ...c, reviewCount: 0, ratingSum: 0, lastReview: '—' });
  });

  reviews.forEach((r) => {
    if (!map.has(r.clientName)) {
      map.set(r.clientName, {
        name: r.clientName, email: '—', phone: '—',
        reviewCount: 0, ratingSum: 0, lastReview: '—',
      });
    }
    const c = map.get(r.clientName);
    c.reviewCount += 1;
    c.ratingSum += r.rating;
    c.lastReview = r.date;
  });

  return Array.from(map.values()).map((c) => ({
    ...c,
    avgRating: c.reviewCount > 0 ? c.ratingSum / c.reviewCount : 0,
  }));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
