class CurrencyConverter {
  constructor() {
    this.usdInput = document.getElementById('usd-amount');
    this.convertBtn = document.getElementById('convert-btn');
    this.resultBox = document.getElementById('conversion-result');
    this.errorBox = document.getElementById('conversion-error');
    this.loadingBox = document.getElementById('conversion-loading');
    this.egpAmount = document.getElementById('egp-amount');
    this.exchangeRate = document.getElementById('exchange-rate');
    this.lastUpdated = document.getElementById('last-updated');
    this.errorMessage = document.getElementById('error-message');

    this.init();
  }

  init() {
    // Add event listeners
    this.convertBtn.addEventListener('click', () => this.convertCurrency());
    
    // Allow conversion on Enter key press
    this.usdInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.convertCurrency();
      }
    });

    // Clear previous results when input changes
    this.usdInput.addEventListener('input', () => {
      this.hideAllMessages();
    });

    // Load current exchange rate on page load
    this.loadExchangeRate();
  }

  async loadExchangeRate() {
    try {
      const response = await fetch('/api/exchange-rate');
      const data = await response.json();

      if (data.success) {
        this.exchangeRate.textContent = data.rate.rate.toFixed(4);
        this.lastUpdated.textContent = new Date(data.rate.lastUpdated).toLocaleString();
      }
    } catch (error) {
      console.error('Failed to load exchange rate:', error);
    }
  }

  async convertCurrency() {
    const amount = parseFloat(this.usdInput.value);

    // Validate input
    if (!amount || amount <= 0) {
      this.showError('Please enter a valid amount greater than 0');
      return;
    }

    // Show loading state
    this.showLoading();

    try {
      const response = await fetch('/api/convert-currency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount })
      });

      const data = await response.json();

      if (data.success && data.conversion) {
        this.showResult(data.conversion);
      } else {
        this.showError(data.error || 'Failed to convert currency');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError('Network error. Please try again.');
    }
  }

  showResult(conversion) {
    this.hideAllMessages();

    // Update result values
    this.egpAmount.textContent = conversion.egpAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    this.exchangeRate.textContent = conversion.exchangeRate.toFixed(4);
    this.lastUpdated.textContent = new Date(conversion.lastUpdated).toLocaleString();

    // Show result
    this.resultBox.style.display = 'block';
    this.resultBox.classList.add('fade-in');
  }

  showError(message) {
    this.hideAllMessages();
    this.errorMessage.textContent = message;
    this.errorBox.style.display = 'block';
    this.errorBox.classList.add('fade-in');
  }

  showLoading() {
    this.hideAllMessages();
    this.loadingBox.style.display = 'block';
  }

  hideAllMessages() {
    this.resultBox.style.display = 'none';
    this.errorBox.style.display = 'none';
    this.loadingBox.style.display = 'none';
    
    // Remove animation classes
    this.resultBox.classList.remove('fade-in');
    this.errorBox.classList.remove('fade-in');
  }
}

// Initialize currency converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('usd-amount')) {
    new CurrencyConverter();
  }
}); 