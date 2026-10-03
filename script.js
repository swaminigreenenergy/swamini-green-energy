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


/* ===== Add New Project system ===== */
const PROJECT_STORAGE_KEY = 'swaminiGalleryProjects';

function toggleProjectForm() {
  const panel = document.getElementById('project-form-panel');
  if (!panel) return;
  panel.hidden = !panel.hidden;
  if (!panel.hidden) panel.scrollIntoView({behavior:'smooth', block:'center'});
}

function readGalleryProjects() {
  try { return JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY) || '[]'); }
  catch(e) { return []; }
}

function saveGalleryProjects(projects) {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}

function renderSavedProjects() {
  const track = document.querySelector('.carousel-track');
  const indicatorsBox = document.querySelector('.carousel-indicators');
  const note = document.getElementById('saved-projects-note');
  if (!track || !indicatorsBox) return;

  track.querySelectorAll('.dynamic-project-slide').forEach(el => el.remove());
  const projects = readGalleryProjects();

  projects.forEach((project, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide dynamic-project-slide';
    slide.innerHTML = `
      <div class="gallery-item">
        <img class="dynamic-project-image" src="${project.photo}" alt="${escapeHtml(project.title)}">
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
        <p class="project-stats">System Size: ${escapeHtml(project.size || '—')} | Annual Savings: ${escapeHtml(project.savings || '—')} | Location: ${escapeHtml(project.location || '—')}</p>
        <button class="delete-project-btn" type="button" onclick="deleteGalleryProject(${i})">🗑️ Remove Project</button>
      </div>`;
    track.appendChild(slide);
  });

  const count = track.querySelectorAll('.carousel-slide').length;
  indicatorsBox.innerHTML = '';
  for(let i=0;i<count;i++) {
    const indicator = document.createElement('span');
    indicator.className = 'indicator' + (i === currentSlide ? ' active' : '');
    indicator.setAttribute('aria-label', 'Go to slide ' + (i+1));
    indicator.onclick = () => goToSlide(i);
    indicatorsBox.appendChild(indicator);
  }
  currentSlide = Math.min(currentSlide, Math.max(0, count - 1));
  updateCarousel();
  if(note) note.textContent = projects.length ? projects.length + ' project(s) saved on this device.' : '';
}

function deleteGalleryProject(index) {
  const projects = readGalleryProjects();
  if (!projects[index]) return;
  if (!confirm('Remove this project from this device?')) return;
  projects.splice(index, 1);
  saveGalleryProjects(projects);
  currentSlide = 0;
  renderSavedProjects();
}

const projectForm = document.getElementById('project-form');
if (projectForm) {
  projectForm.addEventListener('submit', event => {
    event.preventDefault();
    const file = document.getElementById('project-photo')?.files?.[0];
    const message = document.getElementById('project-form-message');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if(message){ message.textContent='Please select an image file.'; message.className='form-message error'; }
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      if(message){ message.textContent='Please use an image smaller than 4 MB.'; message.className='form-message error'; }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const projects = readGalleryProjects();
        projects.push({
          title: document.getElementById('project-title').value.trim(),
          location: document.getElementById('project-location').value.trim(),
          size: document.getElementById('project-size').value.trim(),
          savings: document.getElementById('project-savings').value.trim(),
          description: document.getElementById('project-description').value.trim(),
          photo: reader.result
        });
        saveGalleryProjects(projects);
        projectForm.reset();
        if(message){ message.textContent='✅ Project added successfully on this device.'; message.className='form-message success'; }
        renderSavedProjects();
      } catch(e) {
        if(message){ message.textContent='Storage limit reached. Please use a smaller photo.'; message.className='form-message error'; }
      }
    };
    reader.readAsDataURL(file);
  });
}

window.addEventListener('load', renderSavedProjects);
