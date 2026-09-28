// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('#nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Solar Savings Calculator
const monthlyBillInput = document.getElementById('monthly-bill');
const monthlyBillSlider = document.getElementById('monthly-bill-slider');
const billValueSpan = document.getElementById('bill-value');
const systemSizeSelect = document.getElementById('system-size');
const electricityRateInput = document.getElementById('electricity-rate');

// Sync input and slider
monthlyBillInput.addEventListener('input', (e) => {
  monthlyBillSlider.value = e.target.value;
  billValueSpan.textContent = e.target.value;
});

monthlyBillSlider.addEventListener('input', (e) => {
  monthlyBillInput.value = e.target.value;
  billValueSpan.textContent = e.target.value;
});

function calculateSavings() {
  const monthlyBill = parseFloat(monthlyBillInput.value) || 0;
  const systemSize = parseFloat(systemSizeSelect.value) || 3;
  const electricityRate = parseFloat(electricityRateInput.value) || 8;

  if (monthlyBill <= 0 || electricityRate <= 0) {
    alert('Please enter valid values');
    return;
  }

  // Calculate annual production (assuming 1kW produces ~1200 kWh/year in India)
  const annualProduction = systemSize * 1200;

  // Calculate annual savings
  const annualSavings = annualProduction * electricityRate;

  // Calculate 5-year savings
  const fiveYearSavings = annualSavings * 5;

  // Estimate system cost (approximately ₹70,000 to ₹80,000 per kW)
  const estimatedCost = systemSize * 75000;

  // Calculate payback period
  const paybackPeriod = (estimatedCost / annualSavings).toFixed(1);

  // Display results
  document.getElementById('annual-production').textContent = annualProduction.toLocaleString('en-IN');
  document.getElementById('annual-savings').textContent = Math.round(annualSavings).toLocaleString('en-IN');
  document.getElementById('five-year-savings').textContent = Math.round(fiveYearSavings).toLocaleString('en-IN');
  document.getElementById('payback-period').textContent = paybackPeriod;

  // Add animation to results
  document.querySelectorAll('.result-item').forEach((item, index) => {
    item.style.animation = 'none';
    setTimeout(() => {
      item.style.animation = 'fadeInUp 0.6s ease-out ' + (index * 0.1) + 's both';
    }, 10);
  });
}

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function updateCarousel() {
  const track = document.querySelector('.carousel-track');
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Update indicators
  indicators.forEach((indicator, index) => {
    indicator.classList.remove('active');
    if (index === currentSlide) {
      indicator.classList.add('active');
    }
  });
}

function moveCarousel(direction) {
  currentSlide += direction;

  if (currentSlide >= totalSlides) {
    currentSlide = 0;
  } else if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  }

  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

// Auto-rotate carousel every 5 seconds
setInterval(() => {
  moveCarousel(1);
}, 5000);

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

function submitForm(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    location: document.getElementById('location').value,
    consumption: document.getElementById('monthly-consumption').value,
    property_type: document.getElementById('property-type').value,
    message: document.getElementById('message').value,
    timestamp: new Date().toISOString()
  };

  // Validate phone number
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
    showFormMessage('Please enter a valid 10-digit phone number', 'error');
    return;
  }

  // Validate consumption
  if (formData.consumption <= 0) {
    showFormMessage('Please enter valid electricity consumption', 'error');
    return;
  }

  // Store in localStorage as backup
  localStorage.setItem('lastQuotationRequest', JSON.stringify(formData));

  // Show success message
  showFormMessage(
    '✅ Request received! We will contact you soon. You can also WhatsApp us directly for faster response.',
    'success'
  );

  // Create WhatsApp message
  const whatsappMessage = `Hello Swamini Green Energy,\n\nName: ${formData.name}\nPhone: ${formData.phone}\nLocation: ${formData.location}\nMonthly Consumption: ${formData.consumption} kWh\nProperty Type: ${formData.property_type}\n\nPlease send me a solar quotation.\n\n${formData.message ? 'Additional Details: ' + formData.message : ''}`;

  const whatsappLink = `https://wa.me/919284081148?text=${encodeURIComponent(whatsappMessage)}`;

  // Show WhatsApp button
  setTimeout(() => {
    formMessage.innerHTML = `
      <p>✅ Request received successfully!</p>
      <p>We'll contact you soon on <strong>${formData.phone}</strong></p>
      <p>For faster response, you can also:</p>
      <a href="${whatsappLink}" target="_blank" class="btn whatsapp" style="display: inline-block; margin-top: 10px;">
        💬 Send via WhatsApp
      </a>
    `;
  }, 500);

  // Reset form
  setTimeout(() => {
    contactForm.reset();
    setTimeout(() => {
      formMessage.innerHTML = '';
      formMessage.className = 'form-message';
    }, 3000);
  }, 3000);
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = 'form-message ' + type;
  formMessage.style.display = 'block';

  if (type === 'error') {
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 4000);
  }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add scroll animation to cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card, .testimonial-card, .gallery-item').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(card);
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section');

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// Initialize calculator with first calculation
window.addEventListener('load', () => {
  calculateSavings();
});

// Prevent default form submission behavior for traditional submit
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  submitForm(e);
  return false;
});

console.log('✅ Swamini Green Energy website loaded successfully!');