// Función para realizar la transición hacia adelante
function navigateTo(url) {
    const transitionLayer = document.createElement('div');
    transitionLayer.classList.add('page-transition');
    document.body.appendChild(transitionLayer);

    setTimeout(() => {
        transitionLayer.classList.add('page-transition--active');
    }, 10);

    setTimeout(() => {
        window.location.href = url;
    }, 600);
}

// Interceptar clics en enlaces internos (excluyendo target=_blank, mailto, tel y anchors)
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const isInternal = link.href.includes(window.location.origin);
    const opensNewTab = link.target === '_blank';
    const isAnchor = link.hash && link.pathname === window.location.pathname;
    const isSpecialScheme = /^(mailto:|tel:|javascript:)/i.test(link.getAttribute('href') || '');

    if (isInternal && !opensNewTab && !isAnchor && !isSpecialScheme) {
        e.preventDefault();
        navigateTo(link.href);
    }
});

// Animación de salida al usar el botón "Atrás" del navegador.
// No llamamos a history.back() aquí: popstate ya implica que el navegador navegó.
window.addEventListener('popstate', () => {
    document.body.classList.add('page-exit');
});

// Indicador de dot activo según la card visible (solo home)
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".project-card");
    const dots = document.querySelectorAll(".dot");

    if (!cards.length || !dots.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = entry.target.getAttribute("data-index");
                dots.forEach(d => d.classList.remove('active'));
                if (dots[index]) {
                    dots[index].classList.add('active');
                }
            }
        });
    }, { root: null, threshold: 0.5 });

    cards.forEach((card) => observer.observe(card));
});

// Toggle "Ver más / Ver menos" (solo página de archivo de proyectos)
document.addEventListener("DOMContentLoaded", () => {
    const btnVerMas = document.getElementById('btnVerMas');
    const proyectosOcultos = document.getElementById('proyectosOcultos');

    if (!btnVerMas || !proyectosOcultos) return;

    const textoBoton = btnVerMas.querySelector('.btn-fantasma__texto');

    btnVerMas.addEventListener('click', () => {
        proyectosOcultos.classList.toggle('is-active');

        if (textoBoton) {
            textoBoton.textContent = proyectosOcultos.classList.contains('is-active')
                ? 'VER MENOS'
                : 'VER MÁS';
        }
    });
});

// Reveal on scroll — aparición progresiva de secciones al entrar al viewport.
// Excluimos el hero (siempre visible) para evitar flash en el primer paint.
document.addEventListener("DOMContentLoaded", () => {
    if (!('IntersectionObserver' in window)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const targets = document.querySelectorAll(
        '.projects, .services, .about, .cta-final, ' +
        '.projects-archive, .projects-grid-section, .proyectos-extend, ' +
        '.project-header, .project-visuals, .project-case, .project-schedule, ' +
        '.feedback-link, .cta-project, ' +
        '.under-construction'
    );

    if (!targets.length) return;

    targets.forEach(el => el.classList.add('reveal-on-scroll'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
    });

    targets.forEach(el => observer.observe(el));
});

// Reveal direccional para las cards del process.
// La línea central y los nodos quedan siempre visibles; sólo las cards
// entran desde su lado correspondiente al cruzar el viewport.
document.addEventListener("DOMContentLoaded", () => {
    if (!('IntersectionObserver' in window)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const steps = document.querySelectorAll('.process-step');
    if (!steps.length) return;

    const isMobile = window.matchMedia('(max-width: 500px)').matches;

    const cards = [];
    steps.forEach((step, idx) => {
        const card = step.querySelector('.process-step__card');
        if (!card) return;

        card.classList.add('reveal-step');

        // Mobile: todas entran desde la derecha (layout columna única).
        // Desktop/tablet: alternan según posición de la card en el grid.
        if (isMobile) {
            card.classList.add('reveal-step--right');
        } else {
            const isOdd = idx % 2 === 0; // idx 0 es el step 1 (visualmente impar → izquierda)
            card.classList.add(isOdd ? 'reveal-step--left' : 'reveal-step--right');
        }

        cards.push(card);
    });

    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                stepObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -8% 0px'
    });

    cards.forEach(card => stepObserver.observe(card));
});
