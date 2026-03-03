/* ============================================
   PEACE WOOD FIRED PIZZA - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  var w3fKey = (typeof PEACE_PIZZA_CONFIG !== 'undefined' && PEACE_PIZZA_CONFIG.web3formsKey && PEACE_PIZZA_CONFIG.web3formsKey !== 'YOUR_WEB3FORMS_KEY')
    ? PEACE_PIZZA_CONFIG.web3formsKey
    : null;
  var w3fUrl = 'https://api.web3forms.com/submit';

  function submitForm(fd, successCb, errorCb, finallyCb) {
    fd.set('access_key', w3fKey);
    fetch(w3fUrl, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) { successCb(); }
        else { errorCb(data.message || 'Something went wrong.'); }
      })
      .catch(function () { errorCb('Network error. Please call (513) 222-4087.'); })
      .finally(finallyCb);
  }

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  if (header) {
    function updateHeader() {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // --- Hero slider (background slides) ---
  var heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    var currentSlide = 0;
    setInterval(function () {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 5000);
  }

  // --- Booking modal ---
  var modal = document.getElementById('bookingModal');
  var openBtns = document.querySelectorAll('.js-open-booking-modal');
  var closeBtns = document.querySelectorAll('.js-close-modal');
  var bookingForm = document.getElementById('bookingModalForm');
  var bookingSuccess = document.getElementById('bookingSuccess');

  function openModal(id) {
    var m = document.getElementById(id || 'bookingModal');
    if (m) {
      m.classList.add('open');
      m.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (bookingSuccess) {
        bookingSuccess.classList.remove('show');
        bookingSuccess.style.display = 'none';
      }
      if (bookingForm) {
        bookingForm.style.display = '';
        bookingForm.reset();
      }
    }
  }
  function closeModal() {
    document.querySelectorAll('.modal.open').forEach(function (m) {
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var id = btn.getAttribute('data-modal');
      openModal(id);
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  });
  closeBtns.forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });
  if (modal) {
    modal.querySelectorAll('.modal-backdrop').forEach(function (b) {
      b.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  if (bookingForm && bookingSuccess) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      bookingForm.querySelectorAll('[required]').forEach(function (input) {
        if (!input.value.trim()) { input.style.borderColor = '#d62828'; valid = false; }
        else { input.style.borderColor = '#e0e0e0'; }
      });
      if (!valid) return;
      var btn = bookingForm.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      if (w3fKey) {
        var fd = new FormData(bookingForm);
        fd.set('subject', 'Peace Pizza - Quick Booking Request');
        submitForm(fd,
          function () {
            bookingForm.style.display = 'none';
            bookingSuccess.classList.add('show');
            bookingSuccess.style.display = 'block';
            setTimeout(closeModal, 2000);
          },
          function (msg) { alert(msg + ' Please call (513) 222-4087.'); },
          function () { if (btn) { btn.disabled = false; btn.textContent = originalText; } }
        );
      } else {
        bookingForm.style.display = 'none';
        bookingSuccess.classList.add('show');
        bookingSuccess.style.display = 'block';
        if (btn) { btn.disabled = false; btn.textContent = originalText; }
        setTimeout(closeModal, 2000);
      }
    });
  }

  // --- Mobile menu ---
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a:not(.js-open-booking-modal)').forEach(function (link) {
      link.addEventListener('click', function () {
        if (link.getAttribute('href') !== '#') {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // --- Reviews carousel (embedded data - works offline & file://) ---
  var reviewsTrack = document.getElementById('reviewsTrack');
  if (reviewsTrack) {
    var reviews = [{"text":"We had Peace Pizza for our high school graduation party. We LOVED it and so did our guests. We estimated 120 pizzas and our guests enjoyed every last bite. Loved supporting a small business run by hard working and friendly owners! We would highly recommend Peace Pizza for any party!","name":"Katie Dwyer Paddock","date":"March 26, 2025","avatarUrl":"","initials":"KP"},{"text":"Max is great and the pizza is AMAZING!!!! It's also so cool to watch them make the pizza from scratch. Whenever there is an event and they are there it is pure good vibes!","name":"Andy Robbins","date":"March 14, 2025","avatarUrl":"","initials":"AR"},{"text":"Max was accommodating and the guests at my wedding loved the pizza! Definitely recommend him for any event. Thank you again Max...we loved it!","name":"Robin Skies","date":"October 6, 2024","avatarUrl":"","initials":"RS"},{"text":"We had them host a special event at our church and everyone loved what they ordered. They were fast, friendly, and the pizza was amazing! We will be having them host another event soon!","name":"Adam Jones","date":"June 13, 2022","avatarUrl":"","initials":"AJ"},{"text":"Peace Pizza was the BEST wood fired pizza truck!!!! The pizza's, fast service and the super friendly owners were Top Notch and I would highly recommend them!!!!","name":"Cynthia Hassel","date":"June 7, 2022","avatarUrl":"","initials":"CH"},{"text":"Fabulous pizza. We recently had the Kalua pork and pineapple. It was delicious!! It's a must try!","name":"Rhonda Bartholomae Swenson","date":"June 1, 2021","avatarUrl":"","initials":"RBS"},{"text":"Peace Pizza catered my son's graduation party and everyone LOVED it!","name":"Suzanne Knapic Schuetter","date":"January 7, 2020","avatarUrl":"","initials":"SS"},{"text":"Just had my first taste of Peace Pizza at the Blacksmith's Guild in Roselawn. Delicious! Their BBQ Chicken Pizza has already come highly recommended; but, with my belief in variety being the spice of life and their willingness to let you \"have it Your Way\", I tried the Pesto Mushroom, with my addition of bacon and sausage, while Kiara simply added bacon to the traditional cheese. To \"top\" it all off, conversation with the owners was kind, warm and refreshing! Try it! You won't be disappointed!","name":"Melissa Baines","date":"August 24, 2018","avatarUrl":"","initials":"MB"},{"text":"Huge hit at our son's grad party! Delicious pizza and such a pleasure to work with. Would highly recommend P&P!!","name":"Jill Caccamo Strasser","date":"June 25, 2018","avatarUrl":"","initials":"JS"},{"text":"Amazing pizza and people! I'm a pizza fan and this pizza ranks at the top!!!","name":"Heather Topmiller","date":"June 30, 2017","avatarUrl":"","initials":"HT"},{"text":"I just went to there food trucks today not only the pizza is good and I got my family get some but there customer service is amazing","name":"Angel Eye","date":"August 6, 2016","avatarUrl":"","initials":"AE"}];
    function esc(s) {
      return (String(s || '')).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function cardHtml(r) {
      var text = esc(r.text || '').replace(/\n/g, '<br>');
      var avatar = r.avatarUrl
        ? '<img src="' + esc(r.avatarUrl) + '" alt="" class="review-avatar-img" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';"><div class="review-avatar" style="display:none">' + esc(r.initials || '') + '</div>'
        : '<div class="review-avatar">' + esc(r.initials || '') + '</div>';
      return '<div class="review-card"><p class="review-text">"' + text + '"</p><div class="review-author">' + avatar + '<div class="review-meta"><strong>' + esc(r.name || '') + '</strong><span>' + esc(r.date || '') + ' &bull; Facebook</span></div></div></div>';
    }
    var html = reviews.map(cardHtml).join('');
    reviewsTrack.innerHTML = html + html;
  }

  // --- Scroll animations ---
  var animateEls = document.querySelectorAll('.animate');
  if (animateEls.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    animateEls.forEach(function (el) { observer.observe(el); });
  }

  // --- Form handling ---
  function submitToWeb3Forms(form, successEl, btn, originalText, subject) {
    if (!w3fKey) {
      alert('Form not configured. Add your Web3Forms key in js/config.js');
      if (btn) { btn.disabled = false; btn.textContent = originalText; }
      return;
    }
    var fd = new FormData(form);
    if (subject) fd.set('subject', subject);
    submitForm(fd,
      function () {
        form.style.display = 'none';
        if (successEl) { successEl.classList.add('show'); successEl.style.display = 'block'; }
      },
      function () { alert('Something went wrong. Please email max@peacewoodfiredpizza.com'); },
      function () { if (btn) { btn.disabled = false; btn.textContent = originalText; } }
    );
  }

  // Event request form
  var eventForm = document.getElementById('eventForm');
  if (eventForm) {
    eventForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = eventForm.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      var valid = true;
      eventForm.querySelectorAll('[required]').forEach(function (input) {
        if (!input.value.trim()) { input.style.borderColor = '#d62828'; valid = false; }
        else { input.style.borderColor = '#e0e0e0'; }
      });
      if (!valid) return;
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      submitToWeb3Forms(eventForm, document.getElementById('formSuccess'), btn, originalText, 'Peace Pizza - Event Request');
    });
  }

  // Page CTA forms (Ready to Book on every page) - submit to Formspree
  var pageCtaForms = document.querySelectorAll('.js-page-cta-form');
  pageCtaForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        if (!input.value.trim()) { input.style.borderColor = '#d62828'; valid = false; }
        else { input.style.borderColor = '#e0e0e0'; }
      });
      if (!valid) return;
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      var wrap = form.closest('.page-cta-form-wrap');
      var successEl = wrap ? wrap.querySelector('.page-cta-success') : null;
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      submitToWeb3Forms(form, successEl, btn, originalText, 'Peace Pizza - Booking Request');
    });
  });

  // Apply form
  var applyForm = document.getElementById('applyForm');
  if (applyForm) {
    applyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      applyForm.querySelectorAll('[required]').forEach(function (input) {
        if (!input.value.trim()) { input.style.borderColor = '#d62828'; valid = false; }
        else { input.style.borderColor = '#e0e0e0'; }
      });
      if (!valid) return;
      var btn = applyForm.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      var successEl = document.getElementById('formSuccess');
      submitToWeb3Forms(applyForm, successEl, btn, originalText, 'Peace Pizza - Job Application');
    });
  }

  // Other forms (newsletter, etc.) - simple handler
  var otherForms = document.querySelectorAll('form:not(#eventForm):not(#bookingModalForm):not(.js-page-cta-form):not(#applyForm)');
  otherForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      form.querySelectorAll('[required]').forEach(function (input) {
        if (!input.value.trim()) { input.style.borderColor = '#d62828'; return; }
        input.style.borderColor = '#e0e0e0';
      });
      if (btn) { btn.disabled = true; btn.textContent = 'Thanks!'; }
      setTimeout(function () { if (btn) btn.textContent = originalText; }, 1500);
    });
  });

  // Clear validation styling on input
  document.querySelectorAll('.form-control').forEach(function (input) {
    input.addEventListener('input', function () {
      this.style.borderColor = '#e0e0e0';
    });
    input.addEventListener('focus', function () {
      this.style.borderColor = '#d62828';
      this.style.boxShadow = '0 0 0 3px rgba(214,40,40,.1)';
    });
    input.addEventListener('blur', function () {
      this.style.boxShadow = '';
      if (!this.value.trim() && this.hasAttribute('required')) {
        this.style.borderColor = '#e0e0e0';
      }
    });
  });

  // --- Lightbox (Gallery page) ---
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var galleryItems = document.querySelectorAll('.gallery-item');
  var currentIndex = 0;

  if (lightbox && galleryItems.length > 0) {
    function openLightbox(index) {
      currentIndex = index;
      var img = galleryItems[index].querySelector('img');
      // Use higher res version for lightbox
      lightboxImg.src = img.src.replace(/rs=w:\d+/, 'rs=w:1200');
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function () { openLightbox(i); });
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(currentIndex);
    });
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % galleryItems.length;
      openLightbox(currentIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev.click();
      if (e.key === 'ArrowRight') lightboxNext.click();
    });
  }

  // --- Sticky CTA visibility (hide when near footer or contact section) ---
  var stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    var footer = document.querySelector('.footer');
    window.addEventListener('scroll', function () {
      if (!footer) return;
      var footerTop = footer.getBoundingClientRect().top;
      stickyCta.style.opacity = footerTop < window.innerHeight ? '0' : '1';
      stickyCta.style.pointerEvents = footerTop < window.innerHeight ? 'none' : 'auto';
    }, { passive: true });
  }

  // --- Newsletter form ---
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = newsletterForm.querySelector('input[name="email"]');
      if (email && !email.value.trim()) return;
      var btn = newsletterForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Thanks!';
      }
    });
  }

  // --- Footer location toggle ---
  document.querySelectorAll('.js-footer-location-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var list = document.getElementById('footerLocationLinks');
      if (list) list.classList.toggle('expanded');
      btn.textContent = (list && list.classList.contains('expanded')) ? 'Catering by Location ▾' : 'Catering by Location ▸';
    });
  });

  // --- Footer location links (from data/location-pages.json) ---
  var footerLocationLinks = document.getElementById('footerLocationLinks');
  if (footerLocationLinks) {
    var locationPages = [{"label":"Indian Hill Catering","url":"locations/indian-hill-catering.html"},{"label":"Blue Ash Catering","url":"locations/blue-ash-catering.html"},{"label":"Mason Catering","url":"locations/mason-catering.html"},{"label":"Hyde Park Catering","url":"locations/hyde-park-catering.html"},{"label":"Montgomery Catering","url":"locations/montgomery-catering.html"},{"label":"Wyoming Catering","url":"locations/wyoming-catering.html"},{"label":"Mariemont Catering","url":"locations/mariemont-catering.html"},{"label":"Mt. Lookout Catering","url":"locations/mt-lookout-catering.html"},{"label":"West Chester Catering","url":"locations/west-chester-catering.html"},{"label":"Madeira Catering","url":"locations/madeira-catering.html"},{"label":"Terrace Park Catering","url":"locations/terrace-park-catering.html"},{"label":"Oakley Catering","url":"locations/oakley-catering.html"},{"label":"OTR Catering","url":"locations/otr-catering.html"},{"label":"Kenwood Catering","url":"locations/kenwood-catering.html"},{"label":"Clifton Catering","url":"locations/clifton-catering.html"}];
    var base = (window.location.pathname || '').indexOf('pages/') !== -1 || (window.location.pathname || '').indexOf('locations/') !== -1 ? '../' : '';
    var html = locationPages.map(function (p) {
      return '<li><a href="' + base + p.url + '">' + String(p.label).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + '</a></li>';
    }).join('');
    footerLocationLinks.innerHTML = html;
  }

});
