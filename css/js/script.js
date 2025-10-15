document.addEventListener('DOMContentLoaded', () => {
  const toggleButtons = document.querySelectorAll('.toggle-btn');

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const details = button.nextElementSibling;

      document.querySelectorAll('.details.show').forEach((openDetail) => {
        if (openDetail !== details) {
          openDetail.classList.remove('show');
          const btn = openDetail.previousElementSibling;
          if (btn && btn.classList.contains('toggle-btn')) {
            btn.textContent = '+ Détails';
          }
        }
      });

      const isVisible = details.classList.toggle('show');
      button.textContent = isVisible ? '− Masquer' : '+ Détails';
    });
  });
});
