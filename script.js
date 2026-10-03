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


/* ===== Supabase Project Gallery ===== */
const SUPABASE_URL = 'https://hdjpcfvyxxbveaoduitk.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_3RuTENl21LcKo5tfah1MGg_g6WUGE5A';
const PROJECT_BUCKET = 'project-images';

let supabaseClient = null;
try {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
} catch (e) {
  console.error('Supabase initialization failed:', e);
}

function toggleProjectForm() {
  const panel = document.getElementById('project-form-panel');
  if (!panel) return;
  panel.hidden = !panel.hidden;
  if (!panel.hidden) panel.scrollIntoView({behavior:'smooth', block:'center'});
}

function toggleAdminLogin() {
  const panel = document.getElementById('admin-login-panel');
  if (panel) panel.hidden = !panel.hidden;
}

function setAdminUI(session) {
  const status = document.getElementById('admin-auth-status');
  const addBtn = document.getElementById('add-project-button');
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (status) status.textContent = session ? 'Gallery admin: Signed in' : 'Gallery admin: Not signed in';
  if (addBtn) addBtn.hidden = !session;
  if (logoutBtn) logoutBtn.hidden = !session;
}

async function adminLogout() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  const panel = document.getElementById('project-form-panel');
  if (panel) panel.hidden = true;
  setAdminUI(null);
}

async function loadAdminSession() {
  if (!supabaseClient) return;
  const { data } = await supabaseClient.auth.getSession();
  setAdminUI(data.session);
  supabaseClient.auth.onAuthStateChange((_event, session) => setAdminUI(session));
}

async function loadGalleryProjects() {
  const track = document.querySelector('.carousel-track');
  const indicatorsBox = document.querySelector('.carousel-indicators');
  const note = document.getElementById('saved-projects-note');
  if (!track || !indicatorsBox || !supabaseClient) return;

  track.querySelectorAll('.dynamic-project-slide').forEach(el => el.remove());

  const { data: projects, error } = await supabaseClient
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Could not load Supabase projects:', error);
    if (note) note.textContent = 'Unable to load online projects right now.';
    return;
  }

  (projects || []).forEach(project => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide dynamic-project-slide';
    const photo = project.image_url || '';
    slide.innerHTML = `
      <div class="gallery-item">
        ${photo ? `<img class="dynamic-project-image" src="${escapeHtml(photo)}" alt="${escapeHtml(project.title)}" loading="lazy">` : ''}
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description || '')}</p>
        <p class="project-stats">System Size: ${escapeHtml(project.capacity || '—')} | Location: ${escapeHtml(project.location || '—')}</p>
        <div class="admin-project-actions" data-project-id="${project.id}">
          <button class="delete-project-btn" type="button" onclick="deleteSupabaseProject(${project.id}, '${escapeHtml(photo)}')">🗑️ Remove Project</button>
        </div>
      </div>`;
    track.appendChild(slide);
  });

  const count = track.querySelectorAll('.carousel-slide').length;
  indicatorsBox.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const indicator = document.createElement('span');
    indicator.className = 'indicator' + (i === currentSlide ? ' active' : '');
    indicator.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    indicator.onclick = () => goToSlide(i);
    indicatorsBox.appendChild(indicator);
  }
  currentSlide = Math.min(currentSlide, Math.max(0, count - 1));
  updateCarousel();
  if (note) note.textContent = projects && projects.length ? projects.length + ' project(s) online.' : 'No projects added yet.';
  refreshAdminProjectButtons();
}

function refreshAdminProjectButtons() {
  if (!supabaseClient) return;
  supabaseClient.auth.getSession().then(({data}) => {
    document.querySelectorAll('.admin-project-actions').forEach(el => {
      el.hidden = !data.session;
    });
  });
}

