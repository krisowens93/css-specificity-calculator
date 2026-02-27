// Theme Toggle
const toggleBtn = document.getElementById('theme-toggle');

toggleBtn.addEventListener('click', function() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        html.setAttribute('data-theme', 'dark');
        toggleBtn.textContent = 'Light Mode';
        toggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
        html.setAttribute('data-theme', 'light');
        toggleBtn.textContent = 'Dark Mode';
        toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
});

// Specificity Calculation
function calculateSpecificity(selector) {
    const aMatches = selector.match(/#[\w-]+/g) || [];
    const a = aMatches.length;

    const selectorWithoutPseudoElements = selector.replace(/::[\w-]+/g, '');

    const pseudoElementMatches = selector.match(/::[\w-]+/g) || [];
    const pseudoElements = pseudoElementMatches.length;

    const classMatches = selectorWithoutPseudoElements.match(/\.[\w-]+/g) || [];
    const classes = classMatches.length;

    const pseudoClassMatches = selectorWithoutPseudoElements.match(/:(?!:)[\w-]+/g) || [];
    const pseudoClasses = pseudoClassMatches.length;

    const b = classes + pseudoClasses;

    const stripped = selectorWithoutPseudoElements
        .replace(/#[\w-]+/g, '')
        .replace(/\.[\w-]+/g, '')
        .replace(/:[\w-]+/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/[^a-zA-Z]/g, ' ')
        .trim();
    const elementMatches = stripped.split(' ').filter(part => part.length > 0);
    const c = pseudoElements + elementMatches.length;

    return {
        score: `${a}-${b}-${c}`,
        aContributors: aMatches,
        bContributors: [...classMatches, ...pseudoClassMatches],
        cContributors: [...pseudoElementMatches, ...elementMatches]
    };
}

function runCalculation() {
    const selector = document.getElementById('selector-input').value;
    
    if (!selector) {
        document.getElementById('result').textContent = 'Please enter a CSS selector.';
        return;
    }

    const validStart = /^[a-zA-Z#.*:\[]/;
    if (!validStart.test(selector)) {
        document.getElementById('result').textContent = 'Please enter a valid CSS selector.';
        return;
    }
    
    const result = calculateSpecificity(selector);
    document.getElementById('result').innerHTML = `
    <p class="score">Score: <span>${result.score}</span></p>
    <div class="cards">
        <div class="card">
            <div class="card-column">A</div>
            <div class="card-label">IDs</div>
            <div class="card-contributors">
                ${result.aContributors.length 
                    ? result.aContributors.map(c => `<span>${c}</span>`).join('') 
                    : 'none'}
            </div>
        </div>
        <div class="card">
            <div class="card-column">B</div>
            <div class="card-label">Classes & Pseudo-classes</div>
            <div class="card-contributors">
                ${result.bContributors.length 
                    ? result.bContributors.map(c => `<span>${c}</span>`).join('') 
                    : 'none'}
            </div>
        </div>
        <div class="card">
            <div class="card-column">C</div>
            <div class="card-label">Elements & Pseudo-elements</div>
            <div class="card-contributors">
                ${result.cContributors.length 
                    ? result.cContributors.map(c => `<span>${c}</span>`).join('') 
                    : 'none'}
            </div>
        </div>
    </div>
`;
}

document.getElementById('calculate-btn').addEventListener('click', runCalculation);

document.getElementById('selector-input').addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        runCalculation();
    }
});