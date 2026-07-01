/**
 * Autenticação demo via localStorage.
 */
(function () {
  const cfg = window.AppConfig;

  window.AppAuth = {
    isAuthed() {
      return localStorage.getItem(cfg.storageKeys.auth) === 'true';
    },

    login(email) {
      localStorage.setItem(cfg.storageKeys.auth, 'true');
      localStorage.setItem(cfg.storageKeys.authUser, JSON.stringify({ email }));
    },

    requireAuth() {
      if (!this.isAuthed()) {
        window.location.href = cfg.paths.login;
        return false;
      }
      return true;
    },

    logout() {
      localStorage.removeItem(cfg.storageKeys.auth);
      localStorage.removeItem(cfg.storageKeys.authUser);
      try {
        localStorage.setItem('lastLogoutAt', String(Date.now()));
      } catch (_) { /* noop */ }
      window.location.href = cfg.paths.login;
    },
  };
})();
