// Mobile navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  document.querySelectorAll('#nav-menu a').forEach(link => link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }));
}

// Solar savings calculator
const bill = document.getElementById('monthly-bill');
const slider = document.getElementById('monthly-bill-slider');
const billValue = document.getElementById('bill-value');
if (bill && slider) {
  bill.addEventListener('input', () => { slider.value = bill.value; billValue.textContent = bill.value; });
  slider.addEventListener('input', () => { bill.value = slider.value; billValue.textContent = slider.value; });
}
function calculateSavings() {
  const monthlyBill = Number(bill?.value) || 0;
  const systemSize = Number(document.getElementById('system-size')?.value) || 3;
  const rate = Number(document.getElementById('electricity-rate')?.value) || 8;
  if (monthlyBill <= 0 || rate <= 0) return alert('Please enter valid values');
  const production = systemSize * 1200;
  const annualSavings = production * rate;
  const cost = systemSize * 75000;
  document.getElementById('annual-production').textContent = production.toLocaleString('en-IN');
  document.getElementById('annual-savings').textContent = Math.round(annualSavings).toLocaleString('en-IN');
  document.getElementById('five-year-savings').textContent = Math.round(annualSavings * 5).toLocaleString('en-IN');
  document.getElementById('payback-period').textContent = (cost / annualSavings).toFixed(1);
}

// Project carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
function updateCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track || !slides.length) return;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  indicators.forEach((indicator, index) => indicator.classList.toggle('active', index === currentSlide));
}
function moveCarousel(direction) {
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  updateCarousel();
}
function goToSlide(index) { currentSlide = index; updateCarousel(); }
setInterval(() => moveCarousel(1), 5000);

// Testimonials: show locations only, without customer names.
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
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    location: document.getElementById('location').value.trim(),
    consumption: document.getElementById('monthly-consumption').value,
    propertyType: document.getElementById('property-type').value,
    message: document.getElementById('message').value.trim()
  };
  if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ''))) {
    formMessage.textContent = 'Please enter a valid 10-digit phone number.';
    formMessage.className = 'form-message error';
    return;
  }
  if (Number(data.consumption) <= 0) {
    formMessage.textContent = 'Please enter valid electricity consumption.';
    formMessage.className = 'form-message error';
    return;
  }
  localStorage.setItem('lastQuotationRequest', JSON.stringify(data));
  const message = `Hello Swamini Green Energy,\n\nName: ${data.name}\nPhone: ${data.phone}\nLocation: ${data.location}\nMonthly Consumption: ${data.consumption} kWh\nProperty Type: ${data.propertyType}\n${data.message}`;
  const whatsapp = `https://wa.me/919284081148?text=${encodeURIComponent(message)}`;
  formMessage.innerHTML = `✅ Request received! <a class="btn whatsapp" href="${whatsapp}" target="_blank">💬 Send via WhatsApp</a>`;
  formMessage.className = 'form-message success';
  contactForm.reset();
}
if (contactForm) contactForm.addEventListener('submit', submitForm);

// Smooth scrolling and reveal animations
document.querySelectorAll('a[href^="#"]').forEach(anchor => anchor.addEventListener('click', event => {
  const target = document.querySelector(anchor.getAttribute('href'));
  if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
}));
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }
}), { threshold: 0.1 });
document.querySelectorAll('.card, .testimonial-card, .gallery-item').forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = 'opacity .6s ease, transform .6s ease';
  observer.observe(element);
});
window.addEventListener('load', calculateSavings);
