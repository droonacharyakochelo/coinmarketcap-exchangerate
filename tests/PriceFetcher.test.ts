import { PriceFetcher } from '../src';

describe('PriceFetcher', () => {
  let fetcher: PriceFetcher;

  beforeEach(() => {
    fetcher = new PriceFetcher();
  });

  test('should return empty array for empty input', async () => {
    const result = await fetcher.fetchPrices([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should fetch prices for valid tickers', async () => {
    const tickers = ['BTC', 'EUR'];
    const result = await fetcher.fetchPrices(tickers);
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
    
    if (result.length > 0) {
      const firstResult = result[0];
      expect(firstResult.length).toBe(3);
      expect(typeof firstResult[0]).toBe('string'); // ticker
      expect(typeof firstResult[1]).toBe('string'); // name
      expect(typeof firstResult[2]).toBe('number'); // price
    }
  });

  test('should handle mixed crypto and forex tickers', async () => {
    const tickers = ['BTC', 'ETH', 'EUR', 'JPY'];
    const result = await fetcher.fetchPrices(tickers);
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(3);
  });
});