async function deleteSupabaseProject(id, photoUrl) {
  if (!supabaseClient) return;
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    alert('Please sign in as gallery admin first.');
    return;
  }
  if (!confirm('Remove this project from the online gallery?')) return;

  const { error } = await supabaseClient.from('projects').delete().eq('id', id);
  if (error) {
    alert('Could not remove project: ' + error.message);
    return;
  }

  if (photoUrl) {
    try {
      const marker = '/storage/v1/object/public/' + PROJECT_BUCKET + '/';
      const pos = photoUrl.indexOf(marker);
      if (pos >= 0) {
        const path = decodeURIComponent(photoUrl.slice(pos + marker.length));
        await supabaseClient.storage.from(PROJECT_BUCKET).remove([path]);
      }
    } catch (e) {
      console.warn('Photo cleanup failed:', e);
    }
  }
  currentSlide = 0;
  await loadGalleryProjects();
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}

const adminLoginForm = document.getElementById('admin-login-form');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async event => {
    event.preventDefault();
    const msg = document.getElementById('admin-login-message');
    if (!supabaseClient) return;

    const email = document.getElementById('admin-email')?.value.trim() || '';
    const password = document.getElementById('admin-password')?.value || '';
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      if (msg) {
        msg.textContent = '❌ Login failed: ' + error.message;
        msg.className = 'form-message error';
      }
      return;
    }

    if (msg) {
      msg.textContent = '✅ Admin login successful.';
      msg.className = 'form-message success';
    }
    adminLoginForm.reset();
    const panel = document.getElementById('admin-login-panel');
    if (panel) panel.hidden = true;
    setAdminUI((await supabaseClient.auth.getSession()).data.session);
  });
}

const projectForm = document.getElementById('project-form');
if (projectForm) {
  projectForm.addEventListener('submit', async event => {
    event.preventDefault();
    const message = document.getElementById('project-form-message');
    if (!supabaseClient) return;

    const { data: sessionData } = await supabaseClient.auth.getSession();
    if (!sessionData.session) {
      if (message) {
        message.textContent = '❌ Please sign in as gallery admin first.';
        message.className = 'form-message error';
      }
      return;
    }

    const file = document.getElementById('project-photo')?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if(message){ message.textContent='Please select an image file.'; message.className='form-message error'; }
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      if(message){ message.textContent='Please use an image smaller than 8 MB.'; message.className='form-message error'; }
      return;
    }

    const title = document.getElementById('project-title')?.value.trim() || '';
    const location = document.getElementById('project-location')?.value.trim() || '';
    const size = document.getElementById('project-size')?.value.trim() || '';
    const savings = document.getElementById('project-savings')?.value.trim() || '';
    const description = document.getElementById('project-description')?.value.trim() || '';

    if (!title) return;

    if (message) {
      message.textContent = 'Uploading project...';
      message.className = 'form-message';
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const filePath = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '-' + safeName;

    const { error: uploadError } = await supabaseClient.storage
      .from(PROJECT_BUCKET)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      if(message){ message.textContent='❌ Photo upload failed: ' + uploadError.message; message.className='form-message error'; }
      return;
    }

    const { data: publicData } = supabaseClient.storage.from(PROJECT_BUCKET).getPublicUrl(filePath);
    const imageUrl = publicData.publicUrl;

    const { error: insertError } = await supabaseClient.from('projects').insert({
      title,
      location,
      capacity: size,
      description: description + (savings ? ' | Annual Savings: ' + savings : ''),
      image_url: imageUrl
    });

    if (insertError) {
      await supabaseClient.storage.from(PROJECT_BUCKET).remove([filePath]);
      if(message){ message.textContent='❌ Project save failed: ' + insertError.message; message.className='form-message error'; }
      return;
    }

    projectForm.reset();
    if(message){ message.textContent='✅ Project added online successfully.'; message.className='form-message success'; }
    await loadGalleryProjects();
  });
}

window.addEventListener('load', async () => {
  await loadAdminSession();
  await loadGalleryProjects();
});
