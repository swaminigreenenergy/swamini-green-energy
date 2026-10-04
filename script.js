// Mobile navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// Solar savings calculator
const bill = document.getElementById('monthly-bill');
const slider = document.getElementById('monthly-bill-slider');
const billValue = document.getElementById('bill-value');

if (bill && slider) {
  bill.addEventListener('input', () => {
    slider.value = bill.value;
    if (billValue) billValue.textContent = bill.value;
  });

  slider.addEventListener('input', () => {
    bill.value = slider.value;
    if (billValue) billValue.textContent = slider.value;
  });
}

function calculateSavings() {
  const monthlyBill = Number(bill?.value) || 0;
  const systemSize = Number(document.getElementById('system-size')?.value) || 3;
  const rate = Number(document.getElementById('electricity-rate')?.value) || 8;

  if (monthlyBill <= 0 || rate <= 0) {
    alert('Please enter valid values');
    return;
  }

  const production = systemSize * 1200;
  const annualSavings = production * rate;
  const cost = systemSize * 75000;

  const annualProduction = document.getElementById('annual-production');
  const annualSavingsEl = document.getElementById('annual-savings');
  const fiveYearSavingsEl = document.getElementById('five-year-savings');
  const paybackPeriodEl = document.getElementById('payback-period');

  if (annualProduction) annualProduction.textContent = production.toLocaleString('en-IN');
  if (annualSavingsEl) annualSavingsEl.textContent = Math.round(annualSavings).toLocaleString('en-IN');
  if (fiveYearSavingsEl) fiveYearSavingsEl.textContent = Math.round(annualSavings * 5).toLocaleString('en-IN');
  if (paybackPeriodEl) paybackPeriodEl.textContent = (cost / annualSavings).toFixed(1);
}

// Project carousel
let currentSlide = 0;

function getSlides() {
  return document.querySelectorAll('.carousel-slide');
}

function updateCarousel() {
  const track = document.querySelector('.carousel-track');
  const slides = getSlides();
  const indicators = document.querySelectorAll('.indicator');
  if (!track || !slides.length) return;

  currentSlide = Math.min(currentSlide, slides.length - 1);
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlide);
  });
}

function moveCarousel(direction) {
  const slides = getSlides();
  if (!slides.length) return;
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  updateCarousel();
}

function goToSlide(index) {
  const slides = getSlides();
  if (!slides.length) return;
  currentSlide = Math.max(0, Math.min(index, slides.length - 1));
  updateCarousel();
}

if (getSlides().length) setInterval(() => moveCarousel(1), 5000);

// Testimonials: show locations only, without names.
const testimonialLocations = ['Bahadurwadi', 'Koregaon', 'Dhavali', 'Tasgaon', 'Shigaon'];
document.querySelectorAll('.testimonial-card').forEach((card, index) => {
  const name = card.querySelector('.author-info h4');
  const location = card.querySelector('.author-info p');
  if (name) name.remove();
  if (location) location.textContent = testimonialLocations[index] || '';
});

// Quotation form
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

function submitForm(event) {
  event.preventDefault();

  const data = {
    name: document.getElementById('name')?.value.trim() || '',
    phone: document.getElementById('phone')?.value.trim() || '',
    email: document.getElementById('email')?.value.trim() || '',
    location: document.getElementById('location')?.value.trim() || '',
    consumption: document.getElementById('monthly-consumption')?.value || '',
    propertyType: document.getElementById('property-type')?.value || '',
    message: document.getElementById('message')?.value.trim() || ''
  };

  if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ''))) {
    if (formMessage) {
      formMessage.textContent = 'Please enter a valid 10-digit phone number.';
      formMessage.className = 'form-message error';
    }
    return;
  }

  if (Number(data.consumption) <= 0) {
    if (formMessage) {
      formMessage.textContent = 'Please enter valid electricity consumption.';
      formMessage.className = 'form-message error';
    }
    return;
  }

  localStorage.setItem('lastQuotationRequest', JSON.stringify(data));

  const message = `Hello Swamini Green Energy,\n\nName: ${data.name}\nPhone: ${data.phone}\nLocation: ${data.location}\nMonthly Consumption: ${data.consumption} kWh\nProperty Type: ${data.propertyType}\n${data.message}`;
  const whatsapp = `https://wa.me/919284081148?text=${encodeURIComponent(message)}`;

  if (formMessage) {
    formMessage.innerHTML = `✅ Request received! <a class="btn whatsapp" href="${whatsapp}" target="_blank" rel="noopener noreferrer">💬 Send via WhatsApp</a>`;
    formMessage.className = 'form-message success';
  }

  if (contactForm) contactForm.reset();
}

if (contactForm) contactForm.addEventListener('submit', submitForm);

// Smooth scrolling and reveal animations
const anchors = document.querySelectorAll('a[href^="#"]');
anchors.forEach(anchor => {
  anchor.addEventListener('click', event => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .testimonial-card, .gallery-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(element);
  });
}

window.addEventListener('load', calculateSavings);

// Project gallery category tabs
let activeGalleryCategory = 'residential';

function getVisibleGallerySlides() {
  return Array.from(document.querySelectorAll('.carousel-slide')).filter(slide =>
    (slide.dataset.category || 'residential') === activeGalleryCategory
  );
}

function filterGallery(category) {
  activeGalleryCategory = category;
  currentSlide = 0;

  document.querySelectorAll('.gallery-tab').forEach(tab => {
    const active = tab.dataset.galleryTab === category;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  document.querySelectorAll('.carousel-slide').forEach(slide => {
    slide.hidden = (slide.dataset.category || 'residential') !== category;
  });

  const indicatorsBox = document.querySelector('.carousel-indicators');
  const slides = getVisibleGallerySlides();
  if (indicatorsBox) {
    indicatorsBox.innerHTML = '';
    slides.forEach((slide, index) => {
      const indicator = document.createElement('span');
      indicator.className = 'indicator' + (index === 0 ? ' active' : '');
      indicator.setAttribute('aria-label', 'Go to slide ' + (index + 1));
      indicator.onclick = () => {
        currentSlide = index;
        updateGalleryCarousel();
      };
      indicatorsBox.appendChild(indicator);
    });
  }
  updateGalleryCarousel();
}

function updateGalleryCarousel() {
  const slides = getVisibleGallerySlides();
  const track = document.querySelector('.carousel-track');
  if (!track || !slides.length) return;
  const slideWidth = 100 / slides.length;
  track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
  slides.forEach((slide, index) => {
    slide.style.position = 'relative';
    slide.style.left = '0';
    slide.style.width = '100%';
  });
  document.querySelectorAll('.carousel-slide:not([hidden])').forEach((slide, index) => {
    slide.style.transform = 'translateX(' + (index * 0) + '%)';
  });
  document.querySelectorAll('.indicator').forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlide);
  });
}

document.querySelectorAll('.gallery-tab').forEach(tab => {
  tab.addEventListener('click', () => filterGallery(tab.dataset.galleryTab));
});

window.addEventListener('load', () => filterGallery('residential'));
