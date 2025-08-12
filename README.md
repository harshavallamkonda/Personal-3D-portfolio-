# Harsha Vallamkonda - Portfolio Website

A production-ready, ultra-high-performance personal portfolio website featuring advanced 3D transitions, GSAP animations, and optimized performance for Core Web Vitals.

## 🚀 Features

- **3D WebGL Hero Scene** - Interactive Three.js particle system with fallback CSS animations
- **Performance Optimized** - 95+ Lighthouse scores, optimized Core Web Vitals
- **Progressive Web App** - Installable, offline-capable with service worker
- **Mobile First** - Fully responsive design with touch-friendly interactions
- **SEO Optimized** - Structured data, sitemap, and meta tags
- **Accessibility** - WCAG compliant with keyboard navigation and screen reader support
- **Serverless Backend** - Contact form, geolocation, and weather APIs
- **Modern Tech Stack** - Vanilla JS, Three.js, GSAP, SCSS

## 🎯 Performance Targets

- **Lighthouse Performance**: ≥95 (Desktop & Mobile)
- **Core Web Vitals**: LCP ≤2.5s, CLS ≤0.1, INP ≤200ms
- **Bundle Size**: <150KB (gzipped)
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.5s

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup with accessibility features
- **SCSS** - Advanced CSS with variables and mixins
- **Vanilla JavaScript** - ES6+ with modern APIs
- **Three.js** - 3D graphics and WebGL rendering
- **GSAP** - High-performance animations and timelines

### Backend & APIs
- **Netlify Functions** - Serverless backend for contact form and APIs
- **Geolocation API** - IP-based location detection
- **OpenWeatherMap API** - Weather data integration
- **Email Service** - SendGrid/Postmark integration

### Build & Deployment
- **esbuild** - Fast JavaScript bundling and minification
- **Sass** - CSS preprocessing and optimization
- **Netlify/Cloudflare Pages** - Static hosting with CDN
- **Service Worker** - PWA functionality and offline support

## 📁 Project Structure

```
harsha-portfolio/
├── index.html              # Main HTML file with critical CSS inlined
├── styles/
│   └── main.scss          # Main SCSS file with all styling
├── scripts/
│   └── main.js            # Main JavaScript with Three.js and animations
├── three/                  # Three.js specific components
├── serverless/             # Netlify functions
│   ├── contact.js         # Contact form handler
│   ├── geolocation.js     # Geolocation API
│   └── weather.js         # Weather API
├── assets/                 # Images, icons, and media files
├── sw.js                  # Service worker for PWA
├── manifest.json          # PWA manifest
├── robots.txt             # SEO crawling instructions
├── sitemap.xml            # XML sitemap
├── performance-budget.json # Performance targets
├── .env.example           # Environment variables template
└── package.json           # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern web browser with WebGL support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/harsha-portfolio.git
   cd harsha-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### API Keys Required

#### Essential APIs
- **Email Service**: SendGrid, Postmark, or SMTP credentials
- **Geolocation**: AbstractAPI or IPinfo token
- **Weather**: OpenWeatherMap API key

#### Optional APIs
- **Analytics**: Plausible or Google Analytics
- **Performance Monitoring**: Lighthouse CI, PageSpeed Insights
- **CDN**: Cloudflare API tokens

### Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
# Email Service
SENDGRID_API_KEY=your_key_here
FROM_EMAIL=your_email@domain.com
TO_EMAIL=recipient@domain.com

# Geolocation
ABSTRACT_API_KEY=your_key_here

# Weather
OPENWEATHER_API_KEY=your_key_here
```

## 📱 PWA Features

- **Installable** - Add to home screen on mobile devices
- **Offline Support** - Service worker caches essential resources
- **Background Sync** - Form submissions work offline
- **Push Notifications** - Ready for future implementation
- **App-like Experience** - Standalone mode and native feel

## 🎨 Customization

### Colors & Theme
The portfolio uses CSS custom properties for easy theming:

```scss
:root {
    --primary-black: #000000;
    --primary-yellow: #FFD700;
    --secondary-yellow: #FFEA70;
    --text-white: #FFFFFF;
    --text-gray: #CCCCCC;
}
```

### 3D Scene
Modify the Three.js scene in `scripts/main.js`:

```javascript
class ThreeSceneManager {
    // Customize particle count, colors, and animations
    createParticles() {
        const particleCount = 100; // Adjust for performance
        // ... particle creation logic
    }
}
```

