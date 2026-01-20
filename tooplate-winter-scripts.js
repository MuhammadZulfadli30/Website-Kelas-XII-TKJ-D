// tooplate-winter-scripts.js (FINAL - popup kiri bawah + Bahasa Indonesia)
// defensive checks sehingga runtime error tidak menghentikan skrip dan listener form selalu terpasang

// NAV MENU
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
}

// Smooth scroll untuk tautan navigasi
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navLinks && navLinks.classList.remove('active');
    }
  });
});

// Logo: klik kembali ke atas (guard)
const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    const home = document.querySelector('#home');
    if (home) home.scrollIntoView({ behavior: 'smooth', block: 'start' });
    navLinks && navLinks.classList.remove('active');
  });
}

// Scroll spy untuk state menu aktif (guard sections)
const sections = document.querySelectorAll('section[id]');
const navLinksArray = document.querySelectorAll('.nav-links a');
function setActiveLink() {
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 200) {
      currentSection = section.getAttribute('id');
    }
  });
  navLinksArray.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) link.classList.add('active');
  });
}
window.addEventListener('scroll', setActiveLink);
setActiveLink();

// FILTER + GALLERY
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

function initializeGallery() {
  galleryItems.forEach(item => {
    item.style.display = (item.getAttribute('data-category') === 'family') ? 'block' : 'none';
  });
}
if (galleryItems.length) initializeGallery();

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filterValue = btn.getAttribute('data-filter');
    galleryItems.forEach(item => {
      if (item.getAttribute('data-category') === filterValue) {
        item.style.display = 'block';
        item.style.animation = 'none';
        setTimeout(() => item.style.animation = 'fadeInUp 0.6s ease forwards', 10);
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// LIGHTBOX (guard elements)
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
  visibleImages = Array.from(galleryItems).filter(item => item.style.display !== 'none');
}

if (galleryItems.length) {
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      updateVisibleImages();
      currentImageIndex = visibleImages.indexOf(item);
      openLightbox(item);
    });
  });
}

function openLightbox(item) {
  if (!lightbox || !lightboxImage) return;
  const img = item.querySelector('img');
  const title = item.querySelector('.gallery-title');
  const category = item.querySelector('.gallery-category');
  lightboxImage.src = img ? img.src : '';
  lightboxImage.alt = img ? img.alt : '';
  lightboxTitle && (lightboxTitle.textContent = title ? title.textContent : '');
  lightboxCategory && (lightboxCategory.textContent = category ? category.textContent : '');
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

if (closeLightbox) closeLightbox.addEventListener('click', () => { lightbox && lightbox.classList.remove('active'); document.body.style.overflow = 'auto'; });
if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) { lightbox.classList.remove('active'); document.body.style.overflow = 'auto'; }});
if (prevImage) prevImage.addEventListener('click', () => { currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length; openLightbox(visibleImages[currentImageIndex]); });
if (nextImage) nextImage.addEventListener('click', () => { currentImageIndex = (currentImageIndex + 1) % visibleImages.length; openLightbox(visibleImages[currentImageIndex]); });

// Keyboard navigation untuk lightbox
document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') { lightbox.classList.remove('active'); document.body.style.overflow = 'auto'; }
  else if (e.key === 'ArrowLeft') prevImage && prevImage.click();
  else if (e.key === 'ArrowRight') nextImage && nextImage.click();
});
updateVisibleImages();

// BUBBLE CANVAS (jalankan hanya jika elemen ada)
(function initBubbles(){
  const canvas = document.getElementById('bubbleCanvas');
  if (!canvas) return; // sangat penting guard
  const ctx = canvas.getContext('2d');
  let bubbles = [];
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas(); window.addEventListener('resize', resizeCanvas);
  function createBubble() {
    const x = Math.random() * canvas.width;
    const y = canvas.height + Math.random() * 100;
    const radius = Math.random() * 20 + 10;
    const speed = Math.random() * 1 + 0.5;
    const opacity = Math.random() * 0.5 + 0.3;
    const hue = 20 + Math.random() * 30;
    bubbles.push({ x, y, radius, speed, opacity, hue });
  }
  function animateBubbles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() < 0.1 && bubbles.length < 100) createBubble();
    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      b.y -= b.speed;
      b.x += Math.sin(b.y / 20) * 0.5;
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
      gradient.addColorStop(0, `hsla(${b.hue}, 100%, 60%, ${b.opacity})`);
      gradient.addColorStop(1, `hsla(${b.hue}, 100%, 60%, 0)`);
      ctx.fillStyle = gradient;
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      if (b.y + b.radius < 0) { bubbles.splice(i, 1); i--; }
    }
    requestAnimationFrame(animateBubbles);
  }
  animateBubbles();
})();


// supabase
const SUPABASE_URL = 'https://wwoysktvtohacfbmtzwu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3b3lza3R2dG9oYWNmYm10end1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MzczNzQsImV4cCI6MjA4NDQxMzM3NH0.koWcMh2gKGEgvOsiG0RTB3V1vSI60wF-bnJ4lgzhWa4'; // tetap di file sesuai asli

