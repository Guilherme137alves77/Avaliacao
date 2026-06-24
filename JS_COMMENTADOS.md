# JS comentado (linha a linha)

Abaixo estão versões **reproduzidas** dos seus arquivos JS principais com comentários **ao lado de cada linha** (ou bloco próximo da linha correspondente). Se algum arquivo tiver sido diferente no seu navegador/VSCode, compare com o original.

---

## 1) `script.js`
```js
/**
 * Inicializa a tela de avaliação quando o DOM estiver pronto.
 *
 * Responsabilidades:
 * - Configurar listeners das estrelas (atualizar texto da avaliação).
 * - Configurar o botão de envio para chamar handleSubmit().
 */
document.addEventListener('DOMContentLoaded', () => { // Espera o HTML terminar de carregar
  // Setup inicial das estrelas
  const stars = document.querySelectorAll('.star-input'); // Seleciona todas as estrelas/radios
  const ratingText = document.getElementById('rating-text'); // Onde o texto da nota vai aparecer
  const labels = ["Péssimo", "Ruim", "Regular", "Bom", "Excelente"]; // Texto correspondente às notas 1..5

  // Para cada estrela (radio), quando o valor mudar, atualiza o texto exibido.
  stars.forEach(star => { // Para cada input de estrela
    star.addEventListener('change', (e) => { // Quando o usuário mudar a seleção
      ratingText.innerText = labels[parseInt(e.target.value) - 1]; // Ajusta índice (-1) e escreve o rótulo
    });
  });

  // Configurar botão de envio
  document.getElementById('submitBtn').addEventListener('click', handleSubmit); // Ao clicar, chama handleSubmit
});

/**
 * Alterna a classe CSS 'active' em uma categoria.
 *
 * @param {HTMLElement} element - Elemento clicado (ex.: div `.cat-item`).
 */
function toggleCategory(element) { // Função chamada quando um item de categoria é clicado
  element.classList.toggle('active'); // Alterna a classe 'active' (adiciona/remover)
}

/**
 * Executa o fluxo de envio da avaliação:
 * - Valida se uma nota foi selecionada.
 * - Coleta comentário e categorias ativas.
 * - Mostra um overlay de loading com etapas.
 * - Salva no localStorage via saveData().
 * - Redireciona para dashboard.html.
 */
function handleSubmit() { // Fluxo principal ao enviar
  // Busca a estrela selecionada (radio button).
  const ratingEl = document.querySelector('input[name="star"]:checked'); // Procura o radio selecionado

  // Se não houver seleção, mostra um alerta e cancela o envio.
  if (!ratingEl) { // Se nada foi selecionado
    alert("Por favor, selecione uma nota de estrelas."); // Mostra alerta
    return; // Cancela a execução
  }

  // Converte o valor da nota e lê o comentário.
  const rating = parseInt(ratingEl.value); // Converte valor do input para número
  const comment = document.getElementById('comment').value; // Lê o texto do comentário

  // Coletar categorias ativas (aqueles spans dentro de `.cat-item.active`).
  const activeCats = []; // Array que vai guardar nomes das categorias selecionadas
  document
    .querySelectorAll('.cat-item.active span') // Seleciona spans dentro de categorias ativas
    .forEach(span => activeCats.push(span.innerText)); // Para cada span, adiciona o texto no array

  // Mostrar Loading
  const overlay = document.getElementById('loading-overlay'); // Overlay que cobre a tela
  const msg = document.getElementById('loading-msg'); // Elemento onde a mensagem muda
  overlay.classList.remove('hidden'); // Remove 'hidden' para mostrar

  // Mensagens exibidas em sequência.
  const steps = [ // Lista de mensagens
    "Enviando avaliação...",
    "Processando dados...",
    "Salvando informações...",
    "Finalizando..."
  ];

  // Controla o índice da etapa.
  let step = 0; // Começa na etapa 0

  // Atualiza a mensagem e, ao final, salva/redireciona.
  const interval = setInterval(() => { // Cria um timer que roda a cada 800ms
    step++; // Avança para a próxima mensagem

    if (step < steps.length) { // Enquanto ainda houver mensagens
      msg.innerText = steps[step]; // Atualiza a mensagem
    } else { // Quando terminou as mensagens
      clearInterval(interval); // Para o timer

      // Persiste a avaliação no localStorage.
      saveData(rating, comment, activeCats); // Salva avaliação
      msg.innerText = "Sucesso!"; // Mostra sucesso

      // Esconde o overlay e navega para o dashboard.
      setTimeout(() => { // Espera 800ms antes de navegar
        overlay.classList.add('hidden'); // Esconde overlay
        window.location.href = 'dashboard.html'; // Redireciona
      }, 800);
    }
  }, 800);
}

/**
 * Salva uma avaliação no `localStorage`.
 *
 * Estrutura esperada em localStorage:
 * - chave: 'barberReviews'
 * - valor: array de objetos { rating, comment, date, categories }
 *
 * A nova avaliação é inserida no início do array.
 *
 * @param {number} rating - Nota de 1 a 5.
 * @param {string} comment - Comentário do cliente.
 * @param {string[]} categories - Lista de categorias selecionadas.
 */
function saveData(rating, comment, categories) { // Salva avaliação
  // Lê avaliações existentes (ou cria um array vazio se não existir).
  const reviews = JSON.parse(localStorage.getItem('barberReviews')) || []; // Busca no storage e faz parse

  // Monta o objeto da nova avaliação.
  const newReview = { // Objeto para a nova avaliação
    rating: rating, // Nota
    comment: comment || "Sem comentário", // Se vazio, usa string padrão
    date: new Date().toLocaleDateString('pt-BR'), // Data no formato pt-BR
    categories: categories.length > 0 ? categories : ["Geral"] // Se não selecionou, cai para "Geral"
  };

  // Adiciona no início (mais recente primeiro).
  reviews.unshift(newReview); // Cola no começo

  // Persiste novamente no localStorage.
  localStorage.setItem('barberReviews', JSON.stringify(reviews)); // Salva array atualizado
}
```

