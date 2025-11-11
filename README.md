# 🤖 Optimus Prime - PC Builder & Configurator

A modern, accessible web application for building, configuring, and browsing pre-built PC systems with real-time currency conversion, ratings persistence, and responsive design.

## ✨ Features

### 🎨 **Theme System (Day/Night Mode)**
- Toggle between dark (night) and light (day) modes
- WCAG AA compliant color system with proper contrast ratios
- Automatic detection based on time of day (optional)
- Persistent theme preference using localStorage
- Smooth transitions between themes

### 💰 **Currency Conversion**
- Real-time exchange rate fetching from external API
- Support for multiple currencies:
  - 🇰🇿 Kazakhstani Tenge (₸) - Default
  - 🇷🇺 Russian Ruble (₽)
  - 🇺🇸 US Dollar ($)
- Smart price formatting per currency
- User preference saved to localStorage
- Available on the "Branded PCs" page

### ⭐ **Rating System**
- 5-star rating interface for each PC model
- LocalStorage persistence - ratings are saved and restored
- Smooth hover effects and visual feedback
- Audio notification on rating submission
- Works across all product cards

### 🔍 **Search & Autocomplete**
- Real-time search functionality for PCs
- Case-insensitive filtering
- Autocomplete suggestions with keyboard navigation
- Visual highlighting of matched terms
- Works on both Browse and Branded PCs pages

### 📱 **Responsive Design**
- Mobile-first approach
- Bootstrap 5 grid system
- Optimized layouts for all screen sizes (mobile, tablet, desktop)
- Touch-friendly buttons and interactive elements
- Accessible navigation menu

### ♿ **Accessibility Features**
- WCAG AA compliant color contrast ratios
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Focus indicators for accessibility
- Screen reader friendly
- Skip to main content link
- High contrast mode support
- Reduced motion preference support

### 🔐 **Form Validation**
- Real-time field validation
- Custom error messages
- Visual feedback (green checkmark for valid, red X for invalid)
- Prevents submission of invalid forms
- Smooth error animations

### 📊 **PC Configurator**
- Custom build configuration
- Component selection interface
- Live price calculation
- Estimated performance metrics
- System recommendations

### 🖼️ **Image Optimization**
- Lazy loading for product images
- Automatic opacity transitions
- Reduced bandwidth usage
- Progressive image loading

### 🔔 **Notifications System**
- Toast notifications for user actions
- Success/error/info message types
- Auto-dismiss functionality
- Smooth entrance/exit animations
- Fixed positioning for visibility

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely client-side (for basic features)
- Internet connection for live currency conversion API

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/maqsatto/Optimus_Prime.git
cd Optimus_Prime
```

2. **Open in browser:**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (with http-server)
   npx http-server
   ```

3. **Access the application:**
   - Open `http://localhost:8000` in your browser

## 📁 Project Structure

```
Optimus_Prime/
├── index.html              # Home page with overview
├── builtedpc.html          # Pre-built PC models with currency converter
├── builtpc.html            # PC configurator tool
├── login.html              # User login page
├── register.html           # User registration page
├── profile.html            # User profile page
├── media.html              # Media/gallery page
├── styles/
│   └── styles.css          # Complete stylesheet with WCAG AA colors
├── interactions.js         # Core interactions (ratings, theme, forms)
├── script.js               # Additional functionality
├── jsdemo.js               # Demo utilities
├── currency.js             # Currency conversion API
├── maqsat.js               # Maqsat-specific utilities
├── README.md               # This file
└── README.md
```

## 🎯 Main Pages

### **Home (index.html)**
- Overview of featured PCs
- Quick navigation to other sections
- Testimonials and statistics
- FAQ section with search

### **Branded PCs (builtedpc.html)**
- Browse 14+ pre-built PC models
- Real-time price conversion (KZT/RUB/USD)
- 5-star rating system for each model
- Carousel view of PC images
- Search functionality

### **PC Configurator (builtpc.html)**
- Custom PC build tool
- Component selection
- Price calculation
- Performance estimation
- Build save/export (future feature)

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - WCAG AA compliant styling with CSS variables
- **JavaScript (Vanilla)** - No dependencies for core features
- **Bootstrap 5** - Responsive grid and components
- **Google Fonts** - Poppins font family

### APIs & External Services
- **exchangerate-api.com** - Real-time currency conversion
- **Bootstrap CDN** - CSS and JavaScript components
- **jQuery** - Optional, for DOM manipulation (if included)

## 📖 Usage Guide

### **Toggle Theme (Day/Night Mode)**
1. Click the 🌙 moon icon in the navbar
2. Theme preference is automatically saved
3. Reload page to see saved preference

