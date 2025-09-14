// Safe theme initialization script
// This prevents flash of unstyled content by setting theme immediately
(function() {
  try {
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    // Fallback to light theme if localStorage is not available
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
