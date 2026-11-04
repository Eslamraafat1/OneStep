/**
 * Premium Filter System Logic (Improved)
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Dropdown Logic ---
    const filterDropdowns = document.querySelectorAll('.filter-dropdown');
    
    filterDropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.filter-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close other menus
            filterDropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                    d.querySelector('.filter-dropdown-menu').classList.remove('active');
                }
            });

            const menu = dropdown.querySelector('.filter-dropdown-menu');
            dropdown.classList.toggle('active');
            menu.classList.toggle('active');
        });
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-dropdown')) {
            filterDropdowns.forEach(d => {
                d.classList.remove('active');
                d.querySelector('.filter-dropdown-menu').classList.remove('active');
            });
        }
    });

    // --- Range Slider Logic ---
    function setupRangeSlider(sliderId, minInputId, maxInputId, valDisplayId, minVal, maxVal) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const handleMin = slider.querySelector('.handle-min');
        const handleMax = slider.querySelector('.handle-max');
        const track = slider.querySelector('.slider-track');
        const display = document.getElementById(valDisplayId);
        const inputMin = document.getElementById(minInputId);
        const inputMax = document.getElementById(maxInputId);

        let currentMin = parseInt(inputMin.value);
        let currentMax = parseInt(inputMax.value);

        function updateSlider() {
            const range = maxVal - minVal;
            const leftPercent = ((currentMin - minVal) / range) * 100;
            const rightPercent = ((currentMax - minVal) / range) * 100;

            handleMin.style.left = `${leftPercent}%`;
            handleMax.style.left = `${rightPercent}%`;
            track.style.left = `${leftPercent}%`;
            track.style.width = `${rightPercent - leftPercent}%`;
            
            display.textContent = `${currentMin} - ${currentMax}`;
            inputMin.value = currentMin;
            inputMax.value = currentMax;
        }

        function onMouseMove(e, handleType) {
            const rect = slider.getBoundingClientRect();
            let percent = ((e.clientX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            
            let val = Math.round(minVal + (percent / 100) * (maxVal - minVal));

            if (handleType === 'min') {
                currentMin = Math.min(val, currentMax - 10); // buffer of 10
            } else {
                currentMax = Math.max(val, currentMin + 10);
            }
            updateSlider();
        }

        const addHandleListeners = (handle, type) => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const moveHandler = (moveEvent) => onMouseMove(moveEvent, type);
                const upHandler = () => {
                    document.removeEventListener('mousemove', moveHandler);
                    document.removeEventListener('mouseup', upHandler);
                };
                document.addEventListener('mousemove', moveHandler);
                document.addEventListener('mouseup', upHandler);
            });
            
            // Touch support
            handle.addEventListener('touchstart', (e) => {
                const moveHandler = (moveEvent) => onMouseMove(moveEvent.touches[0], type);
                const upHandler = () => {
                    document.removeEventListener('touchmove', moveHandler);
                    document.removeEventListener('touchend', upHandler);
                };
                document.addEventListener('touchmove', moveHandler);
                document.addEventListener('touchend', upHandler);
            });
        };

        addHandleListeners(handleMin, 'min');
        addHandleListeners(handleMax, 'max');

        // Input listeners
        [inputMin, inputMax].forEach(input => {
            input.addEventListener('change', () => {
                currentMin = Math.max(minVal, Math.min(maxVal, parseInt(inputMin.value)));
                currentMax = Math.max(currentMin + 10, Math.min(maxVal, parseInt(inputMax.value)));
                updateSlider();
            });
        });

        updateSlider();
    }

    setupRangeSlider('loadSlider', 'loadMin', 'loadMax', 'loadRangeVal', 80, 8000);
    setupRangeSlider('diaSlider', 'diaMin', 'diaMax', 'diaRangeVal', 75, 400);

    // --- Mobile Off-canvas Logic ---
    const mobileTrigger = document.getElementById('openMobileFilter');
    const offcanvas = document.getElementById('mobileFilterOffcanvas');
    const closeBtn = offcanvas ? offcanvas.querySelector('.close-offcanvas') : null;
    const overlay = document.getElementById('filterOverlay');

    if (mobileTrigger && offcanvas) {
        mobileTrigger.addEventListener('click', () => {
            offcanvas.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeOffcanvas = () => {
            offcanvas.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeOffcanvas);
        overlay.addEventListener('click', closeOffcanvas);
    }

    // Accordion for Mobile
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const icon = header.querySelector('i');
            
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                icon.classList.replace('fa-plus', 'fa-minus');
            } else {
                icon.classList.replace('fa-minus', 'fa-plus');
            }
        });
    });

    // --- Result Counter Mockup ---
    // Static front end: the real filtering runs on the production back end, so the
    // count below is only a UI preview based on the category total in data-total.
    const checkInputs = document.querySelectorAll('input[type="checkbox"]');
    const countDisplay = document.querySelector('.results-count');
    const totalItems = countDisplay ? parseInt(countDisplay.dataset.total || '0', 10) : 0;
    const applyBtn = document.querySelector('.apply-filters-btn');

    checkInputs.forEach(input => {
        input.addEventListener('change', () => {
            const checkedCount = Array.from(checkInputs).filter(i => i.checked).length;
            const mockResults = Math.max(0, totalItems - (checkedCount * 5));
            if (countDisplay) countDisplay.textContent = `${mockResults} Items`;
            if (applyBtn) applyBtn.textContent = `Apply ${mockResults} Results`;
        });
    });

    // Reset button
    const resetBtn = document.querySelector('.clear-all-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            checkInputs.forEach(i => i.checked = false);
            const event = new Event('change');
            checkInputs[0].dispatchEvent(event);
        });
    }
});
