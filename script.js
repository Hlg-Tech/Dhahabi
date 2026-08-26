// Data del buscador de la landing
const servicesData = [
    { name: "Dhahabi Market — Tienda Web", tag: "E-Commerce", action: "Dhahabi Market Web" },
    { name: "Dhahabi Market — Descargar App", tag: "Mobile App", action: "Descargar App" },
    { name: "Dhahabi Agency — Consultoría y Servicios", tag: "Agencia", action: "Dhahabi Agency" },
    { name: "Dhahabi Shehena — Logística y Carga", tag: "Carga / Envíos", action: "Dhahabi Shehena" }
];

const serviceLinks = {
    'Dhahabi Market Web': 'https://dhahabi.ae', 
    'Sitio de Descarga App': 'https://downloads.dhahabi.ae', 
    'Dhahabi Agency': 'https://www.dhahabiagency.com/',             
    'Dhahabi Shehena': 'https://shehena.dhahabi.ae'           
};

// Filtro en tiempo real para el buscador
function filterSuggestions(query) {
    const box = document.getElementById("suggestions-box");
    if (!query || query.trim() === "") {
        box.classList.add("hidden");
        box.innerHTML = "";
        return;
    }

    const filtered = servicesData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.tag.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        box.innerHTML = `<div class="p-4 text-xs text-slate-400 text-center">No se encontraron servicios para "${query}"</div>`;
    } else {
        box.innerHTML = filtered.map(item => `
            <div onclick="accessService('${item.action}')" class="px-4 py-3 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition border-b border-slate-800 last:border-none">
                <span class="text-sm text-slate-200 font-medium">${item.name}</span>
                <span class="text-[10px] font-bold uppercase tracking-wider bg-dhahabi-purple/20 text-dhahabi-cyan px-2.5 py-1 rounded-md border border-dhahabi-purple/30">${item.tag}</span>
            </div>
        `).join("");
    }
    box.classList.remove("hidden");
}

function accessService(serviceName) {
    const targetUrl = serviceLinks[serviceName];

    if (targetUrl) {
        window.open(targetUrl, '_blank');
    } else {
        console.warn(`No se encontró una URL configurada para: ${serviceName}`);
    }
    const box = document.getElementById("suggestions-box");
    if (box) box.classList.add("hidden");
}

function toggleCustomDropdown(type) {
    const options = document.getElementById(`${type}-options`);
    const arrow = document.getElementById(`${type}-arrow`);
    
    if (options.classList.contains("hidden")) {
        options.classList.remove("hidden");
        if(arrow) arrow.style.transform = "rotate(180deg)";
    } else {
        options.classList.add("hidden");
        if(arrow) arrow.style.transform = "rotate(0deg)";
    }
}