### **Convert Currency Prices**
1. Go to "Branded PCs" page
2. Click "💱 Currency: KZT (₸)" dropdown button
3. Select desired currency (Tenge/Ruble/Dollar)
4. All prices update instantly
5. Preference is saved for future visits

### **Rate a PC**
1. Find a PC on the Branded PCs or Configurator page
2. Hover over the ★ stars to preview rating
3. Click on your desired star rating (1-5)
4. Hear audio confirmation
5. Rating is saved and persists across sessions

### **Search for PCs**
1. Use the 🔍 search input on any page with PC listings
2. Type PC name or price range
3. Results filter in real-time
4. Matched terms are highlighted

### **Configure a PC**
1. Go to "PC Configurator" page
2. Select components (CPU, GPU, RAM, etc.)
3. View live price updates
4. Check estimated performance
5. Add to cart or save build (future feature)

### **Form Submission**
1. Fill out any form (login, register, contact, etc.)
2. Fields validate in real-time as you type
3. ✅ Green checkmark shows valid fields
4. ❌ Red X shows invalid fields with error message
5. Submit button only works when form is valid
6. Success notification appears after submission

## 🎨 Color System

### WCAG AA Compliant Colors

**Night Mode (Dark Theme):**
- Background: `#000000` (pure black)
- Text: `#FFD700` (gold) - 12.41:1 contrast
- Links: `#FFA500` (orange) - 7.5:1 contrast
- Borders: `#FFD700` (gold)

**Day Mode (Light Theme):**
- Background: `#FFFFFF` (white)
- Text: `#212529` (dark gray) - 16.12:1 contrast
- Links: `#0056b3` (blue) - 7.5:1 contrast
- Borders: `#495057` (medium gray)
- All yellows replaced with dark gray/black variants

### Semantic Colors
- Success: `#28a745` (green)
- Error: `#dc3545` (red)
- Warning: `#856404` (dark gold)
- Info: `#004085` (dark blue)

## 💾 LocalStorage Data

The application saves the following to localStorage:

```javascript
// Theme preference
localStorage.setItem('theme', 'day' | 'night')

// Rating for each PC (scale 1-5)
localStorage.setItem('rating_{pcId}', rating)

// Preferred currency
localStorage.setItem('preferred_currency', 'KZT' | 'RUB' | 'USD')
```

## 🔌 API Integration

### Currency Conversion API
- **Provider**: exchangerate-api.com
- **Endpoint**: `https://api.exchangerate-api.com/v4/latest/KZT`
- **Fallback Rates**: If API unavailable, uses hardcoded rates
- **Auto-fetch**: Rates are fetched on page load
- **Caching**: Rates are fetched fresh each session

**Fallback Exchange Rates:**
```javascript
KZT: 1 (base)
RUB: 0.16  // 1 KZT ≈ 0.16 RUB
USD: 0.0021 // 1 KZT ≈ 0.0021 USD
```

## 🎯 Future Enhancements

- [ ] Backend API integration for user accounts
- [ ] PC build save/load functionality
- [ ] Real-time inventory tracking
- [ ] Email notifications
- [ ] Advanced filtering (price range, specs)
- [ ] Comparison tool for multiple PCs
- [ ] User reviews with images
- [ ] Wishlist functionality
- [ ] Social sharing features
- [ ] Analytics dashboard
- [ ] Mobile app version

## 🐛 Known Issues & Workarounds

- **Exchange rates**: Free API has rate limits (~1500 requests/day). For production, use paid API.
- **Image lazy loading**: Some older browsers may not support all features. Works on all modern browsers.
- **LocalStorage limits**: Each browser has ~5-10MB localStorage limit. Should not be an issue for this app.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Maqsat Atto**
- GitHub: [@maqsatto](https://github.com/maqsatto)
- Email: Contact via repository

## 🙏 Acknowledgments

- Bootstrap 5 team for the responsive framework
- Google Fonts for Poppins typography
- exchangerate-api.com for currency data
- WCAG guidelines for accessibility standards
- All contributors and testers

## 📞 Support

For issues, questions, or suggestions:
1. Check the [Issues](https://github.com/maqsatto/Optimus_Prime/issues) page
2. Create a new issue with detailed description
3. Include browser and OS information
4. Attach screenshots if applicable

## 📊 Statistics

- **Pages**: 7 main pages
- **Components**: 14+ pre-built PC models
- **Supported Currencies**: 3 (KZT, RUB, USD)
- **Rating Options**: 5-star scale
- **Accessibility Level**: WCAG AA
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Bundle Size**: ~50KB (HTML + CSS + JS)

---

**Last Updated**: November 11, 2025
**Version**: 1.0.0
**Status**: ✅ Active & Maintained

🚀 **Ready to build your perfect PC!**
