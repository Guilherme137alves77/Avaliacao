/**
 * Perfil do administrador.
 */
document.addEventListener('DOMContentLoaded', () => {
  window.AppLayout.initAdminPage('perfil-admin', 'Meu Perfil');

  const { demo, storageKeys } = window.AppConfig;
  let authUser = { email: demo.email };

  try {
    authUser = JSON.parse(localStorage.getItem(storageKeys.authUser)) || authUser;
  } catch { /* noop */ }

  setText('profile-name', demo.adminName);
  setText('profile-role', demo.adminRole);
  setText('profile-email', authUser.email || demo.email);

  const reviews = window.AppUtils.getReviews();
  setText('profile-reviews-managed', reviews.length);
  setText('profile-last-access', new Date().toLocaleDateString('pt-BR'));

  document.getElementById('form-perfil')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Perfil atualizado (demo). Em produção, os dados seriam salvos no servidor.');
  });
});

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
