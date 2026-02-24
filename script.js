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
    <p><strong>Score:</strong> ${result.score}</p>
    <p><strong>A (IDs):</strong> ${result.aContributors.join(', ') || 'none'}</p>
    <p><strong>B (Classes/Pseudo-classes):</strong> ${result.bContributors.join(', ') || 'none'}</p>
    <p><strong>C (Elements/Pseudo-elements):</strong> ${result.cContributors.join(', ') || 'none'}</p>
`;
}

document.getElementById('calculate-btn').addEventListener('click', runCalculation);

document.getElementById('selector-input').addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        runCalculation();
    }
});