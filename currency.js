/**
 * Currency Conversion API Module
 * Handles price conversions between KZT, RUB, and USD
 * Toggle button cycles through currencies
 */

const CurrencyConverter = {
    // Exchange rates (from KZT base)
    rates: {
        KZT: 1,
        RUB: 0.16,  // 1 KZT ≈ 0.16 RUB
        USD: 0.0021 // 1 KZT ≈ 0.0021 USD
    },

    // Currency symbols
    symbols: {
        KZT: '₸',
        RUB: '₽',
        USD: '$'
    },

    // Currency names and display text
    names: {
        KZT: 'KZT (₸)',
        RUB: 'RUB (₽)',
        USD: 'USD ($)'
    },

    // Currency cycle order
    currencyOrder: ['KZT', 'RUB', 'USD'],
    currentCurrency: 'KZT',

    /**
     * Fetch real exchange rates from API
     * Uses exchangerate-api.com as example
     */
    async fetchRatesFromAPI() {
        try {
            // Using exchangerate-api.com free tier
            // Fetch rates relative to KZT
            const response = await fetch('https://v6.exchangerate-api.com/v6/9f2eb0c3630d723581c4de26/latest/KZT');
            if (response.ok) {
                const data = await response.json();
                this.rates.KZT = 1;
                this.rates.RUB = data.rates.RUB || 0.16;
                this.rates.USD = data.rates.USD || 0.0021;
                console.log('Exchange rates updated:', this.rates);
                return true;
            }
        } catch (error) {
            console.warn('Failed to fetch live rates, using fallback rates:', error);
        }
        return false;
    },

    /**
     * Convert price from KZT to target currency
     * @param {number} priceInKZT - Price in Kazakhstani Tenge
     * @param {string} targetCurrency - Target currency code (KZT, RUB, USD)
     * @returns {number} Converted price
     */
    convert(priceInKZT, targetCurrency) {
        if (!this.rates[targetCurrency]) {
            console.warn(`Unknown currency: ${targetCurrency}`);
            return priceInKZT;
        }
        return priceInKZT * this.rates[targetCurrency];
    },

    /**
     * Format price with appropriate currency symbol and decimals
     * @param {number} price - Price amount
     * @param {string} currency - Currency code
     * @returns {string} Formatted price string
     */
    formatPrice(price, currency) {
        const symbol = this.symbols[currency] || '$';
        
        let formatted;
        if (currency === 'USD') {
            // USD: 2 decimals
            formatted = `${symbol}${price.toFixed(2)}`;
        } else if (currency === 'RUB') {
            // RUB: 0 decimals
            formatted = `${Math.round(price).toLocaleString('ru-RU')}${symbol}`;
        } else {
            // KZT: 0 decimals
            formatted = `${Math.round(price).toLocaleString('en-US')}${symbol}`;
        }
        
        return formatted;
    },

    /**
     * Update all price displays on the page
     * @param {string} newCurrency - Target currency code
     */
    updateAllPrices(newCurrency) {
        console.log('Updating prices to currency:', newCurrency);
        this.currentCurrency = newCurrency;
        const priceElements = document.querySelectorAll('.price-display');
        console.log('Found price elements:', priceElements.length);
        
        if (priceElements.length === 0) {
            console.warn('No price elements found with class .price-display');
            return;
        }
        
        priceElements.forEach(element => {
            const priceInKZT = parseInt(element.dataset.price);
            if (isNaN(priceInKZT)) {
                console.warn('Invalid price data:', element.dataset.price);
                return;
            }
            const convertedPrice = this.convert(priceInKZT, newCurrency);
            const formatted = this.formatPrice(convertedPrice, newCurrency);
            console.log(`Converting ${priceInKZT}₸ to ${newCurrency}: ${formatted}`);
            element.textContent = formatted;
            element.dataset.currency = newCurrency;
        });

        // Save preference to localStorage
        localStorage.setItem('preferred_currency', newCurrency);
        
        // Update button label
        this.updateCurrencyLabel(newCurrency);
    },

    /**
     * Toggle to next currency (KZT → RUB → USD → KZT)
     */
    toggleCurrency() {
        const currentIndex = this.currencyOrder.indexOf(this.currentCurrency);
        const nextIndex = (currentIndex + 1) % this.currencyOrder.length;
        const nextCurrency = this.currencyOrder[nextIndex];
        this.updateAllPrices(nextCurrency);
    },

    /**
     * Update the currency display button label
     * @param {string} currency - Currency code
     */
    updateCurrencyLabel(currency) {
        const currencyLabel = document.getElementById('currency-display');
        if (currencyLabel) {
            currencyLabel.textContent = this.names[currency] || currency;
        }
    },

    /**
     * Initialize currency conversion system
     */
    init() {
        console.log('🚀 Initializing CurrencyConverter...');
        
        // Load user's preferred currency or default to KZT
        const savedCurrency = localStorage.getItem('preferred_currency') || 'KZT';
        this.currentCurrency = savedCurrency;
        console.log('📊 Saved currency:', savedCurrency);

        // Fetch live rates on init
        this.fetchRatesFromAPI();

        // Set up toggle button
        const toggleButton = document.getElementById('currencyToggle');
        if (!toggleButton) {
            console.error('❌ Currency toggle button not found! ID: currencyToggle');
            return;
        }
        
        console.log('✅ Toggle button found');
        
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('� Toggle button clicked');
            this.toggleCurrency();
        });

        // Initialize display with saved currency
        this.updateCurrencyLabel(savedCurrency);
        console.log('✅ CurrencyConverter initialized successfully');
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Initializing CurrencyConverter on DOMContentLoaded');
        CurrencyConverter.init();
    });
} else {
    // DOM is already loaded
    console.log('Initializing CurrencyConverter immediately (DOM already loaded)');
    CurrencyConverter.init();
}
