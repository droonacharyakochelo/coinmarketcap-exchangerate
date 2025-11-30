import axios, { AxiosRequestConfig } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Type definition for price data
 */
export type PriceData = [string, string, number];

/**
 * PriceFetcher - A TypeScript module to fetch cryptocurrency prices from CoinMarketCap API 
 * and forex prices from ExchangeRate API
 */
export class PriceFetcher {
  private cmcApiKey: string;
  private erApiKey: string | null;
  private cmcUrl!: string;
  private erUrl!: string;
  private forexSymbols: Record<string, string>;

  /**
   * Initialize the PriceFetcher with optional API keys
   * @param cmcApiKey CoinMarketCap API key (optional)
   * @param erApiKey ExchangeRate API key (optional)
   */
  constructor(cmcApiKey?: string, erApiKey?: string) {
    // Get API keys from parameters or use defaults
    this.cmcApiKey = cmcApiKey || "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c";
    this.erApiKey = erApiKey || null;
    
    this.setDefaultUrls();
    this.forexSymbols = this.loadForexSymbols();
  }

  /**
   * Set default URLs based on API keys
   */
  private setDefaultUrls(): void {
    if (this.cmcApiKey === "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c") {
      this.cmcUrl = "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
    } else {
      this.cmcUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
    }
    
    if (!this.erApiKey) {
      this.erUrl = "https://api.exchangerate-api.com/v4/latest/USD";
    } else {
      this.erUrl = `https://v6.exchangerate-api.com/v6/${this.erApiKey}/latest/USD`;
    }
  }

  /**
   * Load forex symbols from JSON file
   * @returns Record of forex symbols and their names
   */
  private loadForexSymbols(): Record<string, string> {
    try {
      const filePath = path.join(__dirname, 'data', 'exchange-rate-currencies.json');
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading forex symbols:", error);
      return {};
    }
  }

  /**
   * Fetch prices for given tickers
   * @param tickers List of ticker symbols
   * @returns Promise resolving to list of price data tuples
   */
  async fetchPrices(tickers: string[]): Promise<PriceData[]> {
    if (!Array.isArray(tickers)) {
      throw new Error("Tickers must be provided as an array");
    }
    
    if (tickers.length === 0) {
      return [];
    }
    
    // Filter tickers into forex and crypto
    const [forexTickers, cryptoTickers] = this.filterTickers(tickers);
    
    const prices: PriceData[] = [];
    
    if (forexTickers.length > 0) {
      const forexPrices = await this.fetchForexPrices(forexTickers);
      prices.push(...forexPrices);
    }
    
    if (cryptoTickers.length > 0) {
      const cryptoPrices = await this.fetchCryptoPrices(cryptoTickers);
      prices.push(...cryptoPrices);
    }
    
    return prices;
  }

  /**
   * Filter tickers into forex and crypto lists
   * @param tickers List of ticker symbols
   * @returns Tuple of [forexTickers, cryptoTickers]
   */
  private filterTickers(tickers: string[]): [string[], string[]] {
    const forexTickers: string[] = [];
    const cryptoTickers: string[] = [];
    
    for (const ticker of tickers) {
      const upperTicker = ticker.toUpperCase();
      if (this.forexSymbols.hasOwnProperty(upperTicker)) {
        forexTickers.push(upperTicker);
      } else {
        cryptoTickers.push(upperTicker);
      }
    }
    
    return [forexTickers, cryptoTickers];
  }

  /**
   * Fetch forex prices from ExchangeRate API
   * @param tickers List of forex ticker symbols
   * @returns Promise resolving to list of price data tuples
   */
  private async fetchForexPrices(tickers: string[]): Promise<PriceData[]> {
    const prices: PriceData[] = [];
    
    try {
      const response = await axios.get(this.erUrl);
      
      const data = response.data;
      const rates = this.erApiKey ? data.conversion_rates : data.rates;
      
      // Get USD as base rate (1.0)
      if (tickers.includes('USD')) {
        prices.push(['USD', 'United States Dollar', 1.0]);
      }
      
      for (const ticker of tickers) {
        if (ticker !== 'USD' && rates.hasOwnProperty(ticker)) {
          prices.push([ticker, this.forexSymbols[ticker], rates[ticker]]);
        }
      }
    } catch (error) {
      console.error(`Error fetching forex prices: ${error}`);
    }
    
    return prices;
  }

  /**
   * Fetch cryptocurrency prices from CoinMarketCap API
   * @param tickers List of cryptocurrency ticker symbols
   * @returns Promise resolving to list of price data tuples
   */
  private async fetchCryptoPrices(tickers: string[]): Promise<PriceData[]> {
    const prices: PriceData[] = [];
    
    if (tickers.length === 0) {
      return prices;
    }
    
    try {
      const symbolList = tickers.join(',');
      
      const config: AxiosRequestConfig = {
        method: 'GET',
        url: this.cmcUrl,
        headers: {
          'Accepts': 'application/json',
          'X-CMC_PRO_API_KEY': this.cmcApiKey,
        },
        params: {
          symbol: symbolList,
        },
      };
      
      const response = await axios(config);
      const data = response.data;
      
      if (data.data) {
        for (const ticker of tickers) {
          if (data.data[ticker]) {
            const price = data.data[ticker].quote.USD.price;
            const name = data.data[ticker].name;
            prices.push([ticker, name, price]);
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching crypto prices: ${error}`);
    }
    
    return prices;
  }
}
