/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close");

/* Menu show */
navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
});

/* Menu hidden */
navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
});

// Toggle simple para filtros visuales
const filterBtns = document.querySelectorAll('.products-filters__btn');
const items = document.querySelectorAll('.product-grid--catalog .product-card');

filterBtns.forEach(btn => btn.addEventListener('click', () => {
    const cat = btn.getAttribute('data-filter');
    filterBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    items.forEach(it => {
        if (cat === '*' || it.dataset.category === cat) {
            it.style.display = '';
        } else {
            it.style.display = 'none';
        }
    });
}));

// Detecta el scroll y agrega/remueve la clase
window.addEventListener("scroll", function () {
    const header = document.getElementById("header");
    if (window.scrollY > 10) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});
