function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
function sendForm() {
  const n = document.getElementById('nombre').value.trim();
  const em = document.getElementById('email').value.trim();
  if (!n || !em) { alert('Por favor, rellena al menos nombre y email.'); return; }
  document.getElementById('formFields').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
}