---

## 2) `dashboard.js`
```js
document.addEventListener('DOMContentLoaded', () => { // Aguarda o DOM
  // Garante que existe um conjunto inicial de avaliações no localStorage.
  if (!localStorage.getItem('barberReviews')) { // Se não existir a chave
    // Seed de avaliações apenas para demonstração.
    const seedData = [ // Array com avaliações fictícias
      { rating: 5, comment: "Serviço impecável, atendimento de primeiro mundo.", date: "24/06/2026", categories: ["Corte", "Ambiente"] },
      { rating: 4, comment: "Muito bom, mas demorou um pouco.", date: "23/06/2026", categories: ["Corte"] },
      { rating: 5, comment: "Melhor barbearia da região.", date: "22/06/2026", categories: ["Barba", "Ambiente"] },
      { rating: 3, comment: "Regular, esperava mais pelo preço.", date: "20/06/2026", categories: ["Atendimento"] }
    ];

    // Persiste o seed no localStorage.
    localStorage.setItem('barberReviews', JSON.stringify(seedData)); // Salva o seed
  }

  // Renderiza o dashboard assim que a base estiver pronta.
  renderDashboard(); // Chama função de renderização

  // Botão demo para voltar à página inicial.
  const btnNew = document.getElementById('btn-new-review'); // Botão "nova avaliação"
  if (btnNew) { // Se existir
    btnNew.addEventListener('click', () => { // Ao clicar
      window.location.href = 'index.html'; // Redireciona para index
    });
  }
});

/**
 * Renderiza os dados das avaliações no dashboard.
 *
 * Responsabilidades:
 * - Ler avaliações do localStorage.
 * - Calcular métricas (total, média e satisfação).
 * - Montar gráfico de barras (distribuição por nota).
 * - Montar tabela com as avaliações mais recentes.
 */
function renderDashboard() { // Função principal de renderização
  // Carrega avaliações do localStorage (ou array vazio se não houver).
  const reviews = JSON.parse(localStorage.getItem('barberReviews')) || []; // Lê e parseia

  // =====================
  // 1) Métricas
  // =====================
  const total = reviews.length; // Total de avaliações

  // Soma das notas para calcular a média.
  const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0); // Soma todas as notas
  const avg = total > 0 ? (sum / total).toFixed(1) : 0; // Média com 1 casa decimal

  // Satisfação: percentual de avaliações com rating >= 4.
  const satisfaction = total > 0
    ? Math.round((reviews.filter(r => r.rating >= 4).length / total) * 100)
    : 0; // Percentual arredondado

  const elTotal = document.getElementById('metric-total'); // Elemento para total
  const elAvg = document.getElementById('metric-avg'); // Elemento para média
  const elSat = document.getElementById('metric-satisfaction'); // Elemento para satisfação

  // Atualiza os elementos da UI (se existirem).
  if (elTotal) elTotal.innerText = total; // Atualiza se existir
  if (elAvg) elAvg.innerText = avg; // Atualiza se existir
  if (elSat) elSat.innerText = satisfaction + "%"; // Atualiza se existir

  // =====================
  // 2) Gráfico de Barras (Distribuição)
  // =====================
  // Estrutura de contagem por nota.
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }; // Inicializa contadores
  reviews.forEach(r => counts[r.rating]++); // Incrementa contagem por nota

  const chartContainer = document.getElementById('chart-bars'); // Container do gráfico
  if (chartContainer) { // Se existe na página
    // Limpa antes de renderizar.
    chartContainer.innerHTML = ''; // Reset HTML

    // Renderiza da nota 5 até 1.
    for (let i = 5; i >= 1; i--) { // Laço decrescente
      const count = counts[i]; // Quantidade de avaliações com nota i
      const percentage = total > 0 ? (count / total) * 100 : 0; // Percentual daquela nota

      // Monta o HTML do grupo de barras.
      const html = `
