(() => {
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const nf = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

    const promoName = '2x1 (50% en la segunda unidad)'; // nombre visible
    const promoFactor = 0.5; // 50% de descuento en la 2da unidad

    const productsGrid = $('#promoProducts');
    const breakdownList = $('#breakdown');
    const subtotalEl = $('#subtotal');
    const discountEl = $('#discount');
    const totalEl = $('#total');
    const promoNameEl = $('#promoName');

    promoNameEl.textContent = promoName;

    function parsePrice(n) {
        const x = Number(n);
        return Number.isFinite(x) ? x : 0;
    }

    /**
     * Regla: por cada par, 1 unidad tiene 50% off.
     * discountUnits = floor(q / 2)
     * discount = discountUnits * (unitPrice * promoFactor)
     */
    function computeLine(price, qty) {
        const unit = parsePrice(price);
        const q = Math.max(0, Math.floor(qty || 0));
        const lineSubtotal = unit * q;
        const discountedUnits = Math.floor(q / 2);
        const lineDiscount = discountedUnits * unit * promoFactor;
        const lineTotal = lineSubtotal - lineDiscount;
        return { q, unit, lineSubtotal, lineDiscount, lineTotal, discountedUnits };
    }

    function recalc() {
        let subtotal = 0;
        let discount = 0;

        // limpiar desglose
        breakdownList.innerHTML = '';

        const items = $$('.product-card', productsGrid);

        items.forEach(card => {
            const name = card.dataset.name || 'Producto';
            const unitPrice = parsePrice(card.dataset.price);
            const qtyInput = $('.qty-input', card);
            const qty = Math.max(0, Math.floor((qtyInput?.value || '0'), 10));

            const { q, unit, lineSubtotal, lineDiscount, lineTotal, discountedUnits } = computeLine(unitPrice, qty);

            if (q > 0) {
                subtotal += lineSubtotal;
                discount += lineDiscount;

                // fila de desglose
                const li = document.createElement('li');
                li.className = 'services-list__item';
                li.innerHTML = `
          <h4 class="services-list__title">${name}</h4>
          <p class="services-list__desc">
            Cant: <strong>${q}</strong> · Precio unitario: <strong>${nf.format(unit)}</strong><br>
            Unidades con 50% OFF: <strong>${discountedUnits}</strong> · Desc: <strong>-${nf.format(lineDiscount)}</strong><br>
            Total ítem: <strong>${nf.format(lineTotal)}</strong>
          </p>
        `;
                breakdownList.appendChild(li);
            }
        });

        const total = Math.max(0, subtotal - discount);

        subtotalEl.textContent = nf.format(subtotal);
        discountEl.textContent = `-${nf.format(discount)}`;
        totalEl.textContent = nf.format(total);
    }

    // Listeners en todos los inputs de cantidad
    $$('.qty-input', productsGrid).forEach(input => {
        input.addEventListener('input', recalc);
        input.addEventListener('change', recalc);
    });

    // Primera corrida
    recalc();
})();
