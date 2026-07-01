/**
 * Utilitários compartilhados: storage, renderização e segurança básica.
 */
(function () {
  const { storageKeys } = window.AppConfig || { storageKeys: { reviews: 'barberReviews' } };

  function getReviews() {
    try {
      const raw = JSON.parse(localStorage.getItem(storageKeys.reviews)) || [];
      return raw.map((r, i) => window.AppData.enrichReview(r, i));
    } catch {
      return [];
    }
  }

  function saveReviews(reviews) {
    localStorage.setItem(storageKeys.reviews, JSON.stringify(reviews));
  }

  function seedReviewsIfEmpty() {
    const existing = localStorage.getItem(storageKeys.reviews);
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (parsed.length) return getReviews();
      } catch { /* re-seed */ }
    }

    saveReviews(window.AppData.SEED_REVIEWS);
    return getReviews();
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function renderStars(rating) {
    const rounded = Math.round(Number(rating));
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += i <= rounded
        ? '<i class="fas fa-star" aria-hidden="true"></i>'
        : '<i class="far fa-star" style="opacity:0.3" aria-hidden="true"></i>';
    }
    return html;
  }

  function calcMetrics(reviews) {
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = total > 0 ? (sum / total).toFixed(1) : '0.0';
    const satisfaction = total > 0
      ? Math.round((reviews.filter((r) => r.rating >= 4).length / total) * 100)
      : 0;
    const clients = window.AppData.getUniqueClients(reviews);
    const barbers = window.AppData.getBarbers().length;

    return { total, avg, satisfaction, clients, barbers };
  }

  function runLoadingSequence(overlay, msgEl, steps, onComplete, intervalMs) {
    if (!overlay) {
      onComplete();
      return;
    }

    overlay.classList.remove('hidden');
    let step = 0;

    const interval = setInterval(() => {
      if (step < steps.length) {
        if (msgEl) msgEl.textContent = steps[step];
        step += 1;
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, intervalMs || 700);
  }

  function renderPagination(container, page, totalPages, onChange) {
    if (!container) return;
    container.innerHTML = '';

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'page-btn';
    prev.textContent = 'Anterior';
    prev.disabled = page <= 1;
    prev.addEventListener('click', () => onChange(page - 1));

    const info = document.createElement('span');
    info.className = 'page-info';
    info.textContent = `Página ${page} de ${totalPages}`;

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'page-btn';
    next.textContent = 'Próxima';
    next.disabled = page >= totalPages;
    next.addEventListener('click', () => onChange(page + 1));

    container.appendChild(prev);
    container.appendChild(info);
    container.appendChild(next);
  }

  window.AppUtils = {
    getReviews,
    saveReviews,
    seedReviewsIfEmpty,
    escapeHtml,
    renderStars,
    calcMetrics,
    runLoadingSequence,
    renderPagination,
  };
})();
