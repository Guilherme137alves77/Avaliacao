/**
 * settings.js
 *
 * Página admin: Configurações.
 *
 * Responsabilidades:
 * - Aplicar um "tema" demo (classe/estilo local via CSS vars simplificados)
 * - Permitir resetar dados do demo (localStorage: barberReviews)
 * - Redirecionar para a página do cliente (index.html)
 */

const THEME_KEYS = {
  dark: 'theme-dark',
  gold: 'theme-gold'
};

function getActiveTheme() {
  return localStorage.getItem('appTheme') || THEME_KEYS.dark;
}

function applyTheme(themeKey) {
  // Trabalhamos com CSS variables no :root do style.css.
  // O style.css atual já usa --gold/--gold-light/etc.
  // Aqui faremos apenas um ajuste leve via classes no body.
  document.body.classList.remove('theme-dark');
  document.body.classList.remove('theme-gold-focus');

  if (themeKey === THEME_KEYS.gold) {
    document.body.classList.add('theme-gold-focus');
  } else {
    document.body.classList.add('theme-dark');
  }

  localStorage.setItem('appTheme', themeKey);
}

function resetReviews() {
  localStorage.removeItem('barberReviews');
  alert('Dados demo resetados.');
}

document.addEventListener('DOMContentLoaded', () => {
  // Botões tema
  const btnDark = document.getElementById('btn-theme-dark');
  const btnGold = document.getElementById('btn-theme-gold');

  if (btnDark) {
    btnDark.addEventListener('click', () => applyTheme(THEME_KEYS.dark));
  }
  if (btnGold) {
    btnGold.addEventListener('click', () => applyTheme(THEME_KEYS.gold));
  }

  // Reset
  const btnReset = document.getElementById('btn-reset-all');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (!confirm('Resetar todas as avaliações salvas neste navegador?')) return;
      resetReviews();
    });
  }

  // Redirecionar
  const btnGoClient = document.getElementById('btn-go-client');
  if (btnGoClient) {
    btnGoClient.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Aplica tema atual ao carregar
  applyTheme(getActiveTheme());
});

