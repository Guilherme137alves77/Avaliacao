/**
 * Configurações — tema demo, reset e navegação.
 */
document.addEventListener('DOMContentLoaded', () => {
  window.AppLayout.initAdminPage('configuracoes', 'Configurações');

  const { paths, storageKeys } = window.AppConfig;
  const THEME_KEYS = { dark: 'theme-dark', gold: 'theme-gold' };

  function getActiveTheme() {
    return localStorage.getItem(storageKeys.theme) || THEME_KEYS.dark;
  }

  function applyTheme(themeKey) {
    document.body.classList.remove('theme-dark', 'theme-gold-focus');
    document.body.classList.add(themeKey === THEME_KEYS.gold ? 'theme-gold-focus' : 'theme-dark');
    localStorage.setItem(storageKeys.theme, themeKey);
  }

  bindClick('btn-theme-dark', () => applyTheme(THEME_KEYS.dark));
  bindClick('btn-theme-gold', () => applyTheme(THEME_KEYS.gold));

  bindClick('btn-reset-all', () => {
    if (!confirm('Resetar todas as avaliações salvas neste navegador?')) return;
    window.AppUtils.saveReviews(window.AppData.SEED_REVIEWS);
    alert('Dados demo resetados.');
  });

  bindClick('btn-go-client', () => { window.location.href = paths.index; });

  applyTheme(getActiveTheme());
});

function bindClick(id, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', handler);
}