<div class="bar-group">
  <div class="bar-label">
    <span><i class="fas fa-star text-gold" style="font-size:0.7rem"></i> ${i}</span>
    <span>${count} (${Math.round(percentage)}%)</span>
  </div>
  <div class="progress-bg">
    <div class="progress-fill" style="width: ${percentage}%"></div>
  </div>
</div>
`; // Template literal

      chartContainer.innerHTML += html; // Adiciona ao container
    }
  }

  // =====================
  // 3) Tabela (avaliações recentes)
  // =====================
  const tbody = document.getElementById('reviews-table-body'); // Corpo da tabela
  if (tbody) { // Se existe
    // Limpa antes de renderizar.
    tbody.innerHTML = ''; // Reset HTML

    // Mostrar apenas as 5 mais recentes.
    reviews.slice(0, 5).forEach(r => { // Pega primeiros 5 (assumindo mais recentes no topo)
      // Monta as estrelas para exibir a nota (cheias e vazias).
      let starsHtml = ''; // HTML acumulado das estrelas
      for (let i = 0; i < 5; i++) { // Para 5 posições
        starsHtml += i < r.rating
          ? '<i class="fas fa-star"></i>' // Estrela cheia se i < rating
          : '<i class="far fa-star" style="opacity:0.3"></i>'; // Estrela vazia senão
      }

      // Monta a linha da tabela.
      const row = `
<tr>
  <td>${r.date}</td>
  <td><span style="color:white; font-size:0.8rem">${r.categories.join(', ')}</span></td>
  <td>${r.comment}</td>
  <td class="rating-badge">${starsHtml}</td>
</tr>
`; // Template literal de linha

      tbody.innerHTML += row; // Adiciona linha
    });
  }
}
```

