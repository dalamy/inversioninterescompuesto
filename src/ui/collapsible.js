export const makeCollapsible = () => {
    const controls = document.getElementById('mainControls');
    if (!controls) return;

    const controlsArray = Array.from(controls.children);
    const sections = [];

    const basicParams = controlsArray.slice(0, 5).map((element) => element.outerHTML).join('');
    sections.push({ title: 'Parámetros Básicos', content: basicParams, isOpen: true });

    for (let i = 5; i < controlsArray.length; i += 1) {
        const element = controlsArray[i];
        const h3 = element.querySelector('h3');
        if (h3) {
            sections.push({
                title: h3.textContent.trim(),
                content: element.outerHTML,
                isOpen: i < 8,
            });
        }
    }

    controls.innerHTML = '';

    sections.forEach((section, index) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'collapsible-section';
        sectionDiv.innerHTML = `
            <button class="collapsible-header" type="button" data-section-index="${index}">
                <h3>${section.title}</h3>
                <span class="collapsible-arrow ${section.isOpen ? 'open' : ''}">▼</span>
            </button>
            <div class="collapsible-content ${section.isOpen ? 'open' : ''}">
                <div class="collapsible-inner">
                    ${section.content}
                </div>
            </div>
        `;
        controls.appendChild(sectionDiv);
    });

    controls.addEventListener('click', (event) => {
        const header = event.target.closest('.collapsible-header');
        if (!header) return;
        const section = header.closest('.collapsible-section');
        const content = section.querySelector('.collapsible-content');
        const arrow = section.querySelector('.collapsible-arrow');
        content.classList.toggle('open');
        arrow.classList.toggle('open');
    });
};
