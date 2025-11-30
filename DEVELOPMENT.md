# Development Guide
This document explains how to develop, build, and test the Coinmarketcap Exchangerate TypeScript module.


## Project Structure
```
typescript/
├── src/
│   ├── data/
│   │   └── exchange-rate-currencies.json
│   ├── PriceFetcher.ts
│   └── index.ts
├── tests/
│   └── PriceFetcher.test.ts
├── dist/
│   ├── bundle.min.js 
│   ├── index.js 
│   ├── PriceFetcher.js 
│   └── *.d.ts (TypeScript declaration files)
├── package.json
├── tsconfig.json
├── README.md
├── example.ts
└── DEVELOPMENT.md
```


## Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Create minified bundle:
   ```bash
   npm run bundle
   ```

4. Run tests:
   ```bash
   npm test
   ```

5. Run example:
   ```bash
   npx ts-node example.ts
   ```


## Building
The project uses TypeScript and can be built in two ways:
1. **Node.js module**: `npm run build` creates CommonJS modules in the `dist/` directory
2. **Browser bundle**: `npm run bundle` creates a minified UMD bundle in `dist/bundle.min.js`


## Publishing to npm
To publish the module to npm:

1. Update the version in `package.json`
2. Run `npm run prepare` to build and bundle
3. Run `npm publish`


## API Keys
The module works with or without API keys:

- Without API keys: Uses CoinMarketCap sandbox API and ExchangeRate free tier
- With API keys: Uses production APIs for higher rate limits


## Usage Examples

### Node.js / TypeScript
```typescript
import { PriceFetcher } from '@droonacharyakochelo/cmc-er';

const fetcher = new PriceFetcher();
// OR Provide the API keys
// const fetcher = new PriceFetcher('your-cmc-api-key', 'your-er-api-key');

const prices = await fetcher.fetchPrices(['BTC', 'ETH', 'EUR', 'JPY']);
```


## Return Format
The `fetchPrices()` method returns a Promise that resolves to an array of Ticker, Currency Name and Prices:
```typescript
[
  [ticker: string, name: string, price: number],
  // e.g.
  ['BTC', 'Bitcoin', 45000.00],
  ['EUR', 'Euro', 1.12]
]
```

## Testing
Run tests with:
```bash
npm test
```

Or run the simple test script:
```bash
npx ts-node tests/PriceFetcher.test.ts
```

## Dependencies
- `axios`: For HTTP requests
- `@types/node`: TypeScript definitions for Node.js


## Development Dependencies
- `typescript`: TypeScript compiler
- `ts-node`: For running TypeScript files directly
- `jest`: Testing framework
- `@types/jest`: TypeScript definitions for Jest
- `terser`: JavaScript minifier