---

## 3) `clients.js`
```js
/**
 * clients.js
 *
 * Página admin: Clientes.
 *
 * Abordagem (demo):
 * - Este projeto hoje salva apenas avaliações em localStorage (`barberReviews`).
 * - Para a página de "Clientes", criamos clientes fictícios (Cliente 1..N) mapeando as avaliações em sequência.
 * - Para cada cliente, agregamos:
 *   - quantidade de avaliações
 *   - nota média
 *   - última data
 *   - categoria mais frequente (top categoria)
 *
 * Responsabilidades:
 * - Ler avaliações do localStorage
 * - Construir agregações por cliente fictício
 * - Renderizar métricas e tabela
 * - Permitir reset demo (limpa localStorage e recarrega)
 */

function safeParseReviews() { // Lê localStorage e faz parse com proteção
  try { // Tenta parsear
    return JSON.parse(localStorage.getItem('barberReviews')) || []; // Se nulo, retorna []
  } catch { // Se quebrar parse, evita crash
    return []; // Array vazio
  }
}

/**
 * Divide avaliações em "clientes fictícios".
 *
 * Heurística simples:
 * - Um cliente recebe até `maxReviewsPerClient` avaliações consecutivas.
 *
 * @param {Array} reviews
 * @param {number} maxReviewsPerClient
 * @returns {Array} avaliações com campo `clientId`
 */
function assignFictionalClients(reviews, maxReviewsPerClient = 3) { // Divide avaliações
  return reviews.map((r, idx) => { // Para cada review/índice
    const clientIndex = Math.floor(idx / maxReviewsPerClient); // Define qual cliente o índice pertence
    return {
      ...r, // Espalha campos existentes
      clientId: clientIndex, // Adiciona id do cliente
      clientName: `Cliente ${clientIndex + 1}` // Nome amigável
    };
  });
}

/**
 * Calcula agregações por cliente.
 *
 * @param {Array} reviewsWithClient
 * @returns {Object} mapa clientId -> agregado
 */
function buildClientsAggregate(reviewsWithClient) { // Cria agregados
  const map = new Map(); // Map para agrupar por clientId

  for (const r of reviewsWithClient) { // Para cada review já com clientId
    const id = r.clientId; // Pega id do cliente
    if (!map.has(id)) { // Se ainda não existe agregado
      map.set(id, {
        clientId: id, // id
        clientName: r.clientName, // nome
        reviewsCount: 0, // contador
        ratingSum: 0, // soma notas
        lastDate: r.date, // última data (vai atualizar depois)
        topCategory: '—', // top categoria (placeholder)
        categoryCounts: new Map() // contagem por categoria
      });
    }

    const agg = map.get(id); // Pega o agregado
    agg.reviewsCount += 1; // incrementa quantidade
    agg.ratingSum += r.rating; // soma nota

    // Mantém a "última" data (como reviews são inseridas no início, a ordem tende a ser do mais novo primeiro)
    agg.lastDate = r.date; // atualiza a data

    // Contagem de categorias
    const categories = Array.isArray(r.categories) ? r.categories : []; // garante que é array
    categories.forEach((c) => { // para cada categoria
      agg.categoryCounts.set(c, (agg.categoryCounts.get(c) || 0) + 1); // incrementa contagem
    });
  }

  // Finaliza topCategory
  for (const agg of map.values()) { // Para cada agregado
    let best = null; // vai guardar melhor categoria
    for (const [cat, count] of agg.categoryCounts.entries()) { // percorre contagens
      if (!best || count > best.count) best = { cat, count }; // escolhe maior
    }
    agg.topCategory = best ? best.cat : '—'; // define top
    // nota média
    agg.avgRating = agg.reviewsCount > 0 ? (agg.ratingSum / agg.reviewsCount) : 0; // média
  }

  return map; // devolve mapa agregado
}

/**
 * Renderiza a UI.
 *
 * @param {Map} clientsMap
 * @param {Array} allReviews
 */
function renderClients(clientsMap, allReviews) { // renderiza métricas e tabela
  // Métricas
  const clientTotal = clientsMap.size; // total clientes fictícios
  const totalReviews = allReviews.length; // total reviews

  const avgReviewsPerClient = clientTotal > 0 ? totalReviews / clientTotal : 0; // média reviews por cliente
  const satisfaction = totalReviews > 0
    ? Math.round((allReviews.filter(r => r.rating >= 4).length / totalReviews) * 100)
    : 0; // satisfação

  const elTotal = document.getElementById('metric-client-total'); // elemento total
  const elRPC = document.getElementById('metric-reviews-per-client'); // reviews por cliente
  const elSat = document.getElementById('metric-client-satisfaction'); // satisfação

  if (elTotal) elTotal.innerText = clientTotal; // atualiza se existir
  if (elRPC) elRPC.innerText = avgReviewsPerClient.toFixed(1); // atualiza se existir
  if (elSat) elSat.innerText = satisfaction + '%'; // atualiza se existir

  // Tabela
  const tbody = document.getElementById('clients-table-body'); // corpo da tabela
  if (!tbody) return; // se não existir, para
  tbody.innerHTML = ''; // limpa

  // Ordena por quantidade de avaliações desc
  const list = Array.from(clientsMap.values()).sort((a, b) => b.reviewsCount - a.reviewsCount); // ordena

  for (const c of list) { // para cada cliente
    const stars = renderStars(c.avgRating); // gera estrelas baseadas na média

    tbody.innerHTML += `
      <tr>
        <td>${escapeHtml(c.clientName)}</td>
        <td>${c.reviewsCount}</td>
        <td>${Number(c.avgRating).toFixed(1)}<div style="margin-top:6px; color: var(--gold); font-size:0.8rem;">${stars}</div></td>
        <td>${escapeHtml(c.lastDate)}</td>
        <td><span style="color: white; font-size:0.8rem">${escapeHtml(c.topCategory)}</span></td>
      </tr>
    `; // adiciona linha
  }
}

/**
 * Renderiza estrelas a partir de nota média.
 *
 * @param {number} avgRating
 * @returns {string}
 */
function renderStars(avgRating) { // monta HTML de estrelas
  const rounded = Math.round(avgRating); // arredonda nota
  let html = ''; // acumulador
  for (let i = 1; i <= 5; i++) { // de 1 a 5
    html += i <= rounded
      ? '<i class="fas fa-star"></i>' // cheia
      : '<i class="far fa-star" style="opacity:0.3"></i>'; // vazia
  }
  return html; // devolve HTML
}

/**
 * Escape básico de HTML para evitar injeção quando renderiza texto.
 *
 * @param {string} str
 */
function escapeHtml(str) { // protege strings contra caracteres perigosos
  return String(str) // garante string
    .replaceAll('&', '&amp;') // escapa &
    .replaceAll('<', '<') // (isso não escapa de fato; é bug - mas mantive)
    .replaceAll('>', '>') // (bug similar; mantive)
    .replaceAll('"', '"') // (bug; mantive)
    .replaceAll("'", '&#039;'); // escapa apóstrofo
}

function resetDemoData() { // reseta reviews do demo
  localStorage.removeItem('barberReviews'); // remove chave
  // Recarrega para reaplicar seed do dashboard/fluxo quando você voltar.
  window.location.href = 'clients.html'; // recarrega página
}

document.addEventListener('DOMContentLoaded', () => { // aguarda DOM
  const reviews = safeParseReviews(); // lê reviews com segurança

  // Se não tiver reviews, não renderiza vazio; mas cria seed via comportamento do dashboard.
  // Aqui só hidratamos com seed mínima caso seja necessário.
  if (!reviews.length) { // se vazio
    const seedData = [ // seed
      { rating: 5, comment: "Serviço impecável, atendimento de primeiro mundo.", date: "24/06/2026", categories: ["Corte", "Ambiente"] },
      { rating: 4, comment: "Muito bom, mas demorou um pouco.", date: "23/06/2026", categories: ["Corte"] },
      { rating: 5, comment: "Melhor barbearia da região.", date: "22/06/2026", categories: ["Barba", "Ambiente"] },
      { rating: 3, comment: "Regular, esperava mais pelo preço.", date: "20/06/2026", categories: ["Atendimento"] }
    ];
    localStorage.setItem('barberReviews', JSON.stringify(seedData)); // salva seed
  }

  const hydratedReviews = safeParseReviews(); // lê novamente (agora com seed se criou)
  const reviewsWithClient = assignFictionalClients(hydratedReviews); // atribui clientes fictícios
  const clientsMap = buildClientsAggregate(reviewsWithClient); // agrega métricas

  renderClients(clientsMap, hydratedReviews); // renderiza UI

  const btnReset = document.getElementById('btn-reset-clients'); // botão reset
  if (btnReset) { // se existir
    btnReset.addEventListener('click', () => { // ao clicar
      if (!confirm('Resetar dados demo? Isso vai apagar avaliações salvas no seu navegador.')) return; // confirmação
      resetDemoData(); // reseta
    });
  }
});
```

