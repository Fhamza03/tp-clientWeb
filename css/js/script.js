document.addEventListener('DOMContentLoaded', () => {
  const toggleButtons = document.querySelectorAll('.toggle-btn');

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const details = button.nextElementSibling;

      if (details && details.classList.contains('details')) {
        details.classList.toggle('show');

        button.textContent = details.classList.contains('show')
          ? '− Masquer'
          : '+ Détails';
      }
    });
  });
});

