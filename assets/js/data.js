/**
 * Dados fictícios e helpers do contexto barbearia.
 */
(function () {
  const BARBERS = [
    { id: 'b1', name: 'Ricardo Silva', specialty: 'Corte clássico & fade', photo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop', attendances: 142 },
    { id: 'b2', name: 'Marcos Oliveira', specialty: 'Barba & bigode', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', attendances: 118 },
    { id: 'b3', name: 'André Costa', specialty: 'Corte moderno', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop', attendances: 95 },
    { id: 'b4', name: 'Felipe Mendes', specialty: 'Combo completo', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop', attendances: 87 },
  ];

  const CLIENTS = [
    { id: 'c1', name: 'João Pedro', email: 'joao@email.com', phone: '(11) 98765-4321' },
    { id: 'c2', name: 'Carlos Eduardo', email: 'carlos@email.com', phone: '(11) 97654-3210' },
    { id: 'c3', name: 'Lucas Ferreira', email: 'lucas@email.com', phone: '(11) 96543-2109' },
    { id: 'c4', name: 'Bruno Almeida', email: 'bruno@email.com', phone: '(11) 95432-1098' },
    { id: 'c5', name: 'Rafael Souza', email: 'rafael@email.com', phone: '(11) 94321-0987' },
    { id: 'c6', name: 'Diego Martins', email: 'diego@email.com', phone: '(11) 93210-9876' },
    { id: 'c7', name: 'Gabriel Lima', email: 'gabriel@email.com', phone: '(11) 92109-8765' },
    { id: 'c8', name: 'Thiago Rocha', email: 'thiago@email.com', phone: '(11) 91098-7654' },
  ];

  const SERVICES = ['Corte', 'Barba', 'Combo Corte + Barba', 'Acabamento', 'Hidratação', 'Sobrancelha'];

  const SEED_REVIEWS = [
    { id: 'r1', rating: 5, comment: 'Serviço impecável, atendimento de primeiro mundo.', date: '28/06/2026', timestamp: 1719590400000, categories: ['Corte', 'Ambiente'], clientName: 'João Pedro', barberId: 'b1', barberName: 'Ricardo Silva', service: 'Corte' },
    { id: 'r2', rating: 4, comment: 'Muito bom, mas demorou um pouco na espera.', date: '27/06/2026', timestamp: 1719504000000, categories: ['Corte'], clientName: 'Carlos Eduardo', barberId: 'b3', barberName: 'André Costa', service: 'Corte' },
    { id: 'r3', rating: 5, comment: 'Melhor barbearia da região, ambiente premium.', date: '26/06/2026', timestamp: 1719417600000, categories: ['Barba', 'Ambiente'], clientName: 'Lucas Ferreira', barberId: 'b2', barberName: 'Marcos Oliveira', service: 'Barba' },
    { id: 'r4', rating: 3, comment: 'Regular, esperava mais pelo preço.', date: '25/06/2026', timestamp: 1719331200000, categories: ['Atendimento'], clientName: 'Bruno Almeida', barberId: 'b4', barberName: 'Felipe Mendes', service: 'Combo Corte + Barba' },
    { id: 'r5', rating: 5, comment: 'Fade perfeito, Ricardo é fera!', date: '24/06/2026', timestamp: 1719244800000, categories: ['Corte'], clientName: 'Rafael Souza', barberId: 'b1', barberName: 'Ricardo Silva', service: 'Corte' },
    { id: 'r6', rating: 4, comment: 'Barba bem feita, recomendo.', date: '23/06/2026', timestamp: 1719158400000, categories: ['Barba'], clientName: 'Diego Martins', barberId: 'b2', barberName: 'Marcos Oliveira', service: 'Barba' },
    { id: 'r7', rating: 5, comment: 'Ambiente top, café cortesia excelente.', date: '22/06/2026', timestamp: 1719072000000, categories: ['Ambiente'], clientName: 'Gabriel Lima', barberId: 'b3', barberName: 'André Costa', service: 'Combo Corte + Barba' },
    { id: 'r8', rating: 2, comment: 'Demorou muito, pontualidade ruim.', date: '21/06/2026', timestamp: 1718985600000, categories: ['Pontualidade'], clientName: 'Thiago Rocha', barberId: 'b4', barberName: 'Felipe Mendes', service: 'Corte' },
    { id: 'r9', rating: 5, comment: 'Atendimento nota 10, voltarei com certeza.', date: '20/06/2026', timestamp: 1718899200000, categories: ['Corte', 'Ambiente'], clientName: 'João Pedro', barberId: 'b1', barberName: 'Ricardo Silva', service: 'Combo Corte + Barba' },
    { id: 'r10', rating: 4, comment: 'Bom custo-benefício.', date: '19/06/2026', timestamp: 1718812800000, categories: ['Corte'], clientName: 'Carlos Eduardo', barberId: 'b3', barberName: 'André Costa', service: 'Corte' },
    { id: 'r11', rating: 5, comment: 'Experiência premium de verdade.', date: '18/06/2026', timestamp: 1718726400000, categories: ['Ambiente', 'Barba'], clientName: 'Lucas Ferreira', barberId: 'b2', barberName: 'Marcos Oliveira', service: 'Barba' },
    { id: 'r12', rating: 3, comment: 'Corte ok, mas poderia ser mais detalhado.', date: '17/06/2026', timestamp: 1718640000000, categories: ['Corte'], clientName: 'Bruno Almeida', barberId: 'b4', barberName: 'Felipe Mendes', service: 'Corte' },
  ];

  function enrichReview(review, index) {
    const barber = BARBERS[index % BARBERS.length];
    const client = CLIENTS[index % CLIENTS.length];
    const cats = review.categories || ['Geral'];
    const service = cats.includes('Barba') && cats.includes('Corte')
      ? 'Combo Corte + Barba'
      : cats[0] || 'Corte';

    return {
      id: review.id || `r-${review.timestamp || Date.now()}-${index}`,
      rating: review.rating,
      comment: review.comment || 'Sem comentário',
      date: review.date || new Date().toLocaleDateString('pt-BR'),
      timestamp: review.timestamp || Date.now(),
      categories: cats,
      clientName: review.clientName || client.name,
      barberId: review.barberId || barber.id,
      barberName: review.barberName || barber.name,
      service: review.service || service,
    };
  }

  function getBarbers() {
    return BARBERS.map((b) => ({ ...b }));
  }

  function getClients() {
    return CLIENTS.map((c) => ({ ...c }));
  }

  function getServices() {
    return [...SERVICES];
  }

  function calcServiceStats(reviews) {
    const map = new Map();
    reviews.forEach((r) => {
      const svc = r.service || r.categories?.[0] || 'Geral';
      if (!map.has(svc)) map.set(svc, { sum: 0, count: 0 });
      const s = map.get(svc);
      s.sum += r.rating;
      s.count += 1;
    });

    return Array.from(map.entries())
      .map(([name, { sum, count }]) => ({ name, avg: sum / count, count }))
      .sort((a, b) => b.avg - a.avg);
  }

  function calcBarberStats(reviews) {
    const map = new Map();
    reviews.forEach((r) => {
      const id = r.barberId || r.barberName;
      if (!map.has(id)) {
        map.set(id, { name: r.barberName, sum: 0, count: 0, reviews: [] });
      }
      const b = map.get(id);
      b.sum += r.rating;
      b.count += 1;
      b.reviews.push(r);
    });

    return Array.from(map.values())
      .map((b) => ({
        ...b,
        avg: b.count > 0 ? b.sum / b.count : 0,
        lastReviews: b.reviews.slice(0, 3),
      }))
      .sort((a, b) => b.avg - a.avg);
  }

  function getUniqueClients(reviews) {
    return new Set(reviews.map((r) => r.clientName)).size;
  }

  function paginate(items, page, perPage) {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const current = Math.min(Math.max(1, page), totalPages);
    const start = (current - 1) * perPage;
    return {
      items: items.slice(start, start + perPage),
      page: current,
      perPage,
      total,
      totalPages,
    };
  }

  window.AppData = {
    BARBERS,
    CLIENTS,
    SERVICES,
    SEED_REVIEWS,
    enrichReview,
    getBarbers,
    getClients,
    getServices,
    calcServiceStats,
    calcBarberStats,
    getUniqueClients,
    paginate,
  };
})();
