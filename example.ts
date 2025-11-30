#!/usr/bin/env ts-node

/**
 * Example script demonstrating how to use the coinmarketcap-exchangerate module
 */

// Load environment variables from .env file if it exists
require('dotenv').config();

import { PriceFetcher } from './src';

async function main() {
  // Get tickers from command line arguments, or use defaults
  const args = process.argv.slice(2);
  const tickers = args.length > 0 ? args : ['BTC', 'ETH', 'EUR', 'JPY', 'DOT', 'BNB', 'CNY'];
  
  // Get API keys from environment variables or .env file
  // Or provide them manually here:
  const cmcApiKey = process.env.CMC_API_KEY || undefined;
  const erApiKey = process.env.ER_API_KEY || undefined;
  
  const fetcher = new PriceFetcher(cmcApiKey, erApiKey);
  
  // Display which mode we're using
  if (cmcApiKey || erApiKey) {
    console.log('Using provided API keys');
  } else {
    console.log('Using default sandbox mode (limited requests)');
  }
  
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
