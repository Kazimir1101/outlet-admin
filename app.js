$(document).ready(function () {

    /* =====================================================
       MOCK DATA — заменится ответом с бэкенда
    ===================================================== */

    // TODO: backend — GET /api/admin/pending
    let pendingAds = [
        {
            id: 1,
            title: 'Nike Precision 8 Midnight XXXL',
            description: 'Yeni və keyfiyyətli idman ayaqqabısı. Ölçü: 42. Rəng: qara/ağ.',
            oldPrice: '150 ₼',
            newPrice: '110 ₼',
            city: 'Qusar',
            shop: 'Nike Store',
            address: 'H. Əliyev küç, Bina 7, mərtəbə 5',
            phone: '070 666 55 44',
            category: 'Ayaqqabı',
            date: '12.10.2026',
            images: [
                'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,c_scale,w_300,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/3a9956db-f7b5-4f2f-a92c-7f3c6905d6a0/NIKE+PRECISION+8+MID.png',
                'https://nikefans.ru/wp-content/uploads/2022/11/nike-dunk.jpg',
                'https://cdn5.focus.bg/bazar/22/pics/22003d9483cec10f23972e83c3a0a95b.webp'
            ]
        },
        {
            id: 2,
            title: 'Apple Watch Series 9',
            description: 'Az istifadə olunub, tam işlək vəziyyətdədir. Qutusu və şarjı var.',
            oldPrice: '50 ₼',
            newPrice: '10 ₼',
            city: 'Xaçmaz',
            shop: 'Smart Store',
            address: 'Nizami küçəsi 15',
            phone: '051 333 44 55',
            category: 'Elektronika',
            date: '11.10.2026',
            images: [
                'https://www.apple.com/newsroom/images/2023/09/apple-introduces-the-advanced-new-apple-watch-series-9/article/Apple-Watch-S9-gold-stainless-steel-Sport-Band-purple-230912_inline.jpg.large_2x.jpg'
            ]
        },
        {
            id: 3,
            title: 'Hədiyyə qutusu',
            description: 'Zərif dizaynlı, premium hədiyyə qutusu. İçi boşdur.',
            oldPrice: '250 ₼',
            newPrice: '110 ₼',
            city: 'Şabran',
            shop: 'Gift House',
            address: 'Mərkəzi küçə 21',
            phone: '070 555 66 77',
            category: 'Digər',
            date: '11.10.2026',
            images: [
                'https://img.freepik.com/premium-photo/gift-box-designs-stylish-unique-packaging-memorable-gifts_1276622-4131.jpg?w=996'
            ]
        }
    ];


    // TODO: backend — GET /api/admin/ads-slots
    let adSlots = [
        { id: 1, image: 'https://cdn.globalinfo.az/2026/02/kv-1200x800-1.jpg', url: 'https://example.com/promo-1' },
        { id: 2, image: 'https://cdn.globalinfo.az/2026/02/kv-1200x800-1.jpg', url: '' },
        { id: 3, image: 'https://cdn.globalinfo.az/2026/02/kv-1200x800-1.jpg', url: '' },
        { id: 4, image: 'https://cdn.globalinfo.az/2026/02/kv-1200x800-1.jpg', url: '' },
        { id: 5, image: 'https://cdn.globalinfo.az/2026/02/kv-1200x800-1.jpg', url: '' }
    ];


    // TODO: backend — GET /api/admin/stats
    let cityStats = {
        'Hamisi':   { time: 12, active: 45 },
        'Baki':     { time: 212345, active: 25445 },
        'Sumgayit': { time: 8,  active: 32 },
        'Quba':     { time: 5,  active: 18 },
        'Qusar':    { time: 3,  active: 12 },
        'Xacmaz':   { time: 6,  active: 21 }
    };


    /* =====================================================
       HELPERS
    ===================================================== */

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }


    function calcDiscount(oldPrice, newPrice) {
        const oldNum = parseFloat(String(oldPrice).replace(/[^\d.]/g, ''));
        const newNum = parseFloat(String(newPrice).replace(/[^\d.]/g, ''));

        if (!oldNum || !newNum || newNum >= oldNum) return '';

        const pct = Math.round(((oldNum - newNum) / oldNum) * 100);

        return '-' + pct + '%';
    }


    /* =====================================================
       STATS
    ===================================================== */

    function renderStats() {
        $('.stat-card').each(function () {

            const city = $(this).data('city');
            const stats = cityStats[city] || { time: 0, active: 0 };

            $(this).find('.stat-time-value').text(stats.time);
            $(this).find('.stat-active-value').text(stats.active);

        });

        updateStatsFade();
    }


    function updateStatsFade() {
        const $track = $('#statsTrack');
        const el = $track[0];

        if (!el) return;

        const scrollLeft = el.scrollLeft;
        const maxScroll = el.scrollWidth - el.clientWidth;

        const $box = $('.admin-stats');

        $box.toggleClass('can-scroll-left', scrollLeft > 4);
        $box.toggleClass('can-scroll-right', scrollLeft < maxScroll - 4);
    }


    $('#statsTrack').on('scroll', updateStatsFade);

    $(window).on('resize', updateStatsFade);


    /* =====================================================
       PENDING ADS — RENDER
    ===================================================== */

    function renderPending() {

        const $list = $('#pendingList');
        const $empty = $('#emptyState');

        $list.empty();

        if (!pendingAds.length) {
            $empty.show();
            $('#pendingCount').text('0');

            return;
        }

        $empty.hide();

        $('#pendingCount').text(pendingAds.length);


        pendingAds.forEach(function (ad) {

            const discount = calcDiscount(ad.oldPrice, ad.newPrice);

            let imagesHtml = '';
            ad.images.forEach(function (img) {
                imagesHtml += `
                    <div class="pending-image">
                        <img src="${escapeHtml(img)}" alt="">
                    </div>
                `;
            });

            const html = `
                <article class="pending-card" data-id="${ad.id}">

                    <div class="pending-head">
                        <h3 class="pending-title">${escapeHtml(ad.title)}</h3>
                    </div>

                    <div class="pending-body">

                        <div class="pending-info">
                            <div class="pending-field">
                                <span>Kateqoriya</span>
                                <strong>${escapeHtml(ad.category)}</strong>
                            </div>
                            <div class="pending-field">
                                <span>Şəhər</span>
                                <strong>${escapeHtml(ad.city)}</strong>
                            </div>
                            <div class="pending-field">
                                <span>Mağaza</span>
                                <strong>${escapeHtml(ad.shop)}</strong>
                            </div>
                            <div class="pending-field">
                                <span>Telefon</span>
                                <strong>${escapeHtml(ad.phone)}</strong>
                            </div>
                        </div>

                        <div class="pending-description">${escapeHtml(ad.description)}</div>

                        <div class="pending-prices">
                            <span class="price-old">${escapeHtml(ad.oldPrice)}</span>
                            <strong class="price-new">${escapeHtml(ad.newPrice)}</strong>
                            ${discount ? `<span class="price-discount-badge">${discount}</span>` : ''}
                        </div>

                        <div class="pending-images">
                            ${imagesHtml}
                        </div>

                    </div>

                    <div class="pending-meta">
                        <span class="pending-meta-item">
                            <i class="fa-solid fa-location-dot"></i>
                            <strong>${escapeHtml(ad.address)}</strong>
                        </span>
                        <span class="pending-meta-item">
                            <i class="fa-regular fa-calendar"></i>
                            <strong>${escapeHtml(ad.date)}</strong>
                        </span>
                    </div>

                    <div class="pending-actions">
                        <button type="button"
                                class="action-btn approve-btn"
                                data-action="approve"
                                data-id="${ad.id}">
                            <i class="fa-solid fa-check"></i>
                            <span>Təsdiqlə</span>
                        </button>

                        <button type="button"
                                class="action-btn delete-btn"
                                data-action="delete"
                                data-id="${ad.id}">
                            <i class="fa-solid fa-trash"></i>
                            <span>Sil</span>
                        </button>
                    </div>

                </article>
            `;

            $list.append(html);

        });

        toggleApproveAllBtn();
    }


    function toggleApproveAllBtn() {
        $('#approveAllBtn').prop('disabled', pendingAds.length === 0);
    }


    /* =====================================================
       PENDING ADS — ACTIONS (delegated)
    ===================================================== */

    $('#pendingList').on('click', '[data-action]', function () {

        const action = $(this).data('action');
        const id = $(this).data('id');

        const ad = pendingAds.find(function (item) { return item.id === id; });
        if (!ad) return;

        if (action === 'approve') {
            openConfirm({
                title: 'Elanı təsdiqlə?',
                text: `"${ad.title}" təsdiqlənsin və dərc olunsun?`,
                icon: 'success',
                okText: 'Təsdiqlə',
                onConfirm: function () { approveAd(id); }
            });
        }

        if (action === 'delete') {
            openConfirm({
                title: 'Elanı sil?',
                text: `"${ad.title}" bazadan tam silinsin? Bu geri qaytarıla bilməz.`,
                icon: 'danger',
                okText: 'Sil',
                danger: true,
                onConfirm: function () { deleteAd(id); }
            });
        }

    });


    /* =====================================================
       APPROVE
    ===================================================== */

    function approveAd(id) {

        // TODO: backend — POST /api/admin/ads/{id}/approve
        console.log('APPROVE →', id);

        // Убираем карточку с анимацией
        removeCardFromList(id, function () {
            pendingAds = pendingAds.filter(function (a) { return a.id !== id; });
            renderPending();
        });

        // Обновляем статистику (пример)
        bumpCityStat('Qusar', 'active');

        showToast('Elan təsdiqləndi', 'success', 'fa-check');
    }


    /* =====================================================
       DELETE
    ===================================================== */

    function deleteAd(id) {

        // TODO: backend — DELETE /api/admin/ads/{id}
        console.log('DELETE →', id);

        removeCardFromList(id, function () {
            pendingAds = pendingAds.filter(function (a) { return a.id !== id; });
            renderPending();
        });

        showToast('Elan silindi', 'danger', 'fa-trash');
    }


    function removeCardFromList(id, done) {
        const $card = $('.pending-card[data-id="' + id + '"]');

        if (!$card.length) {
            done && done();
            return;
        }

        $card.addClass('removing');

        setTimeout(function () {
            $card.remove();
            done && done();
        }, 260);
    }


    /* =====================================================
       APPROVE ALL
    ===================================================== */

    $('#approveAllBtn').on('click', function () {

        if (!pendingAds.length) return;

        openConfirm({
            title: 'Hamısını təsdiqlə?',
            text: `${pendingAds.length} elan təsdiqlənsin və dərc olunsun?`,
            icon: 'success',
            okText: 'Hamısını təsdiqlə',
            onConfirm: function () {

                // TODO: backend — POST /api/admin/ads/approve-all
                console.log('APPROVE ALL');

                const all = pendingAds.slice();

                all.forEach(function (ad, i) {
                    setTimeout(function () {
                        removeCardFromList(ad.id, function () {
                            if (i === all.length - 1) {
                                pendingAds = [];
                                renderPending();
                            }
                        });
                    }, i * 60);
                });

                showToast(all.length + ' elan təsdiqləndi', 'success', 'fa-check-double');
            }
        });

    });


    /* =====================================================
       MOCK: bump a city stat
    ===================================================== */

    function bumpCityStat(city, field) {
        if (!cityStats[city]) cityStats[city] = { time: 0, active: 0 };

        if (field === 'active') {
            cityStats[city].active += 1;
            if (cityStats[city].time > 0) cityStats[city].time -= 1;
        }

        if (field === 'time') {
            cityStats[city].time += 1;
        }

        renderStats();
    }


    /* =====================================================
       ADS MANAGEMENT — RENDER
    ===================================================== */

    function renderAdSlots() {

        const $grid = $('#adsManageGrid');
        $grid.empty();


        adSlots.forEach(function (slot, index) {

            const html = `
                <div class="ad-manage-card" data-slot="${slot.id}">

                    <div class="ad-manage-header">
                        <div class="ad-manage-title">
                            <span class="ad-manage-index">${index + 1}</span>
                            Reklam
                        </div>
                    </div>

                    <div class="ad-manage-preview">
                        <img src="${escapeHtml(slot.image)}" alt="Ad ${index + 1}">
                    </div>

                    <div class="ad-manage-body">

                        <label class="ad-file-wrap">
                            <input type="file"
                                   class="ad-file-input"
                                   accept="image/*"
                                   data-slot="${slot.id}">
                            <div class="ad-file-btn">
                                <i class="fa-solid fa-image"></i>
                                <span>Şəkil seç</span>
                            </div>
                            <span class="ad-file-name">Fayl seçilməyib</span>
                        </label>

                        <div class="ad-url-wrap">
                            <input type="url"
                                   class="ad-url-input"
                                   data-slot="${slot.id}"
                                   placeholder="https://reklamverən.com"
                                   value="${escapeHtml(slot.url)}">
                            <button type="button"
                                    class="ad-url-clear"
                                    data-slot="${slot.id}"
                                    title="Təmizlə">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <button type="button"
                                class="ad-save-btn"
                                data-slot="${slot.id}">
                            <i class="fa-solid fa-floppy-disk"></i>
                            <span>Yadda saxla</span>
                        </button>

                    </div>

                </div>
            `;

            $grid.append(html);

        });

    }


    /* =====================================================
       ADS MANAGEMENT — FILE INPUT (preview)
    ===================================================== */

    $(document).on('change', '.ad-file-input', function () {

        const input = this;
        const slotId = $(this).data('slot');
        const file = input.files && input.files[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Yalnız şəkil faylları', 'danger', 'fa-triangle-exclamation');
            input.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            const $card = $('.ad-manage-card[data-slot="' + slotId + '"]');

            // превью
            $card.find('.ad-manage-preview img').attr('src', e.target.result);

            // имя файла
            $card.find('.ad-file-name').text(file.name);

            // TODO: backend — отправить файл на /api/admin/ads/{slotId}/image
        };

        reader.readAsDataURL(file);

    });


    /* =====================================================
       ADS MANAGEMENT — URL CLEAR
    ===================================================== */

    $(document).on('click', '.ad-url-clear', function () {

        const slotId = $(this).data('slot');

        $('.ad-url-input[data-slot="' + slotId + '"]')
            .val('')
            .trigger('focus');

    });


    /* =====================================================
       ADS MANAGEMENT — SAVE
    ===================================================== */

    $(document).on('click', '.ad-save-btn', function () {

        const slotId = $(this).data('slot');

        const $card = $('.ad-manage-card[data-slot="' + slotId + '"]');
        const url = $card.find('.ad-url-input').val().trim();
        const newImageSrc = $card.find('.ad-manage-preview img').attr('src');

        // простая валидация URL
        if (url && !/^https?:\/\/.+/i.test(url)) {
            showToast('URL "http://" və ya "https://" ilə başlamalıdır', 'danger', 'fa-triangle-exclamation');
            return;
        }

        // TODO: backend — POST /api/admin/ads/{slotId}
        // FormData с файлом + url, сохранить в БД.

        const slot = adSlots.find(function (s) { return s.id === slotId; });
        if (slot) {
            slot.url = url;
            slot.image = newImageSrc;
        }

        showToast('Reklam yadda saxlanıldı', 'success', 'fa-check');

    });


    /* =====================================================
       CONFIRM MODAL
    ===================================================== */

    let confirmCallback = null;

    function openConfirm(opts) {

        const $modal = $('#confirmModal');

        $('#confirmTitle').text(opts.title || 'Əminsiniz?');
        $('#confirmText').text(opts.text || '');
        $('#confirmOk').text(opts.okText || 'Təsdiqlə');

        const $icon = $('#confirmIcon');
        $icon.removeClass('danger success');

        if (opts.icon === 'danger')  $icon.addClass('danger').html('<i class="fa-solid fa-trash"></i>');
        if (opts.icon === 'success') $icon.addClass('success').html('<i class="fa-solid fa-check"></i>');
        if (!opts.icon)              $icon.html('<i class="fa-solid fa-question"></i>');

        const $ok = $('#confirmOk');
        $ok.toggleClass('danger', !!opts.danger);

        confirmCallback = opts.onConfirm || null;

        $modal.addClass('active');
        $('body').addClass('modal-open');
    }


    function closeConfirm() {
        $('#confirmModal').removeClass('active');
        $('body').removeClass('modal-open');
        confirmCallback = null;
    }


    $('#confirmOk').on('click', function () {

        const cb = confirmCallback;

        closeConfirm();

        if (cb) cb();

    });


    $(document).on('click', '[data-confirm-close]', function () {
        closeConfirm();
    });


    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $('#confirmModal').hasClass('active')) {
            closeConfirm();
        }
    });


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message, type, icon) {

        const $toast = $('<div>')
            .addClass('toast')
            .addClass('toast-' + (type || 'info'))
            .html(`<i class="fa-solid ${icon || 'fa-circle-info'}"></i><span>${escapeHtml(message)}</span>`);

        $('#toastContainer').append($toast);

        setTimeout(function () {
            $toast.addClass('hide');

            setTimeout(function () {
                $toast.remove();
            }, 260);

        }, 2200);
    }


    /* =====================================================
       INIT
    ===================================================== */

    renderStats();

    renderPending();

    renderAdSlots();

    // пересчитать fade после рендера
    setTimeout(updateStatsFade, 50);

});
