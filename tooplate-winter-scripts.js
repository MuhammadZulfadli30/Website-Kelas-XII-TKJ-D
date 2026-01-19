const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
   navLinks.classList.toggle('active');
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
   link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
         targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
         });

         // Close mobile menu if open
         navLinks.classList.remove('active');
      }
   });
});

// Logo click handler
document.querySelector('.logo').addEventListener('click', (e) => {
   e.preventDefault();
   document.querySelector('#home').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
   });
   navLinks.classList.remove('active');
});

// Scroll spy for active menu states
const sections = document.querySelectorAll('section[id]');
const navLinksArray = document.querySelectorAll('.nav-links a');

function setActiveLink() {
   let currentSection = '';

   sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
         currentSection = section.getAttribute('id');
      }
   });

   navLinksArray.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
         link.classList.add('active');
      }
   });
}

window.addEventListener('scroll', setActiveLink);
setActiveLink(); // Set initial active state

// Filter Functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

// Initialize with Family category displayed
function initializeGallery() {
   galleryItems.forEach(item => {
      if (item.getAttribute('data-category') === 'family') {
         item.style.display = 'block';
      } else {
         item.style.display = 'none';
      }
   });
}

initializeGallery();

filterBtns.forEach(btn => {
   btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
         if (item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            // Re-trigger animation
            item.style.animation = 'none';
            setTimeout(() => {
               item.style.animation = 'fadeInUp 0.6s ease forwards';
            }, 10);
         } else {
            item.style.display = 'none';
         }
      });
   });
});

// Lightbox Functionality
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCategory = document.getElementById('lightboxCategory');
const closeLightbox = document.getElementById('closeLightbox');
const prevImage = document.getElementById('prevImage');
const nextImage = document.getElementById('nextImage');

let currentImageIndex = 0;
let visibleImages = [];

function updateVisibleImages() {
   visibleImages = Array.from(galleryItems).filter(item =>
      item.style.display !== 'none'
   );
}

galleryItems.forEach((item, index) => {
   item.addEventListener('click', () => {
      updateVisibleImages();
      currentImageIndex = visibleImages.indexOf(item);
      openLightbox(item);
   });
});

function openLightbox(item) {
   const img = item.querySelector('img');
   const title = item.querySelector('.gallery-title');
   const category = item.querySelector('.gallery-category');

   lightboxImage.src = img.src;
   lightboxImage.alt = img.alt;
   lightboxTitle.textContent = title.textContent;
   lightboxCategory.textContent = category.textContent;

   lightbox.classList.add('active');
   document.body.style.overflow = 'hidden';
}

closeLightbox.addEventListener('click', () => {
   lightbox.classList.remove('active');
   document.body.style.overflow = 'auto';
});

lightbox.addEventListener('click', (e) => {
   if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
   }
});

prevImage.addEventListener('click', () => {
   currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
   openLightbox(visibleImages[currentImageIndex]);
});

nextImage.addEventListener('click', () => {
   currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
   openLightbox(visibleImages[currentImageIndex]);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
   if (!lightbox.classList.contains('active')) return;

   if (e.key === 'Escape') {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
   } else if (e.key === 'ArrowLeft') {
      prevImage.click();
   } else if (e.key === 'ArrowRight') {
      nextImage.click();
   }
});

// Initialize visible images
updateVisibleImages();

// Contact form submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
   e.preventDefault();

   // Get form data
   const formData = new FormData(contactForm);
   const name = formData.get('name');

   // Show success message (in real implementation, this would send to a server)
   alert(`Thank you ${name}! Your message has been sent. We will get back to you soon.`);

   // Reset form
   contactForm.reset();
});

const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');
let bubbles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Membuat bubble dengan properti acak
function createBubble() {
  const x = Math.random() * canvas.width;
  const y = canvas.height + Math.random() * 100;
  const radius = Math.random() * 20 + 10;
  const speed = Math.random() * 1 + 0.5;
  const opacity = Math.random() * 0.5 + 0.3;
  const hue = 20 + Math.random() * 30; // antara orange ke merah
  bubbles.push({ x, y, radius, speed, opacity, hue });
}

// Loop animasi bubble
function animateBubbles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Tambahkan bubble baru secara acak
  if (Math.random() < 0.1 && bubbles.length < 100) createBubble();

  // Update dan gambar setiap bubble
  for (let i = 0; i < bubbles.length; i++) {
    const b = bubbles[i];
    b.y -= b.speed;
    b.x += Math.sin(b.y / 20) * 0.5; // sedikit goyangan horizontal

    ctx.beginPath();
    const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
    gradient.addColorStop(0, `hsla(${b.hue}, 100%, 60%, ${b.opacity})`);
    gradient.addColorStop(1, `hsla(${b.hue}, 100%, 60%, 0)`);
    ctx.fillStyle = gradient;
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();

    // Hapus bubble yang sudah keluar dari layar
    if (b.y + b.radius < 0) {
      bubbles.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animateBubbles);
}

// Jalankan animasi
animateBubbles();

  const scriptURL = 'https://script.google.com/macros/s/AKfycbx_tmLLb47D2LMO77P2C8DtPvnhaPPCPoJimmk5oZCRD8QBl7vH7-dCkNt2yiuqZYGc/exec';
  const form = document.forms['message-for-zul'];
  const btnKirim = document.querySelector('.btn-kirim');
  const btnLoading = document.querySelector('.btn-loading');
  const myAlert = document.querySelector('.my-alert');

  form.addEventListener('submit', e => {
    e.preventDefault();
    // ketika tombol submit diklik
    // tampilkan tombol loading, hilangkan tombol kirim
    btnLoading.classList.toggle('d-none');
    btnKirim.classList.toggle('d-none');
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => {
        // tampilkan tombol kirim, hilangkan tombol loading
        btnLoading.classList.toggle('d-none');   
        btnKirim.classList.toggle('d-none');
        // tampilkan alert
        myAlert.classList.toggle('d-none');
        // reset form
        form.reset();
        console.log('Success!', response)
      })
      .catch(error => console.error('Error!', error.message));
  });