---

## 4) `settings.js`
```js
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

const THEME_KEYS = { // chaves que guardam tema
  dark: 'theme-dark', // tema dark
  gold: 'theme-gold' // tema gold
};

function getActiveTheme() { // retorna tema ativo
  return localStorage.getItem('appTheme') || THEME_KEYS.dark; // se não existir, fallback dark
}

function applyTheme(themeKey) { // aplica tema no body e salva no storage
  // Trabalhamos com CSS variables no :root do style.css.
  // O style.css atual já usa --gold/--gold-light/etc.
  // Aqui faremos apenas um ajuste leve via classes no body.
  document.body.classList.remove('theme-dark'); // remove classe dark
  document.body.classList.remove('theme-gold-focus'); // remove classe gold antiga

  if (themeKey === THEME_KEYS.gold) { // se tema for gold
    document.body.classList.add('theme-gold-focus'); // aplica classe gold
  } else {
    document.body.classList.add('theme-dark'); // aplica classe dark
  }

  localStorage.setItem('appTheme', themeKey); // persiste tema selecionado
}

function resetReviews() { // reseta avaliações
  localStorage.removeItem('barberReviews'); // remove chave reviews
  alert('Dados demo resetados.'); // feedback ao usuário
}

document.addEventListener('DOMContentLoaded', () => { // aguarda DOM
  // Botões tema
  const btnDark = document.getElementById('btn-theme-dark'); // botão dark
  const btnGold = document.getElementById('btn-theme-gold'); // botão gold

  if (btnDark) { // se existir
    btnDark.addEventListener('click', () => applyTheme(THEME_KEYS.dark)); // aplica dark
  }
  if (btnGold) { // se existir
    btnGold.addEventListener('click', () => applyTheme(THEME_KEYS.gold)); // aplica gold
  }

  // Reset
  const btnReset = document.getElementById('btn-reset-all'); // botão reset geral
  if (btnReset) { // se existir
    btnReset.addEventListener('click', () => { // ao clicar
      if (!confirm('Resetar todas as avaliações salvas neste navegador?')) return; // confirmação
      resetReviews(); // reseta reviews
    });
  }

  // Redirecionar
  const btnGoClient = document.getElementById('btn-go-client'); // botão ir para cliente
  if (btnGoClient) { // se existir
    btnGoClient.addEventListener('click', () => { // ao clicar
      window.location.href = 'index.html'; // redireciona
    });
  }

  // Aplica tema atual ao carregar
  applyTheme(getActiveTheme()); // aplica tema salvo no storage
});
```

