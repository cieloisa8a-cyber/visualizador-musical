
(function(){
  'use strict';
  
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const body = document.documentElement;


  
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
      const targetId = anchor.getAttribute('href');
      const targetElement = $(targetId);
      
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });

  
  const modal = $('#modal-tech');
  const openTechBtn = $('#open-technical');
  const closeModalBtn = $('#closeModal');
  const closeModal2Btn = $('#closeModal2');

  function showModal() {
    if (modal) {
      modal.setAttribute('aria-hidden', 'false');
      // Enfocar primer botón dentro del modal
      const firstBtn = modal.querySelector('.modal-inner button') || modal.querySelector('button');
      if (firstBtn) firstBtn.focus();
      console.log('📖 Modal abierto');
    }
  }

  function hideModal() {
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      console.log('📕 Modal cerrado');
    }
  }


  openTechBtn && openTechBtn.addEventListener('click', showModal);
  closeModalBtn && closeModalBtn.addEventListener('click', hideModal);
  closeModal2Btn && closeModal2Btn.addEventListener('click', hideModal);


  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
      hideModal();
    }
  });


  modal && modal.addEventListener('click', e => {
    if (e.target === modal) {
      hideModal();
    }
  });

  
  const uploadBtn = $('#uploadBtn');
  const demoBtn = $('#demoBtn');
  const examplesBtn = $('#examplesBtn');
  const startVisualizerBtn = $('#startVisualizer');
  const tryDemoBtn = $('#tryDemo');
  const shareVisualBtn = $('#shareVisual');


  uploadBtn && uploadBtn.addEventListener('click', () => {
    console.log('📤 Click en Subir canción');
    alert('Funcionalidad: Subir audio\n\n(Placeholder) En la versión final abrirá el selector de archivos.');
  });


  // demoBtn manejado en index.html con redirección a home.html


  examplesBtn && examplesBtn.addEventListener('click', () => {
    console.log('📋 Click en Ver ejemplos');
    const casosSection = $('#casos');
    if (casosSection) {
      casosSection.scrollIntoView({ behavior: 'smooth' });
    }
  });






  /*
  tryDemoBtn && tryDemoBtn.addEventListener('click', () => {
    console.log('▶️ Click en Probar demo sin subir audio');
    alert('Cargando demo...\n\n(Placeholder)');
  });


  shareVisualBtn && shareVisualBtn.addEventListener('click', () => {
    console.log('📤 Click en Compartir visualización');
    alert('Compartir...\n\n(Placeholder)');
  });
  */


  

  
  const heroImg = $('.hero-image');
  
  if (heroImg) {
    let time = 0;
    
    function animateFloat() {
      time += 0.01;
      const yOffset = Math.sin(time) * 6; 
      heroImg.style.transform = `translateY(${yOffset}px)`;
      requestAnimationFrame(animateFloat);
    }
    
    animateFloat();
    console.log('🎈 Animación de flotación activada en hero image');
  }

  
  console.log('✨ Script inicializado correctamente');
  console.log('📍 Tema actual:', body.getAttribute('data-theme'));
  
})();

/* --- Modal Paletas: slider simple --- */
(function(){
  const verPaletasBtn = document.getElementById('verPaletas');
  const modalPal = document.getElementById('modal-palettes');
  const closePal = document.getElementById('closePalettes');
  const closePal2 = document.getElementById('closePalettes2');
  const prevBtn = document.getElementById('prevPalette');
  const nextBtn = document.getElementById('nextPalette');
  const slidesContainer = document.getElementById('paletteSlides');

  if (!modalPal || !slidesContainer) return;

  // Safety: ensure modal starts hidden on load
  modalPal.setAttribute('aria-hidden', 'true');

  const slides = Array.from(slidesContainer.querySelectorAll('.slide'));
  let current = 0;

  function showPaletteModal() {
    modalPal.setAttribute('aria-hidden', 'false');
    updateSlides();
    const firstFocusable = modalPal.querySelector('button') || modalPal;
    firstFocusable && firstFocusable.focus();
  }

  function hidePaletteModal() {
    modalPal.setAttribute('aria-hidden', 'true');
  }

  function updateSlides() {
    // Ensure all slides are present for the fade transition
    slides.forEach((s, i) => {
      s.style.display = 'block';
      s.classList.toggle('active', i === current);
    });

    // After the transition, hide non-active slides to keep DOM clean
    setTimeout(() => {
      slides.forEach((s, i) => {
        if (i !== current) s.style.display = 'none';
      });
    }, 420);
  }

  function prev() { current = (current - 1 + slides.length) % slides.length; updateSlides(); }
  function next() { current = (current + 1) % slides.length; updateSlides(); }

  verPaletasBtn && verPaletasBtn.addEventListener('click', showPaletteModal);
  closePal && closePal.addEventListener('click', hidePaletteModal);
  closePal2 && closePal2.addEventListener('click', hidePaletteModal);
  prevBtn && prevBtn.addEventListener('click', prev);
  nextBtn && nextBtn.addEventListener('click', next);

  // Close on overlay click
  modalPal.addEventListener('click', e => { if (e.target === modalPal) hidePaletteModal(); });

  // Keyboard support
  document.addEventListener('keydown', e => {
    if (modalPal.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') hidePaletteModal();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
  });

  // Initialize slides hidden (don't flash on load)
  slides.forEach(s => s.style.display = 'none');
  // then show the current one (with transition)
  updateSlides();

})();

// Debugging: report hero elements and possible overlays
(function(){
  try {
    const heroImg = document.querySelector('.hero-image');
    const ctaBtns = Array.from(document.querySelectorAll('.hero-cta .btn'));
    console.group('DEBUG: Hero elements');
    console.log('heroImage element:', heroImg);
    if (heroImg) {
      const cs = getComputedStyle(heroImg);
      console.log('heroImage computed style:', {display: cs.display, visibility: cs.visibility, opacity: cs.opacity, width: cs.width, height: cs.height});
      console.log('heroImage size:', {w: heroImg.offsetWidth, h: heroImg.offsetHeight, naturalWidth: heroImg.naturalWidth});
      console.log('heroImage rect:', heroImg.getBoundingClientRect());
    }
    console.log('hero CTA buttons:', ctaBtns.map(b=>({text: b.textContent.trim(), display: getComputedStyle(b).display, visible: !!(b.offsetWidth||b.offsetHeight)})));
    console.groupEnd();

    // check for fixed/fullscreen overlays with high z-index
    const fixedEls = Array.from(document.querySelectorAll('body *')).filter(el=>{
      const cs = getComputedStyle(el);
      return (cs.position === 'fixed' || cs.position === 'sticky' || cs.position === 'absolute') && Number(cs.zIndex) && Number(cs.zIndex) >= 50;
    });
    console.group('DEBUG: High z-index elements (position fixed/absolute/sticky)');
    fixedEls.forEach(el=> console.log({tag: el.tagName, class: el.className, z: getComputedStyle(el).zIndex, rect: el.getBoundingClientRect()}));
    console.groupEnd();
  } catch (err) {
    console.error('DEBUG error', err);
  }
})();


