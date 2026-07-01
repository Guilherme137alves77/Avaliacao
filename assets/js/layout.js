/**
 * Sidebar, menu mobile e ações comuns do painel admin.
 */
(function () {
  const NAV_ITEMS = [
    { id: 'dashboard', href: 'dashboard.html', icon: 'fa-chart-line', label: 'Dashboard' },
    { id: 'avaliacoes', href: 'avaliacoes.html', icon: 'fa-star', label: 'Avaliações' },
    { id: 'clientes', href: 'clientes.html', icon: 'fa-users', label: 'Clientes' },
    { id: 'barbeiros', href: 'barbeiros.html', icon: 'fa-user-tie', label: 'Barbeiros' },
    { id: 'relatorios', href: 'relatorios.html', icon: 'fa-file-alt', label: 'Relatórios' },
    { id: 'configuracoes', href: 'configuracoes.html', icon: 'fa-cog', label: 'Configurações' },
    { id: 'perfil-admin', href: 'perfil-admin.html', icon: 'fa-user-circle', label: 'Meu Perfil' },
  ];

  function renderSidebar(activeId, pageTitle) {
    const sidebar = document.getElementById('admin-sidebar');
    if (!sidebar) return;

    const itemsHtml = NAV_ITEMS.map((item) => {
      const isActive = item.id === activeId;
      return `
        <li class="nav-item${isActive ? ' active' : ''}">
          <a href="${item.href}"${isActive ? ' aria-current="page"' : ''}>
            <i class="fas ${item.icon}" aria-hidden="true"></i>
            <span class="nav-label">${item.label}</span>
          </a>
        </li>`;
    }).join('');

    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <i class="fas fa-cut" aria-hidden="true"></i>
          <span class="sidebar-logo-text">E&amp;C Admin</span>
        </div>
      </div>
      <ul class="nav-menu" role="list">${itemsHtml}</ul>`;

    const titleEl = document.querySelector('.mobile-title');
    if (titleEl && pageTitle) titleEl.textContent = pageTitle;
  }

  function initMobileMenu() {
    const overlay = document.getElementById('mobile-menu-overlay');
    const sidebar = document.getElementById('admin-sidebar');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');

    if (toggleBtn && sidebar) {
      toggleBtn.setAttribute('aria-controls', 'admin-sidebar');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
      if (sidebar) sidebar.classList.add('is-open');
      if (overlay) overlay.classList.remove('hidden');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      if (sidebar) sidebar.classList.remove('is-open');
      if (overlay) overlay.classList.add('hidden');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    if (sidebar) {
      sidebar.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  function initLogout() {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout && window.AppAuth) {
      btnLogout.addEventListener('click', () => window.AppAuth.logout());
    }
  }

  function initAdminPage(activeId, pageTitle, options = {}) {
    const { requireAuth = true } = options;
    if (requireAuth && window.AppAuth) window.AppAuth.requireAuth();
    renderSidebar(activeId, pageTitle);
    initMobileMenu();
    initLogout();
  }

  window.AppLayout = {
    NAV_ITEMS,
    renderSidebar,
    initMobileMenu,
    initLogout,
    initAdminPage,
  };
})();
