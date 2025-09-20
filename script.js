document.addEventListener('DOMContentLoaded', () => {

  // ============== Sticky Header on Scroll ==============
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ============== Burger Menu Jdid ==============
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav__links');
  const mainContent = document.getElementById('main-content');
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    burger.setAttribute('aria-expanded', burger.classList.contains('active'));
    navLinks.classList.toggle('show');
    mainContent.classList.toggle('blurred');
  });

  // ============== Active Nav Link on Scroll ==============
  const sections = document.querySelectorAll('section[id]');
  const navLi = document.querySelectorAll('.nav__links a.nav__link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 75) {
        current = section.getAttribute('id');
      }
    });

    let foundActive = false;
    navLi.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href').includes(current)) {
        a.classList.add('active');
        foundActive = true;
      }
    });

    // Fallback for footer
    if (!foundActive && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        const contactLink = document.querySelector('a.nav__link[href="#footer"]');
        if(contactLink) contactLink.classList.add('active');
    }
  });

  // ============== Gallery Filtering ==============
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery__item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.dataset.filter;
      
      galleryItems.forEach((item, index) => {
        item.style.display = 'none';
        if (item.dataset.category === filterValue || filterValue === '*') {
          item.style.animation = `fadeIn 0.5s forwards ${index * 0.05}s`;
          item.style.display = 'block';
        }
      });
    });
  });
  
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `@keyframes fadeIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`;
  document.head.appendChild(styleSheet);

  // ============== Reveal on Scroll Animation ==============
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => { observer.observe(el); });

  // ============== FIX: Netlify Form Submission ==============
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  const handleSubmit = (event) => {
    event.preventDefault();
    const myForm = event.target;
    const formData = new FormData(myForm);
    const submitBtn = myForm.querySelector('button[type="submit"]');
    
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
    .then(() => {
        formMessage.textContent = 'Merci! Votre message a été envoyé avec succès.';
        formMessage.className = 'form-message success';
        formMessage.style.opacity = '1';
        
        submitBtn.textContent = 'Envoyer le Message';
        submitBtn.disabled = false;
        myForm.reset();

        setTimeout(() => { formMessage.style.opacity = '0'; }, 5000);
    })
    .catch((error) => {
        formMessage.textContent = 'Erreur! Veuillez réessayer plus tard.';
        formMessage.className = 'form-message error';
        formMessage.style.opacity = '1';

        submitBtn.textContent = 'Envoyer le Message';
        submitBtn.disabled = false;

        setTimeout(() => { formMessage.style.opacity = '0'; }, 5000);
    });
  };

  contactForm.addEventListener("submit", handleSubmit);
});

// ============== GLightbox Initialisation ==============
const lightbox = GLightbox({
  selector: '.glightbox',
  touchNavigation: true,
  loop: true,
});