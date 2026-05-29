// Theme Management
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('preferred-theme', theme);
  
  // Update active button (falls vorhanden)
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`.theme-${theme}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('preferred-theme') || 'soft';
  setTheme(savedTheme);
});