/*
 * auth.js (demo local)
 *
 * Faz bloqueio simples de acesso às páginas admin via localStorage.
 */

(function () {
  window.AppAuth = {
    isAuthed() {
      return localStorage.getItem('isAuthed') === 'true';
    },

    requireAuth(redirectTo) {
      const ok = this.isAuthed();
      if (!ok) {
        window.location.href = redirectTo || 'login.html';
      }
      return ok;
    },

    logout() {
      localStorage.removeItem('isAuthed');
      localStorage.removeItem('authUser');
      // mata cache de navegação
      try {
        localStorage.setItem('lastLogoutAt', String(Date.now()));
      } catch (e) {}
      window.location.href = 'login.html';
    }
  };
})();


