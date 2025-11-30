#!/usr/bin/env ts-node

/**
 * Example script demonstrating how to use the coinmarketcap-exchangerate module
 */

import { PriceFetcher } from './src';

async function main() {
  const args = process.argv.slice(2);
  const tickers = args.length > 0 ? args : ['BTC', 'ETH', 'EUR', 'JPY', 'DOT', 'BNB', 'CNY'];
  
  const fetcher = new PriceFetcher();
  
  console.log('Fetching prices for:', tickers);
  console.log('----------------------------------------');
  
  try {
    const prices = await fetcher.fetchPrices(tickers);
    
    if (prices.length > 0) {
      prices.forEach(([ticker, name, price]) => {
        console.log(`${ticker.padStart(5)}:\t${name}:\t${price.toFixed(6)}`);
      });
    } else {
      console.log('No prices fetched. Check your API keys and internet connection.');
    }
  } catch (error) {
    console.error('Error fetching prices:', error);
  }
}

main();
