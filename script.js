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
