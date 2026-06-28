# Dashboard mobile (header + off-canvas) — como funciona e o que foi ajustado

Este documento explica **o que existe** em `assets/global/pages/dashboard.html` para o comportamento mobile e **quais erros foram corrigidos** para ele voltar a funcionar.

---

## 1) Estrutura geral do `dashboard.html`

A página tem 3 partes principais:

1. **`#admin-view`**: wrapper do layout.
2. **Header mobile** (top bar)
3. **Navegação mobile off-canvas** (sidebar que sai da lateral) + **overlay**
4. **Conteúdo principal** (`main.main-content`) que fica embaixo.

---

## 2) Header mobile (top bar)

No HTML:

```html
<div class="mobile-topbar">
  <div class="mobile-topbar-left">
    <button class="mobile-menu-toggle" aria-label="Abrir menu">
      <i class="fas fa-bars"></i>
    </button>
    <div>
      <div class="mobile-title">Dashboard</div>
    </div>
  </div>
</div>
```

O botão (hambúrguer) tem a classe **`mobile-menu-toggle`**. Ele é o gatilho que abre/fecha o menu lateral.

No CSS (`assets/global/css/style.css`):
- `.mobile-topbar` começa como `display: none;`
- em `@media (max-width: 768px)` ela passa a aparecer.

---

## 3) Overlay (fundo escurecido)

No HTML:

```html
<div id="mobile-menu-overlay" class="mobile-menu-overlay hidden"></div>
```

- Quando o menu está fechado: tem a classe **`hidden`**.
- Quando abre: o JS remove `hidden`.
- O overlay permite fechar o menu tocando nele.

No CSS:
- `.mobile-menu-overlay` é `position: fixed; inset: 0;` e tem `background: rgba(...)`.
- `.mobile-menu-overlay:not(.hidden) { display:block; }` (ativado no mobile).

---

## 4) Sidebar off-canvas (menu lateral)

No HTML:

```html
<nav class="sidebar" id="mobile-sidebar">
  ...
</nav>
```

Ela usa duas condições para o comportamento mobile:
- Posição fora da tela: `left: -270px`
- Posição visível: `left: 0` quando tem a classe **`is-open`**.

Trecho do CSS (resumo):

```css
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -270px;
    transition: left 0.25s ease;
    height: 100vh;
    width: 270px;
  }

  .sidebar.is-open { left: 0; }
}
```

---

## 5) Script inline: abrir/fechar o menu

No final do `dashboard.html` existe um IIFE que controla o menu:

```js
(function () {
  const overlay = document.getElementById('mobile-menu-overlay');
  const sidebar = document.getElementById('mobile-sidebar');
  const toggleBtn = document.querySelector('.mobile-menu-toggle');

  function openMenu() {
    if (sidebar) sidebar.classList.add('is-open');
    if (overlay) overlay.classList.remove('hidden');
  }

  function closeMenu() {
    if (sidebar) sidebar.classList.remove('is-open');
    if (overlay) overlay.classList.add('hidden');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // Fecha ao clicar em qualquer link do menu
  if (sidebar) {
    const links = sidebar.querySelectorAll('a');
    links.forEach(a => a.addEventListener('click', closeMenu));
  }

  // Fecha ao voltar para desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
})();
```

Ou seja:
- Clique no botão => adiciona `is-open` na sidebar e remove `hidden` do overlay.
- Clique no overlay => remove `is-open` e volta `hidden`.
- Clique em qualquer link do menu => fecha.
- Redimensionar para desktop (>768) => fecha.

---

## 6) Correções que foram feitas (erros que voltaram)

### (a) Caminhos de assets/scripts
Em páginas web, caminhos relativos podem quebrar dependendo de onde a página está sendo servida (principalmente quando abre direto via navegador, ou com rotas).

Foi ajustado para usar **URLs absolutas com `/assets/...`**:
- CSS:
  - de `assets/global/css/style.css`
  - para `/assets/global/css/style.css`
- Scripts:
  - de `assets/js/auth.js`
  - para `/assets/js/auth.js`
- `requireAuth`:
  - de `assets/global/pages/login.html`
  - para `/assets/global/pages/login.html`

Objetivo: garantir que o CSS e JS carreguem mesmo em contextos diferentes.

### (b) Erro no menu mobile do item “Clientes”
Antes, o item “Clientes” estava com HTML/estado inconsistente (parecia sem link adequado/active incorreto).

Foi ajustado para:
- ter um `<a>` apontando corretamente para `assets/global/pages/clients.html`.

Isso garante que ao navegar pelo menu mobile, você realmente vá para a página certa.

---

## 7) Como você testa sozinho (checklist)

1. Abra `assets/global/pages/dashboard.html` no navegador.
2. Ative mobile (DevTools) ou redimensione para largura <= 768.
3. Verifique:
   - O botão hamburger aparece no header.
   - Clique abre o menu (sidebar entra pela esquerda).
   - O overlay escurece.
   - Clique no overlay fecha.
   - Clique em qualquer item do menu fecha e navega.
   - Ao aumentar a largura > 768, o menu deve fechar.
4. Confira também no Console:
   - sem erros de carregamento de CSS/JS
   - sem erros do `AppAuth.requireAuth`.

---

## 8) Se ainda “não resolveu”

Se você ainda estiver vendo apenas HTML (sem styling/função):
- o problema normalmente é **carregamento de CSS/JS** (caminho errado) ou **erro no console**.

O que fazer:
- Abra o Console do navegador (F12) e procure por:
  - `Failed to load resource ...`
  - `ReferenceError ...`
  - erros do `AppAuth`.

Se quiser, você pode mandar aqui o output do Console (as 5-10 linhas de erro) para identificar o motivo exato.

