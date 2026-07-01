# Sistema de Avaliação — Barbearia Estilo & Classe

Sistema de avaliação para barbearia desenvolvido com **HTML, CSS e JavaScript puro**. Clientes avaliam atendimento, serviço, ambiente e experiência; o administrador acompanha tudo pelo painel.

## Estrutura

```
/
├── index.html              # Avaliação pública (cliente)
├── pages/
│   ├── login.html
│   ├── dashboard.html
│   ├── avaliacoes.html
│   ├── clientes.html
│   ├── barbeiros.html
│   ├── relatorios.html
│   ├── configuracoes.html
│   └── perfil-admin.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── img/
│   ├── icons/
│   └── fonts/
└── README.md
```

## Executar localmente

```bash
python -m http.server 8080
```

- **Avaliação (cliente):** http://localhost:8080/
- **Login admin:** http://localhost:8080/pages/login.html

## Credenciais demo

| Campo | Valor |
|-------|-------|
| Email | `admin@barberpro.com` |
| Senha | `123456` |

## Páginas do painel

| Página | Conteúdo |
|--------|----------|
| Dashboard | Métricas, gráficos, serviços mais/menos avaliados, avaliações recentes |
| Avaliações | Lista completa com busca, filtros e paginação |
| Clientes | Cadastro demo, lista, histórico e média por cliente |
| Barbeiros | Fotos, especialidade, média, atendimentos e últimas avaliações |
| Relatórios | Médias, ranking, evolução, exportação fictícia PDF/Excel |
| Configurações | Tema, reset de dados, link para avaliação pública |
| Meu Perfil | Dados do administrador |

## GitHub Pages

Todos os caminhos são relativos — compatível com deploy em subpastas.

## Tecnologias

HTML5 semântico · CSS modular · JavaScript ES6+ · Font Awesome · Google Fonts · localStorage (demo)
