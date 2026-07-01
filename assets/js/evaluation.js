/**
 * Página pública de avaliação (index.html).
 */
document.addEventListener('DOMContentLoaded', () => {
  const { ratingLabels, paths } = window.AppConfig;
  const { getReviews, saveReviews, runLoadingSequence } = window.AppUtils;

  const stars = document.querySelectorAll('.star-input');
  const ratingText = document.getElementById('rating-text');
  const submitBtn = document.getElementById('submitBtn');
  const commentInput = document.getElementById('comment');

  stars.forEach((star) => {
    star.addEventListener('change', (e) => {
      const index = parseInt(e.target.value, 10) - 1;
      if (ratingText) ratingText.textContent = ratingLabels[index];
    });
  });

  document.querySelectorAll('.cat-item').forEach((item) => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.addEventListener('click', () => toggleCategory(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCategory(item);
      }
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
  }

  function toggleCategory(element) {
    element.classList.toggle('active');
    const isActive = element.classList.contains('active');
    element.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  }

  function handleSubmit() {
    const ratingEl = document.querySelector('input[name="star"]:checked');

    if (!ratingEl) {
      alert('Por favor, selecione uma nota de estrelas.');
      return;
    }

    const rating = parseInt(ratingEl.value, 10);
    const comment = commentInput ? commentInput.value.trim() : '';

    const activeCats = [];
    document.querySelectorAll('.cat-item.active span').forEach((span) => {
      activeCats.push(span.textContent);
    });

    const overlay = document.getElementById('loading-overlay');
    const msg = document.getElementById('loading-msg');

    const steps = [
      'Enviando avaliação...',
      'Processando dados...',
      'Salvando informações...',
      'Finalizando...',
      'Sucesso!',
    ];

    runLoadingSequence(overlay, msg, steps, () => {
      saveReview(rating, comment, activeCats);
      window.location.href = paths.dashboard;
    }, 700);
  }

  function saveReview(rating, comment, categories) {
    const reviews = getReviews();
    const barbers = window.AppData.getBarbers();
    const clients = window.AppData.getClients();
    const barber = barbers[Math.floor(Math.random() * barbers.length)];
    const client = clients[Math.floor(Math.random() * clients.length)];
    const service = categories.includes('Barba') && categories.includes('Corte')
      ? 'Combo Corte + Barba'
      : (categories[0] || 'Corte');

    reviews.unshift({
      rating,
      comment: comment || 'Sem comentário',
      date: new Date().toLocaleDateString('pt-BR'),
      timestamp: Date.now(),
      categories: categories.length > 0 ? categories : ['Geral'],
      clientName: client.name,
      barberId: barber.id,
      barberName: barber.name,
      service,
    });
    saveReviews(reviews);
  }
});
