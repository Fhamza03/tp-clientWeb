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

    if (tooltip) {
        tooltip.style.position = "absolute";
        tooltip.style.pointerEvents = "none";
        tooltip.style.opacity = "0";
        tooltip.style.display = "none";
        
        const positionTooltip = (e) => {
            const offset = 15; 
            let x = e.pageX + offset;
            let y = e.pageY + offset;
            if (x + tooltip.offsetWidth > window.innerWidth) {
                x = e.pageX - tooltip.offsetWidth - offset;
            }
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        };

        skills.forEach(skill => {
            skill.addEventListener("mouseenter", (e) => {
                const name = skill.textContent;
                const desc = skill.getAttribute("data-description") || "";
                tooltip.textContent = `${name}: ${desc}`; 
                tooltip.style.display = "block";
                tooltip.classList.add("show");
                positionTooltip(e); 
            });

            skill.addEventListener("mousemove", positionTooltip); 
            skill.addEventListener("mouseleave", () => {
                tooltip.classList.remove("show");
                setTimeout(() => {
                    tooltip.style.display = "none";
                }, 300);
            });
        });
    }

    async function loadAndDrawSkills() {
        let skillsEval = [];
        const dataPath = 'data/skills.json';
        try {
            const response = await fetch(dataPath);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status} lors du chargement de ${dataPath}`);
            }
            skillsEval = await response.json();
        } catch (error) {
            console.error("Impossible de charger les données externes. Le graphique et les étoiles ne seront pas affichés.", error);
            return; 
        }
        renderStarEvaluation(skillsEval);
        drawSkillsChart(skillsEval);
    }
    
    function renderStarEvaluation(skillsEval) {
        const list = document.getElementById("skills-eval");
        if (list) {
            list.innerHTML = '';
            skillsEval.forEach(skill => {
                const li = document.createElement("li");
                li.textContent = skill.name + " : ";
                for (let i = 0; i < 5; i++) {
                    const star = document.createElement("span");
                    star.classList.add("star");
                    star.textContent = i < skill.level ? "★" : "☆"; 
                    li.appendChild(star);
                }
                list.appendChild(li);
            });
        }
    }
    
    function drawSkillsChart(skillsEval) {
        const canvas = document.getElementById("skillsChart");
        if (!canvas || !canvas.getContext) return;

        const ctx = canvas.getContext("2d");
        const W = canvas.width;
        const H = canvas.height;
        
        ctx.clearRect(0, 0, W, H);
        const barColor = "#ffd700";
        const maxLevel = 5;
        const padding = 40;
        const chartW = W - 2 * padding;
        const chartH = H - 2 * padding;
        const barSpacing = 15;
        const barWidth = (chartW / skillsEval.length) - barSpacing;
        
        ctx.strokeStyle = "#ddd"; 
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, H - padding);
        ctx.moveTo(padding, H - padding);
        ctx.lineTo(W - padding, H - padding);
        ctx.stroke();

        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        
        skillsEval.forEach((skill, index) => {
            const barHeightRatio = skill.level / maxLevel;
            const barHeight = chartH * barHeightRatio;
            const x = padding + (index * (barWidth + barSpacing)) + (barSpacing / 2);
            const y = H - padding - barHeight;

            ctx.fillStyle = barColor;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            ctx.fillStyle = "#eee";
            ctx.save();
            ctx.translate(x + barWidth / 2, H - padding + 10);
            ctx.rotate(Math.PI / 4);
            ctx.textAlign = "right";
            ctx.fillText(skill.name, 0, 0);
            ctx.restore();
            
            ctx.fillStyle = "#000"; 
            ctx.textAlign = "center";
            ctx.fillText(skill.level.toString(), x + barWidth / 2, y + 15);
        });

        ctx.fillStyle = "#ffd700";
        ctx.textAlign = "right";
        ctx.fillText("Niveau (5 max)", padding - 5, padding + 10);
        
        for(let i = 1; i <= maxLevel; i++) {
            const levelY = H - padding - (chartH * (i / maxLevel));
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.beginPath();
            ctx.moveTo(padding, levelY);
            ctx.lineTo(W - padding, levelY);
            ctx.stroke();
            ctx.fillStyle = "#ddd";
            ctx.textAlign = "right";
            ctx.fillText(i.toString(), padding - 10, levelY + 5);
        }
    }

    loadAndDrawSkills();
});
