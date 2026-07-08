/* ==========================================================================
   PROJECTS.JS — Datos de proyectos y renderizado dinámico con filtro
   ========================================================================== */

(function () {
  'use strict';

  // ── Datos de proyectos ────────────────────────────────────────
  // Reemplaza estos datos con tus proyectos reales
  const projects = [
    {
      title: 'LlIlyAi — Asistente de IA Conversacional',
      description: 'Asistente virtual con IA que responde consultas en lenguaje natural, aprende del contexto y se integra con múltiples plataformas. Construido con TypeScript y OpenAI.',
      image: 'assets/images/project-lillyai.png',
      tags: ['TypeScript', 'OpenAI', 'Node.js', 'IA'],
      category: 'ia',
      demo: 'https://lillyai.deyvidev.com',
      code: 'https://github.com/Deyvidelacruz44/LlIlyAi'
    },
    {
      title: 'NexolA — Plataforma de Automatización IA',
      description: 'Plataforma inteligente que combina automatizaciones con IA para optimizar flujos de trabajo empresariales. Reduce tareas repetitivas y toma decisiones automáticas.',
      image: 'assets/images/project-nexola.png',
      tags: ['TypeScript', 'OpenAI', 'React', 'PostgreSQL'],
      category: 'ia',
      demo: 'https://nexoai.deyvidev.com',
      code: 'https://github.com/Deyvidelacruz44/NexolA'
    },
    {
      title: 'VirálTox — Generador de Contenido con IA',
      description: 'Plataforma web que genera contenido viral optimizado para SEO usando modelos de lenguaje avanzados. Automatiza la creación de artículos y publicaciones.',
      image: 'assets/images/project-viraltox.png',
      tags: ['TypeScript', 'OpenAI', 'Next.js', 'SEO'],
      category: 'ia',
      demo: 'https://viraltox.com',
      code: 'https://github.com/Deyvidelacruz44/autoblog'
    },
    {
      title: 'CampañaPro — Automatización WhatsApp Política',
      description: 'Sistema de automatización de mensajes masivos por WhatsApp para campañas políticas. Gestión de contactos, segmentación y análisis de respuestas.',
      image: 'assets/images/project-campanapro.png',
      tags: ['JavaScript', 'WhatsApp API', 'n8n', 'Node.js'],
      category: 'automatizacion',
      demo: 'https://chatpolitico.vercel.app/',
      code: 'https://github.com/Deyvidelacruz44/chatpolitico'
    }
  ];

  // ── Categorías de filtro ──────────────────────────────────────
  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'ia', label: 'IA' },
    { id: 'automatizacion', label: 'Automatización' }
  ];

  let activeFilter = 'todos';

  // ── Render Filters ────────────────────────────────────────────
  const filtersContainer = document.getElementById('projectFilters');

  function renderFilters() {
    if (!filtersContainer) return;

    filtersContainer.innerHTML = categories.map(cat =>
      '<button class="filter-btn' + (cat.id === activeFilter ? ' active' : '') + '" data-filter="' + cat.id + '">' +
        cat.label +
      '</button>'
    ).join('');

    // Add click handlers
    filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.getAttribute('data-filter');
        renderFilters();
        renderProjects();
      });
    });
  }

  // ── Render Projects ───────────────────────────────────────────
  const projectsGrid = document.getElementById('projectsGrid');

  function renderProjects() {
    if (!projectsGrid) return;

    const filtered = activeFilter === 'todos'
      ? projects
      : projects.filter(p => p.category === activeFilter);

    projectsGrid.innerHTML = filtered.map(project => {
      const tagsHtml = project.tags.map(tag =>
        '<span class="project-card__tag">' + escapeHtml(tag) + '</span>'
      ).join('');

      const isEnDesarrollo = project.status === 'en-desarrollo';

      return (
        '<div class="project-card reveal-scale' + (isEnDesarrollo ? ' project-card--wip' : '') + '">' +
          '<div class="project-card__image">' +
            '<img src="' + escapeAttr(project.image) + '" alt="' + escapeAttr(project.title) + '" loading="lazy">' +
            (isEnDesarrollo ? '<div class="project-card__wip-badge">🚧 En desarrollo</div>' : '') +
            '<div class="project-card__overlay">' +
              (project.demo ? '<a href="' + escapeAttr(project.demo) + '" target="_blank" rel="noopener noreferrer" class="btn btn--sm btn--primary">Demo en vivo</a>' : '') +
              (project.code ? '<a href="' + escapeAttr(project.code) + '" target="_blank" rel="noopener noreferrer" class="btn btn--sm btn--secondary">Ver código</a>' : '') +
            '</div>' +
          '</div>' +
          '<div class="project-card__body">' +
            '<h3 class="project-card__title">' + escapeHtml(project.title) + '</h3>' +
            '<p class="project-card__description">' + escapeHtml(project.description) + '</p>' +
            '<div class="project-card__tags">' + tagsHtml + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    // Re-observe new elements for scroll animations
    if (typeof window.observeNewElements === 'function') {
      window.observeNewElements();
    }
  }

  // ── HTML Escaping (security) ──────────────────────────────────
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  function escapeAttr(text) {
    return text.replace(/&/g, '&amp;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#39;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');
  }

  // ── Initialize ────────────────────────────────────────────────
  renderFilters();
  renderProjects();

})();
