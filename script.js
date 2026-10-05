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

async async function submitForm(event) {
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

  let phoneDigits = data.phone.replace(/\D/g, '');
  // Accept 10-digit Indian numbers, 0XXXXXXXXXX, or +91XXXXXXXXXX.
  if (phoneDigits.length === 12 && phoneDigits.startsWith('91')) {
    phoneDigits = phoneDigits.slice(2);
  }
  if (phoneDigits.length === 11 && phoneDigits.startsWith('0')) {
    phoneDigits = phoneDigits.slice(1);
  }
  if (!/^\d{10}$/.test(phoneDigits)) {
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

  if (formMessage) {
    formMessage.textContent = 'Sending your quotation request...';
    formMessage.className = 'form-message';
  }

  const formData = new FormData();
  formData.append('_subject', 'New Solar Quotation Request - Swamini Green Energy');
  formData.append('_replyto', data.email || 'ghorpaderaj0@gmail.com');
  formData.append('_url', window.location.href);
  formData.append('_captcha', 'false');
  formData.append('_template', 'table');
  formData.append('Customer Name', data.name);
  formData.append('Phone Number', data.phone);
  formData.append('Email Address', data.email || 'Not provided');
  formData.append('Location', data.location);
  formData.append('Monthly Electricity Consumption', data.consumption + ' kWh');
  formData.append('Property Type', data.propertyType);
  formData.append('Customer Message', data.message || 'No additional message');

  try {
    const response = await fetch('https://formsubmit.co/ajax/ghorpaderaj0@gmail.com', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData.entries())),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (!response.ok || result.success !== true && result.success !== 'true') {
      throw new Error('Email service did not accept the request');
    }

    localStorage.setItem('lastQuotationRequest', JSON.stringify(data));

    const message = `Hello Swamini Green Energy,

Name: ${data.name}
Phone: ${data.phone}
Location: ${data.location}
Monthly Consumption: ${data.consumption} kWh
Property Type: ${data.propertyType}
${data.message || ''}`;

    const whatsapp = `https://wa.me/919284081148?text=${encodeURIComponent(message)}`;

    if (formMessage) {
      formMessage.innerHTML = `✅ Quotation request sent successfully! We will contact you soon.<br><br><a class="btn whatsapp" href="${whatsapp}" target="_blank" rel="noopener noreferrer">💬 Also Send via WhatsApp</a>`;
      formMessage.className = 'form-message success';
    }

    if (contactForm) contactForm.reset();
  } catch (error) {
    console.error('Quotation form error:', error);

    const subject = encodeURIComponent('Solar Quotation Request - ' + data.name);
    const body = encodeURIComponent(
      'Customer Name: ' + data.name + '\n' +
      'Phone: ' + data.phone + '\n' +
      'Email: ' + (data.email || 'Not provided') + '\n' +
      'Location: ' + data.location + '\n' +
      'Monthly Consumption: ' + data.consumption + ' kWh\n' +
      'Property Type: ' + data.propertyType + '\n' +
      'Message: ' + (data.message || 'No additional message')
    );
    const mailto = 'mailto:ghorpaderaj0@gmail.com?subject=' + subject + '&body=' + body;

    const whatsapp = 'https://wa.me/919284081148?text=' + encodeURIComponent(
      'Hello Swamini Green Energy, I want a solar quotation.\nName: ' + data.name +
      '\nPhone: ' + data.phone + '\nLocation: ' + data.location
    );

    if (formMessage) {
      formMessage.innerHTML =
        '⚠️ Email delivery is temporarily unavailable. Please use one of these options:<br><br>' +
        '<a class="btn" href="' + mailto + '">📧 Open Email</a> ' +
        '<a class="btn whatsapp" href="' + whatsapp + '" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>';
      formMessage.className = 'form-message error';
    }
  }
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