// Selección de Idioma con restauración limpia para Español
function selectLanguageOption(langCode, labelText) {
    const selectedTextEl = document.getElementById("lang-selected-text");
    if (selectedTextEl) {
        selectedTextEl.innerText = labelText;
    }
    toggleCustomDropdown("lang");

    // Si el usuario selecciona Español, eliminamos la traducción y restauramos la página original
    if (langCode === 'es') {
        document.documentElement.dir = 'ltr';
        
        // Limpiamos la cookie de Google Translate
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${location.hostname}; path=/;`;
        
        // Recargamos la página para mostrar el HTML nativo intacto
        window.location.reload();
        return;
    }

    // Dirección del documento para Árabe (RTL)
    if (langCode === 'ar') {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }

    // Ejecutar traducción para otros idiomas (en, sw, ar)
    const translateCombo = document.querySelector('.goog-te-combo');
    if (translateCombo) {
        translateCombo.value = langCode;
        translateCombo.dispatchEvent(new Event('change'));
    } else {
        setTimeout(() => {
            const comboRetry = document.querySelector('.goog-te-combo');
            if (comboRetry) {
                comboRetry.value = langCode;
                comboRetry.dispatchEvent(new Event('change'));
            }
        }, 500);
    }
}

// Función para abrir/cerrar preguntas frecuentes
function toggleFaqElement(element) {
    const card = element.closest('.glass-card');
    if (!card) return;

    // Busca la respuesta por clase, sin importar si es <p>, <div>, etc.
    const ans = card.querySelector('.faq-answer');
    const icon = card.querySelector('.faq-icon');

    if (!ans || !icon) return;

    if (ans.classList.contains("hidden")) {
        ans.classList.remove("hidden");
        icon.innerText = "−";
    } else {
        ans.classList.add("hidden");
        icon.innerText = "+";
    }
}

function filterTestimonials(platform) {
    // 1. Remover la clase 'active' de todos los botones de pestañas
    const tabs = document.querySelectorAll('.testimonial-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // 2. Agregar la clase 'active' al botón que fue presionado
    const activeTab = document.getElementById(`tab-${platform}`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // 3. Filtrar las tarjetas de testimonios por plataforma
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach(card => {
        const cardPlatform = card.getAttribute('data-platform');
        
        if (platform === 'all' || cardPlatform === platform) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Abrir Modal con Animación Smooth
function openReviewModal() {
    const modal = document.getElementById('review-modal');
    const content = document.getElementById('review-modal-content');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }, 10);
    
    setRating(5); // Por defecto 5 estrellas
}

// Cerrar Modal con Animación Smooth
function closeReviewModal() {
    const modal = document.getElementById('review-modal');
    const content = document.getElementById('review-modal-content');
    
    modal.classList.add('opacity-0');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Lógica para Selección de Estrellas
function setRating(rating) {
    selectedRating = rating;
    document.getElementById('rev-stars').value = rating;
    updateStarUI(rating);
}

function hoverRating(rating) {
    updateStarUI(rating);
}

function resetHover() {
    updateStarUI(selectedRating);
}

function updateStarUI(rating) {
    const stars = document.querySelectorAll('.star-btn');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('text-slate-600');
            star.classList.add('text-amber-400');
        } else {
            star.classList.remove('text-amber-400');
            star.classList.add('text-slate-600');
        }
    });
}
// ==========================================
// Control del Selector de Plataforma Personalizado
// ==========================================

function selectPlatformOption(val, labelText) {
    // 1. Asignar el valor al input oculto para que el envío del formulario siga funcionando
    const hiddenInput = document.getElementById("rev-platform");
    if (hiddenInput) {
        hiddenInput.value = val;
    }

    // 2. Actualizar el texto visible del botón
    const selectedTextEl = document.getElementById("platform-selected-text");
    if (selectedTextEl) {
        selectedTextEl.innerText = labelText;
    }

    // 3. Cerrar el desplegable
    toggleCustomDropdown('platform');
}

// Función genérica para abrir/cerrar desplegables con rotación de flecha
function toggleCustomDropdown(type) {
    const options = document.getElementById(`${type}-options`);
    const arrow = document.getElementById(`${type}-arrow`);

    if (options) {
        const isHidden = options.classList.contains("hidden");
        
        // Cerrar otros dropdowns activos si existieran
        document.querySelectorAll('[id$="-options"]').forEach(el => el.classList.add("hidden"));
        document.querySelectorAll('[id$="-arrow"]').forEach(el => el.classList.remove("rotate-180"));

        if (isHidden) {
            options.classList.remove("hidden");
            if (arrow) arrow.classList.add("rotate-180");
        }
    }
}

// Cerrar desplegables si el usuario hace clic fuera de ellos
document.addEventListener("click", function (e) {
    const langDropdown = document.getElementById("custom-dropdown-lang");
    const platformDropdown = document.getElementById("custom-dropdown-platform");

    if (langDropdown && !langDropdown.contains(e.target)) {
        const langOpts = document.getElementById("lang-options");
        const langArrow = document.getElementById("lang-arrow");
        if (langOpts) langOpts.classList.add("hidden");
        if (langArrow) langArrow.classList.remove("rotate-180");
    }

    if (platformDropdown && !platformDropdown.contains(e.target)) {
        const platformOpts = document.getElementById("platform-options");
        const platformArrow = document.getElementById("platform-arrow");
        if (platformOpts) platformOpts.classList.add("hidden");
        if (platformArrow) platformArrow.classList.remove("rotate-180");
    }
});

// ==========================================
// Cargar Reseñas Dinámicas desde Google Sheets
// ==========================================

async function fetchReviews() {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxK0gIU_MUfdvRJDCuten7-OG7tD9QMUQsQiGflNO78-RVbgtRIEi_ctEzyNSlWy9bl/exec";

    try {
        const response = await fetch(APPS_SCRIPT_URL);
        const data = await response.json();

        if (data.success && data.reviews.length > 0) {
            // Recorrer y construir HTML para cada reseña traída del Sheet
            data.reviews.forEach(rev => {
                const card = createReviewCardHTML(rev);
                container.insertAdjacentHTML('afterbegin', card);
            });
        }
    } catch (err) {
        console.warn("No se pudieron cargar las reseñas dinámicas:", err);
    }
}

// Generador del HTML de cada Tarjeta con formato de la marca
function createReviewCardHTML(rev) {
    const starsHTML = '★'.repeat(rev.estrellas) + '☆'.repeat(5 - rev.estrellas);
    
    // Mapeo de estilos según la plataforma
    let badgeClass = "bg-dhahabi-cyan/10 text-dhahabi-cyan border-dhahabi-cyan/30";
    let platformLabel = "Dhahabi Market";
    
    if (rev.plataforma === 'agency') {
        badgeClass = "bg-dhahabi-purple/20 text-dhahabi-purple border-dhahabi-purple/30";
        platformLabel = "Dhahabi Agency";
    } else if (rev.plataforma === 'shehena') {
        badgeClass = "bg-teal-500/10 text-teal-400 border-teal-500/30";
        platformLabel = "Shehena Carga";
    }

    return `
        <div class="testimonial-card glass-card rounded-3xl p-6 flex flex-col justify-between transition-all duration-300" data-platform="${rev.plataforma}">
            <div>
                <div class="flex items-center justify-between mb-4">
                    <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${badgeClass}">${platformLabel}</span>
                    <span class="text-amber-400 text-xs">${starsHTML}</span>
                </div>
                <p class="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed mb-6">
                    "${rev.comentario}"
                </p>
            </div>
            <div class="border-t border-slate-200 dark:border-slate-800/80 pt-4">
                <span class="text-sm font-bold text-slate-900 dark:text-white block">${rev.usuario}</span>
                <span class="text-xs text-slate-500 dark:text-slate-400">Usuario Verificado</span>
            </div>
        </div>
    `;
}

// Ejecutar la carga automática de reseñas al abrir la web
document.addEventListener("DOMContentLoaded", fetchReviews);

function renderNewTestimonial(data) {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    // Configuración de badges y colores según la plataforma seleccionada
    const platformConfig = {
        market: { name: 'Dhahabi Market', badgeClass: 'bg-dhahabi-cyan/10 text-dhahabi-cyan border-dhahabi-cyan/30' },
        agency: { name: 'Dhahabi Agency', badgeClass: 'bg-dhahabi-purple/20 text-dhahabi-purple border-dhahabi-purple/30' },
        shehena: { name: 'Dhahabi Shehena', badgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30' }
    };

    const config = platformConfig[data.plataforma] || platformConfig.market;
    const starRating = '★'.repeat(parseInt(data.estrellas, 10) || 5);

    // Crear el elemento div de la nueva tarjeta
    const card = document.createElement('div');
    card.className = 'testimonial-card glass-card rounded-3xl p-6 flex flex-col justify-between shrink-0 snap-start animate-fade-in';
    card.setAttribute('data-platform', data.plataforma);

    card.innerHTML = `
        <div>
            <div class="flex items-center justify-between mb-4">
                <span class="text-[10px] font-bold uppercase tracking-wider ${config.badgeClass} px-2.5 py-1 rounded-md border">
                    ${config.name}
                </span>
                <span class="text-amber-400 text-xs">${starRating}</span>
            </div>
            <p class="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed mb-6">
                "${data.comentario}"
            </p>
        </div>
        <div class="border-t border-slate-200 dark:border-slate-800/80 pt-4">
            <span class="text-sm font-bold text-slate-900 dark:text-white block">${data.usuario}</span>
            <span class="text-xs text-slate-500 dark:text-slate-400">Cliente Verificado</span>
        </div>
    `;

    // Insertar la tarjeta al inicio del carrusel
    container.prepend(card);

    // Desplazar automáticamente el carrusel a la primera posición para ver la nueva reseña
    container.scrollTo({ left: 0, behavior: 'smooth' });
}

async function submitReview(e) {
    e.preventDefault();
    
    const btn = document.getElementById('btn-submit-review');
    const originalBtnText = btn.innerText;

    showReviewLoader();
    btn.disabled = true;

    const reviewData = {
        usuario: document.getElementById('rev-user').value.trim(),
        plataforma: document.getElementById('rev-platform').value,
        estrellas: document.getElementById('rev-stars').value,
        comentario: document.getElementById('rev-comment').value.trim()
    };

    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxK0gIU_MUfdvRJDCuten7-OG7tD9QMUQsQiGflNO78-RVbgtRIEi_ctEzyNSlWy9bl/exec";

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(reviewData)
        });

        const result = await response.json();
        hideReviewLoader();

        if (result.success) {
            if (typeof closeReviewModal === 'function') closeReviewModal();
            document.getElementById('review-form').reset();

            // 1. INYECTAR LA NUEVA RESEÑA EN TIEMPO REAL AL CARRUSEL
            renderNewTestimonial(reviewData);

            // 2. MOSTRAR ALERTA CUSTOM DE ÉXITO
            showCustomAlert(
                "¡Reseña Registrada!", 
                "Tu experiencia ha sido verificada y agregada con éxito.", 
                "success"
            );
        } else {
            showCustomAlert(
                "Verificación Fallida", 
                result.message || "El usuario/correo ingresado no se encuentra registrado en nuestra base de datos.", 
                "error"
            );
        }
    } catch (err) {
        hideReviewLoader();
        showCustomAlert(
            "Error de Conexión", 
            "Ocurrió un problema al conectar con el servidor. Por favor, inténtalo más tarde.", 
            "error"
        );
    } finally {
        btn.disabled = false;
        btn.innerText = originalBtnText;
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.documentElement.classList.remove('dark');
        updateThemeIcons(false);
    } else {
        document.documentElement.classList.add('dark');
        updateThemeIcons(true);
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcons(isDark);
}

function updateThemeIcons(isDark) {
    const sunIcon = document.getElementById('theme-sun');
    const moonIcon = document.getElementById('theme-moon');

    if (isDark) {
        sunIcon?.classList.add('hidden');
        moonIcon?.classList.remove('hidden');
    } else {
        sunIcon?.classList.remove('hidden');
        moonIcon?.classList.add('hidden');
    }
}

function scrollTestimonials(direction) {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    // Buscar únicamente las tarjetas que no estén ocultas
    const visibleCards = Array.from(container.querySelectorAll('.testimonial-card')).filter(card => {
        return card.offsetWidth > 0 || card.style.display !== 'none' && !card.classList.contains('hidden');
    });

    // Si hay tarjetas visibles, calcular el ancho real de la primera visible
    let scrollAmount = 350; // Valor por defecto en px
    
    if (visibleCards.length > 0) {
        const card = visibleCards[0];
        // Medimos el offsetWidth real o el boundingClientRect para mayor precisión
        const cardWidth = card.getBoundingClientRect().width || card.offsetWidth;
        scrollAmount = cardWidth + 24; // 24px corresponde al gap-6 de Tailwind
    }

    // Ejecutar el desplazamiento
    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else if (direction === 'right') {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Mostrar y ocultar Loader
// Activar y desactivar el loader modal
function showReviewLoader() {
    const loader = document.getElementById('review-loader');
    if (loader) {
        loader.classList.remove('hidden');
        loader.classList.add('flex');
    }
}

function hideReviewLoader() {
    const loader = document.getElementById('review-loader');
    if (loader) {
        loader.classList.remove('flex');
        loader.classList.add('hidden');
    }
}

// Control de la notificación central
function showCustomAlert(title, message, type = 'success') {
    const alertModal = document.getElementById('custom-alert');
    const alertCard = document.getElementById('custom-alert-card');
    const iconContainer = document.getElementById('alert-icon-container');
    const alertTitle = document.getElementById('alert-title');
    const alertMessage = document.getElementById('alert-message');

    if (!alertModal) return;

    alertTitle.textContent = title;
    alertMessage.textContent = message;

    if (type === 'success') {
        iconContainer.className = "w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30";
        iconContainer.innerHTML = "&#10004;";
    } else {
        iconContainer.className = "w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30";
        iconContainer.innerHTML = "&#10007;";
    }

    alertModal.classList.remove('hidden');
    alertModal.classList.add('flex');
    
    setTimeout(() => {
        alertCard.classList.remove('scale-95', 'opacity-0');
        alertCard.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeCustomAlert() {
    const alertModal = document.getElementById('custom-alert');
    const alertCard = document.getElementById('custom-alert-card');

    if (!alertCard) return;

    alertCard.classList.remove('scale-100', 'opacity-100');
    alertCard.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        alertModal.classList.remove('flex');
        alertModal.classList.add('hidden');
    }, 200);
}

// Inicializar el tema al cargar el archivo JS
document.addEventListener('DOMContentLoaded', initTheme);