### Animations
GSAP animations are configured in the `AnimationManager` class:

```javascript
class AnimationManager {
    setupScrollAnimations() {
        // Customize scroll-triggered animations
    }
}
```

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect repository to Netlify**
2. **Set environment variables** in Netlify dashboard
3. **Deploy automatically** on git push

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload files** to your hosting provider
3. **Configure environment variables** on your hosting platform

### CDN Configuration

For optimal performance, configure your CDN with:

- **Cache Headers**: Static assets cached for 1 year
- **Compression**: Brotli and gzip enabled
- **HTTP/2**: Enable HTTP/2 or HTTP/3
- **Security Headers**: HSTS, CSP, X-Frame-Options

## 📊 Performance Monitoring

### Lighthouse Testing

```bash
# Run Lighthouse locally
npm run test:lighthouse

# View results in tests/benchmarks/score-reports/
```

### PageSpeed Insights

```bash
# Test with PageSpeed Insights API
npm run test:psi
```

### Core Web Vitals

Monitor real user metrics with:
- **Chrome UX Report**
- **Web Vitals JavaScript library**
- **Lighthouse CI integration**

## 🔍 SEO Optimization

### Meta Tags
- Open Graph and Twitter Card support
- Structured data (schema.org)
- Canonical URLs and robots directives

### Keywords
Primary target keywords:
- "Harsha Vallamkonda"
- "Frontend Engineer"
- "3D Web Developer"
- "Three.js Portfolio"
- "WebGL Developer"
- "Performance Optimization"

### Technical SEO
- XML sitemap generation
- robots.txt configuration
- Semantic HTML structure
- Image alt text and lazy loading

## ♿ Accessibility

### WCAG Compliance
- **Color Contrast**: AA compliant (4.5:1 ratio)
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML and ARIA labels
- **Reduced Motion**: Respects user preferences

### Features
- Skip to main content link
- Focus indicators and keyboard shortcuts
- Alt text for all images
- Semantic heading structure

## 🧪 Testing

### Automated Testing
```bash
# Run all tests
npm test

# Performance testing
npm run test:lighthouse
npm run test:psi

# Build testing
npm run build
npm run serve
```

### Manual Testing Checklist
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness
- [ ] Touch interactions
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Performance on slow devices

## 📈 Performance Optimization

### Critical Rendering Path
- Critical CSS inlined in HTML
- Non-critical CSS loaded asynchronously
- JavaScript deferred and lazy-loaded
- Images optimized with WebP/AVIF

### Bundle Optimization
- Tree shaking and dead code elimination
- Code splitting for 3D components
- Minification and compression
- HTTP/2 server push ready

### Image Optimization
- Responsive images with srcset
- WebP and AVIF formats with fallbacks
- Lazy loading for below-the-fold images
- Optimized hero images for LCP

## 🔒 Security

### Headers
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy

### API Security
- Input validation and sanitization
- Rate limiting on serverless functions
- CORS configuration
- Environment variable protection

## 📚 API Documentation

### Contact Form
```javascript
POST /.netlify/functions/contact
Content-Type: application/x-www-form-urlencoded

name=John&email=john@example.com&message=Hello
```

### Geolocation
```javascript
GET /.netlify/functions/geolocation
Response: { country, city, timezone, coordinates }
```

### Weather
```javascript
GET /.netlify/functions/weather?lat=40.7128&lon=-74.0060
Response: { current, forecast, location }
```

## 🐛 Troubleshooting

### Common Issues

#### Three.js Not Loading
- Check WebGL support in browser
- Verify Three.js CDN or local files
- Check console for errors

#### Performance Issues
- Reduce particle count in 3D scene
- Optimize images and assets
- Check bundle size with `npm run build`

#### API Errors
- Verify environment variables
- Check API key validity
- Review serverless function logs

### Debug Mode
Enable debug logging:
```bash
DEBUG=portfolio:* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** - 3D graphics library
- **GSAP** - Animation library
- **Netlify** - Serverless hosting platform
- **OpenWeatherMap** - Weather data API
- **AbstractAPI** - Geolocation service

## 📞 Support

For questions or support:
- **Email**: harsha@example.com
- **LinkedIn**: [Harsha Vallamkonda](https://linkedin.com/in/harsha-vallamkonda-706a09190)
- **Issues**: GitHub repository issues

---

**Built with ❤️ and performance in mind**
