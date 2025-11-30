# Coinmarketcap Exchangerate API (TypeScript)
A TypeScript module to fetch cryptocurrency prices from CoinMarketCap API and forex prices from ExchangeRate API.


## Features
- Fetch cryptocurrency prices from CoinMarketCap API
- Fetch forex prices from ExchangeRate API
- Automatic detection of cryptocurrency vs forex tickers
- Support for API keys via environment variables or direct assignment
- Easy to use and integrate into your projects
- Written in TypeScript with full type definitions


## Installation
```bash
npm install coinmarketcap-exchangerate
```


## Usage

### Basic Usage

```typescript
import { PriceFetcher } from '@droonacharyakochelo/coinmarketcap-exchangerate';

// Get API keys from environment variables or .env file
// Or provide them manually here:
const cmcApiKey = process.env.CMC_API_KEY || undefined;
const erApiKey = process.env.ER_API_KEY || undefined;

const fetcher = new PriceFetcher(cmcApiKey, erApiKey);

const tickers = ['BTC', 'ETH', 'EUR', 'JPY', 'DOT'];

const prices = await fetcher.fetchPrices(tickers);

prices.forEach(([ticker, name, price]) => {
  console.log(`${ticker}: ${name}: ${price}`);
});
```


### Running the Example Script via CLI
You can run the example script directly from the command line:

```bash
npm run example

npm run example -- BTC ETH EUR JPY
```


### Using API Keys via Environment Variables
Set your API keys as environment variables:

```bash
CMC_API_KEY=your_coinmarketcap_api_key
ER_API_KEY=your_exchangerate_api_key
```

Then run the example:

```bash
npm run example
```


### Using API Keys via Direct Assignment - not recommended 
```typescript
import { PriceFetcher } from '@droonacharyakochelo/coinmarketcap-exchangerate';

// Provide API key as variable
const cmcApiKey = 'your_coinmarketcap_api_key';
const erApiKey = 'your_exchangerate_api_key';

const fetcher = new PriceFetcher(cmcApiKey, erApiKey);
const prices = await fetcher.fetchPrices(['BTC', 'EUR']);
```


### Without API Keys (Default)
If no API keys are provided, the module will use:

- CoinMarketCap sandbox API (with limited requests)
- Default ExchangeRate API endpoint

```typescript
import { PriceFetcher } from 'coinmarketcap-exchangerate';

const fetcher = new PriceFetcher();
const prices = await fetcher.fetchPrices(['BTC', 'EUR']);
```


## Return Format
The `fetchPrices()` method returns a Promise that resolves to an array of tuples in the format:

```typescript
[
  ['EUR', 'Euro', 0.980],
  ['JPY', 'Japanese Yen', 0.005],
  ['BTC', 'Bitcoin', 78000.0],
  ['ETH', 'Ethereum', 3500.0],
  ['DOT', 'Polkadot', 7.5]
]
```

Each tuple contains the ticker symbol, currency name and its price in USD.


## Requirements
- Node.js 20+
- npm or yarn


## API Documentation
- [CoinMarketCap API Documentation](https://coinmarketcap.com/api/documentation/v1/)
- [ExchangeRate API Documentation](https://www.exchangerate-api.com/docs)


## License
MIT License
