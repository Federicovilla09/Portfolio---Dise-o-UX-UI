// Función para realizar la transición hacia adelante
function navigateTo(url) {
    // Creamos un overlay o usamos el contenedor de la nueva página
    const transitionLayer = document.createElement('div');
    transitionLayer.classList.add('page-transition');
    document.body.appendChild(transitionLayer);

    // Pequeño delay para que el navegador registre el estado inicial antes de animar
    setTimeout(() => {
        transitionLayer.classList.add('page-transition--active');
    }, 10);

    // Esperamos a que termine la animación para cambiar de URL
    setTimeout(() => {
        window.location.href = url;
    }, 600);
}

// Interceptar clics en enlaces internos
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href.includes(window.location.origin) && !link.hash) {
        e.preventDefault();
        navigateTo(link.href);
    }
});

// Manejar el botón "Atrás" del navegador
window.addEventListener('popstate', () => {
    // Aquí podemos aplicar una animación de salida a la página actual
    document.body.classList.add('page-exit');
    
    // Dejamos que el navegador haga el back después de la animación
    setTimeout(() => {
        history.back();
    }, 600);
});

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".project-card");
    const dots = document.querySelectorAll(".dot");
    const track = document.querySelector(".dot.active");

    const observerOptions = {
        root: null, // Usamos la ventana completa
        threshold: 0.5 // 50% de visibilidad
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // --- AQUÍ ESTÁ EL TRUCO PARA DEBUGEAR ---
            console.log(`Card ${entry.target.getAttribute('data-index')} visible:`, entry.isIntersecting, entry.intersectionRatio);
            
            if (entry.isIntersecting) {
                const index = entry.target.getAttribute("data-index");
                dots.forEach(d => d.classList.remove('active'));
                if(dots[index]) {
                    dots[index].classList.add('active');
                }
            }
        });
    }, observerOptions);

    cards.forEach((card) => observer.observe(card));
});