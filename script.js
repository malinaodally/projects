/* ==========================================================================
   DALLY MALINAO — PORTFOLIO SCRIPT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Scroll progress bar ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function onScroll(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';

    navbar.classList.toggle('scrolled', scrollTop > 40);
    backToTop.classList.toggle('show', scrollTop > 500);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }));

  /* ---------- Theme toggle (dark by default) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = window.__theme || 'dark';
  if (savedTheme === 'light') root.setAttribute('data-theme', 'light');
  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight){ root.removeAttribute('data-theme'); window.__theme = 'dark'; }
    else { root.setAttribute('data-theme', 'light'); window.__theme = 'light'; }
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  function setActiveLink(){
    let current = 'home';
    const offset = 140;
    sections.forEach(sec => {
      if (window.scrollY + offset >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }
  document.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Reveal-on-scroll (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Hero typing animation ---------- */
  const typedEl = document.getElementById('typedText');
  const roles = [
    'GoHighLevel Solutions Developer',
    'Marketing Automation Specialist',
    'Front-End Web Developer',
    'Social Media Manager'
  ];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    const current = roles[roleIndex];
    if (!deleting){
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();

  /* ---------- Animated counters ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      function step(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  statNums.forEach(el => counterObserver.observe(el));

  /* ---------- Skill bars ---------- */
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const bar = entry.target;
        const level = bar.dataset.level;
        bar.style.setProperty('--fill', level + '%');
        bar.classList.add('filled');
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ---------- Portfolio filtering ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------- Slider arrows for gallery clients ---------- */
  document.querySelectorAll('.client-slider').forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const prev = slider.querySelector('.slider-arrow--left');
    const next = slider.querySelector('.slider-arrow--right');
    const scrollAmt = 240;
    prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmt, behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: scrollAmt, behavior: 'smooth' }));
  });

  /* ---------- Gallery search filter ---------- */
  const gallerySearch = document.getElementById('gallerySearch');
  const galleryItems = document.querySelectorAll('.gallery-item');
  gallerySearch.addEventListener('input', () => {
    const q = gallerySearch.value.trim().toLowerCase();
    galleryItems.forEach(item => {
      const title = item.dataset.title.toLowerCase();
      const cat = item.dataset.category.toLowerCase();
      const match = title.includes(q) || cat.includes(q);
      item.classList.toggle('hide', !match);
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxTools = document.getElementById('lightboxTools');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const allGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let currentIndex = 0;

  function openLightbox(index){
    currentIndex = index;
    renderLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function renderLightbox(){
    const item = allGalleryItems[currentIndex];
    const img = item.querySelector('img');
    lightboxImg.style.opacity = 0;
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.opacity = 1;
    }, 150);
    lightboxTitle.textContent = item.dataset.title;
    lightboxCategory.textContent = item.dataset.category;
    lightboxDesc.textContent = item.dataset.desc;
    lightboxTools.textContent = 'Tools Used: ' + item.dataset.tools;
    lightboxCounter.textContent = `Image ${currentIndex + 1} of ${allGalleryItems.length}`;
  }

  function closeLightbox(){
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  allGalleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + allGalleryItems.length) % allGalleryItems.length;
    renderLightbox();
  });
  lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % allGalleryItems.length;
    renderLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  /* ---------- Before & After slider ---------- */
  const baSlider = document.getElementById('baSlider');
  const baAfterWrap = document.getElementById('baAfterWrap');
  const baHandle = document.getElementById('baHandle');
  let dragging = false;

  function setSlider(clientX){
    const rect = baSlider.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const pct = (x / rect.width) * 100;
    baAfterWrap.style.width = pct + '%';
    baHandle.style.left = pct + '%';
  }

  baHandle.addEventListener('mousedown', () => dragging = true);
  window.addEventListener('mouseup', () => dragging = false);
  window.addEventListener('mousemove', (e) => { if (dragging) setSlider(e.clientX); });

  baHandle.addEventListener('touchstart', () => dragging = true, { passive: true });
  window.addEventListener('touchend', () => dragging = false);
  window.addEventListener('touchmove', (e) => {
    if (dragging && e.touches[0]) setSlider(e.touches[0].clientX);
  }, { passive: true });

  baSlider.addEventListener('click', (e) => setSlider(e.clientX));

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-el';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Contact form (front-end only) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = 'Thanks! Your message has been prepared — connect a backend or form service to deliver it.';
    contactForm.reset();
  });

});
