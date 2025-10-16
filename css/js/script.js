document.addEventListener('DOMContentLoaded', () => {
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const details = button.nextElementSibling;
      if (!details || !details.classList.contains('details')) return;
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

  const skills = document.querySelectorAll("dd span[data-description]");
  const tooltip = document.getElementById("tooltip");

  if (!tooltip) {
    console.error("Élément #tooltip introuvable dans le DOM !");
    return;
  }

  tooltip.style.position = "absolute";
  tooltip.style.pointerEvents = "none";
  tooltip.style.opacity = "0";
  tooltip.style.display = "none";
  tooltip.style.transition = "opacity 0.25s ease, transform 0.2s ease";

  skills.forEach(skill => {
    skill.addEventListener("mouseenter", (e) => {
      const desc = skill.getAttribute("data-description") || "";
      tooltip.textContent = desc;
      tooltip.style.display = "block";
      tooltip.classList.add("show");
      tooltip.style.opacity = "1";
    });

    skill.addEventListener("mousemove", (e) => {
      const offset = 20;
      tooltip.style.left = `${e.pageX + offset}px`;
      tooltip.style.top = `${e.pageY + offset}px`;
    });

    skill.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
      tooltip.style.opacity = "0";
      setTimeout(() => {
        tooltip.style.display = "none";
      }, 250);
    });
  });
});
