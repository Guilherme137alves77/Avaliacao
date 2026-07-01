/**
 * Configuração central — caminhos relativos e constantes do demo.
 */
(function () {
  const isInPages = /\/pages\//.test(window.location.pathname) ||
    window.location.pathname.endsWith('/pages');

  function fromRoot(relativePath) {
    return isInPages ? '../' + relativePath : relativePath;
  }

  function fromPages(pageFile) {
    return isInPages ? pageFile : 'pages/' + pageFile;
  }

  window.AppConfig = {
    isInPages,
    fromRoot,
    fromPages,

    paths: {
      index: fromRoot('index.html'),
      login: fromPages('login.html'),
      dashboard: fromPages('dashboard.html'),
      avaliacoes: fromPages('avaliacoes.html'),
      clientes: fromPages('clientes.html'),
      barbeiros: fromPages('barbeiros.html'),
      relatorios: fromPages('relatorios.html'),
      configuracoes: fromPages('configuracoes.html'),
      perfilAdmin: fromPages('perfil-admin.html'),
    },

    storageKeys: {
      reviews: 'barberReviews',
      auth: 'isAuthed',
      authUser: 'authUser',
      theme: 'appTheme',
    },

    demo: {
      email: 'admin@barberpro.com',
      password: '123456',
      adminName: 'Administrador',
      adminRole: 'Gerente — Estilo & Classe',
    },

    ratingLabels: ['Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'],
  };
})();
