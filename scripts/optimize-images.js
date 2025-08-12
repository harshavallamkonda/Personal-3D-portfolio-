const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Image optimization script using Sharp
// Converts images to WebP and AVIF formats with fallbacks

const IMAGE_DIR = path.join(__dirname, '..', 'assets', 'images');
const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'assets', 'images');

// Supported formats and their quality settings
const FORMATS = {
    webp: { quality: 80, effort: 6 },
    avif: { quality: 75, effort: 4 },
    jpeg: { quality: 85, progressive: true }
};

// Responsive image sizes
const SIZES = {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200,
    hero: 1920
};

async function optimizeImages() {
    console.log('Starting image optimization...');
    
    try {
        // Ensure output directory exists
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        
        // Get all image files
        const imageFiles = getImageFiles(IMAGE_DIR);
        
        if (imageFiles.length === 0) {
            console.log('No images found to optimize');
            return;
        }
        
        console.log(`Found ${imageFiles.length} images to optimize`);
        
        // Process each image
        for (const imageFile of imageFiles) {
            await processImage(imageFile);
        }
        
        console.log('Image optimization completed successfully!');
        
    } catch (error) {
        console.error('Error optimizing images:', error);
        process.exit(1);
    }
}

function getImageFiles(dir) {
    const files = [];
    
    if (!fs.existsSync(dir)) {
        return files;
    }
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
            files.push(...getImageFiles(itemPath));
        } else if (isImageFile(item)) {
            files.push(itemPath);
        }
    }
    
    return files;
}

function isImageFile(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext);
}

async function processImage(imagePath) {
    const filename = path.basename(imagePath, path.extname(imagePath));
    const relativePath = path.relative(IMAGE_DIR, imagePath);
    const outputSubDir = path.dirname(relativePath);
    
    console.log(`Processing: ${relativePath}`);
    
    try {
        const image = sharp(imagePath);
        const metadata = await image.metadata();
        
        // Create output directory
        const outputPath = path.join(OUTPUT_DIR, outputSubDir);
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }
        
        // Generate responsive sizes
        for (const [sizeName, size] of Object.entries(SIZES)) {
            if (metadata.width > size) {
                await generateResponsiveImage(image, filename, sizeName, size, outputPath);
            }
        }
        
        // Generate optimized formats
        await generateFormats(image, filename, outputPath);
        
        console.log(`✓ Completed: ${relativePath}`);
        
    } catch (error) {
        console.error(`✗ Error processing ${relativePath}:`, error);
    }
}

async function generateResponsiveImage(image, filename, sizeName, size, outputPath) {
    const resizedImage = image.resize(size, null, {
        withoutEnlargement: true,
        fit: 'inside'
    });
    
    // Generate WebP version
    await resizedImage
        .webp(FORMATS.webp)
        .toFile(path.join(outputPath, `${filename}-${sizeName}.webp`));
    
    // Generate AVIF version
    await resizedImage
        .avif(FORMATS.avif)
        .toFile(path.join(outputPath, `${filename}-${sizeName}.avif`));
    
    // Generate JPEG fallback
    await resizedImage
        .jpeg(FORMATS.jpeg)
        .toFile(path.join(outputPath, `${filename}-${sizeName}.jpg`));
}

async function generateFormats(image, filename, outputPath) {
    // Generate WebP
    await image
        .webp(FORMATS.webp)
        .toFile(path.join(outputPath, `${filename}.webp`));
    
    // Generate AVIF
    await image
        .avif(FORMATS.avif)
        .toFile(path.join(outputPath, `${filename}.avif`));
    
    // Generate optimized JPEG
    await image
        .jpeg(FORMATS.jpeg)
        .toFile(path.join(outputPath, `${filename}.jpg`));
}

// Generate srcset HTML for responsive images
function generateSrcsetHTML(imagePath, filename) {
    const srcset = [];
    
    for (const [sizeName, size] of Object.entries(SIZES)) {
        srcset.push(`/assets/images/${filename}-${sizeName}.webp ${size}w`);
    }
    
    return srcset.join(', ');
}

// Run if called directly
if (require.main === module) {
    optimizeImages();
}

module.exports = { optimizeImages, generateSrcsetHTML };