// inisialisasi supabase client
const createClient = (window.supabase && window.supabase.createClient) ? window.supabase.createClient
  : (window.supabaseJs && window.supabaseJs.createClient) ? window.supabaseJs.createClient
  : null;

if (!createClient) {
  console.error('Client Supabase tidak ditemukan. Pastikan CDN <script> dimuat sebelum file ini.');
}

const supabaseClient = createClient ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// handler form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms['message-for-zul'];
  if (!form) { console.warn("Form 'message-for-zul' tidak ditemukan."); return; }

  const formModal = document.getElementById('formModal');
  const modalIcon = formModal ? document.getElementById('modalIcon') : null;
  const modalTitle = formModal ? document.getElementById('modalTitle') : null;
  const modalText = formModal ? document.getElementById('modalText') : null;
  const modalCloseBtn = formModal ? document.getElementById('modalCloseBtn') : null;
  const modalButtonsWrapper = document.getElementById('modalButtons');
  // modalBackdrop disimpan untuk kompatibilitas, tapi tidak dipakai sebagai overlay blocking
  const modalBackdrop = document.getElementById('modalBackdrop');

  let autoHideTimer = null;
  let modalMode = null;
  let lastFocusedElement = null;

  // tampilkan toast di kiri bawah, auto-hide 5 detik
  function showModal(mode = 'loading', title = '', text = '') {
    if (!formModal) return;
    modalMode = mode;

    // isi & kelas
    formModal.classList.remove('loading','success','error','hide');
    formModal.classList.add(mode);
    modalIcon && (modalIcon.textContent = mode === 'loading' ? '⏳' : (mode === 'success' ? '✅' : '❌'));
    modalTitle && (modalTitle.textContent = title);
    modalText && (modalText.textContent = text);

    // sembunyikan tombol close
    if (modalButtonsWrapper) modalButtonsWrapper.style.display = 'none';

    // tampilkan toast
    formModal.classList.add('show');

    // fokus & simpan elemen sebelumnya
    lastFocusedElement = document.activeElement;

    // reset timer
    if (autoHideTimer) { clearTimeout(autoHideTimer); autoHideTimer = null; }
    autoHideTimer = setTimeout(() => {
      hideModal(true);
    }, 5000); // 5 detik
  }

  // sembunyikan toast dengan animasi
  function hideModal(force = false) {
    if (!formModal) return;
    if (modalMode === 'loading' && !force) return;
    // animasi keluar
    formModal.classList.remove('show');
    formModal.classList.add('hide');

    // hapus kelas setelah animasi selesai
    setTimeout(() => {
      formModal.classList.remove('hide','loading','success','error');
    }, 240);

    if (autoHideTimer) { clearTimeout(autoHideTimer); autoHideTimer = null; }

    // kembalikan fokus ke elemen sebelumnya bila ada
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      try { lastFocusedElement.focus(); } catch(e) {}
      lastFocusedElement = null;
    }
  }

  // Handler tombol close
  modalCloseBtn && modalCloseBtn.addEventListener('click', () => hideModal(true));

  document.addEventListener('keydown', (ev) => {
    if (!formModal || !formModal.classList.contains('show')) return;
    if (ev.key === 'Escape') {
      if (modalMode !== 'loading') hideModal(true);
    }
  });

  // Handler submit form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Handler submit terpicu');

    if (!supabaseClient) { alert('Client Supabase belum diinisialisasi'); return; }

    const submitBtn = form.querySelector('button[type="submit"], .btn-kirim, .submit-btn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.orig = submitBtn.textContent; submitBtn.textContent = 'Mengirim...'; }

    // honeypot opsional
    const honeypot = form.querySelector('input[name="mobile_number"]');
    if (honeypot && honeypot.value) {
      showModal('error','Gagal','Terdeteksi bot (honeypot).');
      submitBtn && (submitBtn.disabled=false, submitBtn.textContent=submitBtn.dataset.orig);
      return;
    }

    const name = (form.querySelector('input[name="name"]')||{}).value?.trim() || '';
    const email = (form.querySelector('input[name="email"]')||{}).value?.trim() || '';
    const message = (form.querySelector('textarea[name="message"]')||{}).value?.trim() || '';

    if (!name || !email || !message) {
      showModal('error','Lengkapi Form','Nama, surel, dan pesan wajib diisi.');
      submitBtn && (submitBtn.disabled=false, submitBtn.textContent=submitBtn.dataset.orig);
      return;
    }

    showModal('loading','Mengirim...','Mengirim data ke server.');

    try {
      const { data, error } = await supabaseClient.from('form_tkjd').insert([{ name, email, message }]);
      console.log('Respon Supabase', { data, error });
      if (error) {
        showModal('error','Gagal', error.message || JSON.stringify(error));
      } else {
        showModal('success','Berhasil','Pesan terkirim. Terima kasih!');
        form.reset();
      }
    } catch (err) {
      console.error('Kesalahan tak terduga:', err);
      showModal('error','Gagal','Kesalahan jaringan: ' + (err.message||err));
    } finally {
      submitBtn && (submitBtn.disabled=false, submitBtn.textContent=submitBtn.dataset.orig || 'Kirim Pesan');
    }
  });
});
