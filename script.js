let palettesGenerated = 0;
let colorsClicked = 0;

// Generate random hex color
function generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// Generate color with specific hue range
function generateColorInRange(hueMin, hueMax, satMin = 50, satMax = 100, lightMin = 40, lightMax = 80) {
    const hue = Math.floor(Math.random() * (hueMax - hueMin + 1)) + hueMin;
    const sat = Math.floor(Math.random() * (satMax - satMin + 1)) + satMin;
    const light = Math.floor(Math.random() * (lightMax - lightMin + 1)) + lightMin;
    return hslToHex(hue, sat, light);
}

// Convert HSL to HEX
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Create color card
function createColorCard(color, index) {
    const card = document.createElement('div');
    card.className = 'color-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="color-display" style="background-color: ${color}"></div>
        <div class="color-info">
            <div class="color-code">${color.toUpperCase()}</div>
            <div class="copy-hint">Click to copy!</div>
        </div>
    `;
    
    card.addEventListener('click', () => copyToClipboard(color));
    return card;
}

// Copy color to clipboard
async function copyToClipboard(color) {
    try {
        await navigator.clipboard.writeText(color);
        showNotification();
        colorsClicked++;
        updateStats();
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = color;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification();
        colorsClicked++;
        updateStats();
    }
}

// Show notification
function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Update statistics
function updateStats() {
    document.getElementById('palettesGenerated').textContent = palettesGenerated;
    document.getElementById('colorsClicked').textContent = colorsClicked;
}

// Display palette
function displayPalette(colors) {
    const container = document.getElementById('paletteContainer');
    container.innerHTML = '';
    
    colors.forEach((color, index) => {
        const card = createColorCard(color, index);
        container.appendChild(card);
    });
    
    palettesGenerated++;
    updateStats();
}

// Generate random palette
function generateRandomPalette() {
    const colors = [];
    for (let i = 0; i < 5; i++) {
        colors.push(generateRandomColor());
    }
    displayPalette(colors);
}

// Generate warm palette
function generateWarmPalette() {
    const colors = [];
    const warmRanges = [
        [0, 30],    // Red-Orange
        [30, 60],   // Orange-Yellow
        [300, 360]  // Red-Pink
    ];
    
    for (let i = 0; i < 5; i++) {
        const range = warmRanges[Math.floor(Math.random() * warmRanges.length)];
        colors.push(generateColorInRange(range[0], range[1]));
    }
    displayPalette(colors);
}

// Generate cool palette
function generateCoolPalette() {
    const colors = [];
    const coolRanges = [
        [180, 240], // Blue-Cyan
        [240, 300], // Blue-Purple
        [120, 180]  // Green-Cyan
    ];
    
    for (let i = 0; i < 5; i++) {
        const range = coolRanges[Math.floor(Math.random() * coolRanges.length)];
        colors.push(generateColorInRange(range[0], range[1]));
    }
    displayPalette(colors);
}

// Generate monochrome palette
function generateMonochrome() {
    const baseHue = Math.floor(Math.random() * 360);
    const colors = [];
    
    for (let i = 0; i < 5; i++) {
        const lightness = 20 + (i * 15); // Vary lightness from dark to light
        colors.push(hslToHex(baseHue, 70, lightness));
    }
    displayPalette(colors);
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        generateRandomPalette();
    }
});

// Add some floating particles for extra visual appeal
function createFloatingParticles() {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${5 + Math.random() * 5}s linear infinite;
            left: ${Math.random() * 100}vw;
            animation-delay: ${Math.random() * 5}s;
            z-index: -1;
        `;
        document.body.appendChild(particle);
    }
}

// Initialize the application
function init() {
    generateRandomPalette();
    createFloatingParticles();
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}