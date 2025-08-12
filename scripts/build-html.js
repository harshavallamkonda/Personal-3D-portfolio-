const fs = require('fs');
const path = require('path');

// Simple HTML build script
// In a production environment, you might want to use a more robust solution
// like gulp-htmlmin or similar

function buildHTML() {
    console.log('Building HTML...');
    
    try {
        // Read the source HTML
        const htmlPath = path.join(__dirname, '..', 'index.html');
        let html = fs.readFileSync(htmlPath, 'utf8');
        
        // Basic optimizations
        html = html
            .replace(/\s+/g, ' ') // Remove extra whitespace
            .replace(/>\s+</g, '><') // Remove whitespace between tags
            .trim();
        
        // Write optimized HTML
        const outputPath = path.join(__dirname, '..', 'dist', 'index.html');
        
        // Ensure dist directory exists
        const distDir = path.dirname(outputPath);
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, html);
        console.log('HTML built successfully to dist/index.html');
        
    } catch (error) {
        console.error('Error building HTML:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    buildHTML();
}

module.exports = { buildHTML };