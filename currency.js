/**
 * Currency Conversion API Module
 * Handles price conversions between KZT, RUB, and USD
 */

const CurrencyConverter = {
    // In production, fetch these from a real API
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

    // Currency names
    names: {
        KZT: 'KZT (₸)',
        RUB: 'RUB (₽)',
        USD: 'USD ($)'
    },

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
        this.currentCurrency = newCurrency;
        const priceElements = document.querySelectorAll('.price-display');
        
        priceElements.forEach(element => {
            const priceInKZT = parseInt(element.dataset.price);
            const convertedPrice = this.convert(priceInKZT, newCurrency);
            const formatted = this.formatPrice(convertedPrice, newCurrency);
            element.textContent = formatted;
            element.dataset.currency = newCurrency;
        });

        // Save preference to localStorage
        localStorage.setItem('preferred_currency', newCurrency);
        
        // Update button label
        this.updateCurrencyLabel(newCurrency);
    },

    /**
     * Update the currency selector button label
     * @param {string} currency - Currency code
     */
    updateCurrencyLabel(currency) {
        const currencyLabel = document.getElementById('selected-currency');
        if (currencyLabel) {
            currencyLabel.textContent = this.names[currency] || currency;
        }
    },

    /**
     * Initialize currency conversion system
     */
    init() {
        // Load user's preferred currency or default to KZT
        const savedCurrency = localStorage.getItem('preferred_currency') || 'KZT';
        this.currentCurrency = savedCurrency;

        // Fetch live rates on init
        this.fetchRatesFromAPI();

        // Set up currency selector buttons
        const currencyDropdown = document.querySelectorAll('[data-currency]');
        currencyDropdown.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetCurrency = button.dataset.currency;
                this.updateAllPrices(targetCurrency);
            });
        });

        // Initialize with saved currency
        if (savedCurrency !== 'KZT') {
            this.updateAllPrices(savedCurrency);
        } else {
            this.updateCurrencyLabel('KZT');
        }
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    CurrencyConverter.init();
});