---

## 5) `login.js`
```js
document.addEventListener('DOMContentLoaded', () => { // Aguarda DOM
// Inicializa os ícones do Lucide
lucide.createIcons(); // Cria/atualiza ícones SVG do Lucide

// Elementos do DOM
const loginForm = document.getElementById('loginForm'); // Form de login
const emailInput = document.getElementById('email'); // Campo email
const passwordInput = document.getElementById('password'); // Campo senha
const togglePassBtn = document.getElementById('togglePass'); // Botão de mostrar/esconder senha
const submitBtn = document.getElementById('submitBtn'); // Botão de submit
const btnText = submitBtn.querySelector('.btn-text'); // Texto do botão
const loader = document.getElementById('loader'); // Loader
const loadingOverlay = document.getElementById('loadingOverlay'); // Overlay loading
const loadingText = document.getElementById('loadingText'); // Texto do loading

// Mensagens de erro
const emailError = document.getElementById('emailError'); // Mensagem erro email
const passError = document.getElementById('passError'); // Mensagem erro senha

// Credenciais Demo
const DEMO_EMAIL = 'admin@barberpro.com'; // Email demo
const DEMO_PASS = '123456'; // Senha demo

// --- 1. Toggle Password Visibility ---
togglePassBtn.addEventListener('click', () => { // Ao clicar, alterna visibilidade da senha
const type = passwordInput.getAttribute('type') === 'password'? 'text': 'password'; // Descobre tipo atual e calcula novo
passwordInput.setAttribute('type', type); // Aplica novo type

// Troca o ícone
const icon = togglePassBtn.querySelector('i'); // Seleciona ícone dentro do botão
// Nota: Em um ambiente real com Lucide dinâmico, precisaríamos recriar o ícone ou trocar a classe SVG.
// Para simplificar neste demo, vamos apenas alternar a lógica visual se necessário,
// mas o Lucide renderiza SVGs estáticos. Vamos focar na funcionalidade.
if (type === 'text') { // Se senha ficou visível
icon.setAttribute('data-lucide', 'eye-off'); // Muda ícone para "olho com barra" (não está 100% consistente com o nome)
} else {
icon.setAttribute('data-lucide', 'eye'); // Senão, ícone olho aberto
}
lucide.createIcons(); // Re-renderiza ícone atualizado
});

// --- 2. Validação em Tempo Real (Limpa erros ao digitar) ---
emailInput.addEventListener('input', () => { // Quando digita no email
emailInput.classList.remove('input-error'); // remove borda de erro
emailError.style.opacity = '0'; // esconde mensagem
});

passwordInput.addEventListener('input', () => { // Quando digita na senha
passwordInput.classList.remove('input-error'); // remove borda de erro
passError.style.opacity = '0'; // esconde mensagem
});

function showError(input, errorElement) { // Helper para mostrar erro com shake

input.classList.add('input-error'); // marca input com classe de erro
errorElement.style.opacity = '1'; // mostra mensagem
// Pequena animação de shake no input
input.parentElement.animate([
{ transform: 'translateX(0)' }, // posição inicial
{ transform: 'translateX(-5px)' }, // vai para esquerda
{ transform: 'translateX(5px)' }, // vai para direita
{ transform: 'translateX(0)' } // volta para origem
], {
duration: 300,
iterations: 1
}); // animação
}

// --- 4. Simulação de Login com Animações ---
function startLoginSimulation() { // Inicia sequência visual
// 1. Estado inicial do botão
submitBtn.disabled = true; // desabilita botão
btnText.style.display = 'none'; // esconde texto
loader.classList.remove('hidden'); // mostra loader

// Simula verificação rápida no botão (opcional, mas dá feedback tátil)
setTimeout(() => { // espera 600ms
// 2. Exibe Overlay de Carregamento Full Screen
loadingOverlay.classList.remove('hidden'); // mostra overlay
loadingOverlay.style.opacity = '0'; // define opacidade inicial

// Fade in do overlay
setTimeout(() => { // próximo passo
loadingOverlay.style.transition = 'opacity 0.5s ease'; // animação de transição
loadingOverlay.style.opacity = '1'; // fade in
}, 50);

// Sequência de mensagens
runLoadingSequence(); // chama sequência de mensagens
}, 600);
}

function runLoadingSequence() { // Sequência de mensagens
const steps = [ // lista de mensagens e delays
{ text: "Verificando credenciais...", delay: 1500 },
{ text: "Carregando painel...", delay: 1500 },
{ text: "Finalizando acesso...", delay: 1000 }
];

let currentStep = 0; // índice atual

function nextStep() { // avança na sequência
if (currentStep < steps.length) { // se ainda há passos
// Fade out texto antigo
loadingText.style.opacity = '0'; // esconde texto

setTimeout(() => { // espera fade out
// Troca texto e Fade in
loadingText.innerText = steps[currentStep].text; // muda texto
loadingText.style.opacity = '1'; // mostra texto

currentStep++; // incrementa passo
setTimeout(nextStep, steps[currentStep - 1].delay); // agenda próximo passo com delay do passo anterior
}, 300); // Tempo para o fade out
} else {
// Finaliza e redireciona
redirectToDashboard(); // navega para dashboard
}
}

// Inicia a sequência
nextStep(); // chama primeiro passo
}

function redirectToDashboard() { // animação final e redirecionamento
  // Animação final de saída (opcional, para suavizar a troca de página)
  document.body.style.opacity = '0'; // esconde tela
  document.body.style.transition = 'opacity 0.5s ease'; // tempo da transição

  setTimeout(() => {
    window.location.href = "dashboard.html"; // redireciona após 500ms
  }, 500);
}

// --- 5. Autenticação fake (login + senha) ---
function isFakeAuthValid() { // valida credenciais demo
  const email = emailInput.value.trim().toLowerCase(); // normaliza email
  const password = passwordInput.value; // pega senha

  return email === DEMO_EMAIL && password === DEMO_PASS; // checa se bate
}

// --- Hooks de autenticação antes de rodar simulação ---
loginForm.addEventListener('submit', (e) => { // ao submeter form
  e.preventDefault(); // impede submit real

  let isValid = true; // flag geral de validação

  // Validação Email
  if (!emailInput.value.trim()) { // se email vazio
    showError(emailInput, emailError); // mostra erro
    isValid = false; // marca inválido
  }

  // Validação Senha
  if (!passwordInput.value.trim()) { // se senha vazia
    showError(passwordInput, passError); // mostra erro
    isValid = false; // marca inválido
  }

  if (!isValid) return; // se inválido, para

  // Credenciais fake
  if (!isFakeAuthValid()) { // se credenciais não batem
    // Mensagem única: marca os dois campos
    emailInput.classList.add('input-error'); // marca erro email
    passwordInput.classList.add('input-error'); // marca erro senha

    emailError.textContent = 'Email ou senha incorretos.'; // texto erro
    passError.textContent = 'Email ou senha incorretos.'; // texto erro
    emailError.style.opacity = '1'; // mostra msg
    passError.style.opacity = '1'; // mostra msg

    // Feedback visual rápido
    emailInput.parentElement.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(0)' }
    ], { duration: 300, iterations: 1 }); // shake

    return; // cancela
  }

  // Bloqueia múltiplos submits
  if (submitBtn.disabled) return; // se já estava desabilitado, para

  startLoginSimulation(); // inicia animações e redireciona
});

}); // fim DOMContentLoaded
```

---

## Observação importante
- Em `clients.js`, a função `escapeHtml()` tem substituições que **não escapam corretamente** `<`, `>`, `"` (elas permanecem idênticas). Isso é um bug de segurança/HTML.

