# Robust Currency System Documentation

## Overview

The BraidSter marketplace now features a robust, real-time currency system that handles multiple currencies throughout the entire purchase flow. This system ensures uniform currency display while maintaining the original product currencies in the database.

## Key Features

- **Real-time Exchange Rates**: Uses external APIs for live currency conversion
- **Automatic Currency Detection**: Detects user's currency based on timezone
- **Uniform Display**: All products display in the user's selected currency
- **Caching**: Exchange rates are cached for 30 minutes to improve performance
- **Fallback Support**: Graceful degradation when external APIs are unavailable
- **Multi-currency Support**: Supports 14+ currencies including XAF, USD, EUR, GBP, NGN, GHS, KES, ZAR, EGP, MAD, TND, DZD, CAD, AUD

## Architecture

### Frontend Components

#### 1. CurrencyService (`frontend/src/services/currencyService.js`)
- Singleton service that manages all currency operations
- Handles exchange rate caching and updates
- Provides currency conversion and formatting
- Uses `currency.js` library for precise formatting

#### 2. CurrencyContext (`frontend/src/contexts/CurrencyContext.jsx`)
- React context for global currency state management
- Provides currency conversion functions to all components
- Handles user currency detection and changes
- Manages loading states and error handling

#### 3. Currency Hooks (`frontend/src/hooks/useCurrency.js`)
- `useCurrency()`: Main currency hook for accessing context
- `usePriceDisplay()`: Hook for converting and caching prices
- `useProductPrice()`: Hook for product price display with conversion
- `useCartTotal()`: Hook for cart total calculation
- `useOrderTotal()`: Hook for order total calculation

#### 4. UI Components
- `CurrencySelector`: Enhanced dropdown with refresh functionality
- `ProductPrice`: Component for displaying converted product prices
- `PriceInput`: Enhanced input with currency selection
- `PriceTotal`: Component for displaying cart/order totals

### Backend Components

#### 1. Currency Utils (`backend/src/utils/currencyUtils.js`)
- Handles currency conversion on the server side
- Manages exchange rate caching
- Provides currency validation and formatting
- Supports real-time rate updates

#### 2. Currency API Routes (`backend/src/routes/currency.js`)
- RESTful endpoints for currency operations
- Supports price conversion, formatting, and validation
- Provides exchange rate management
- Handles currency information retrieval

## Usage Examples

### Basic Currency Usage

```jsx
import { useCurrency } from '../hooks/useCurrency';

const MyComponent = () => {
  const { userCurrency, convertPrice, formatPrice } = useCurrency();
  
  // Convert a price
  const convertedPrice = await convertPrice(100, 'USD', 'XAF');
  
  // Format a price
  const formattedPrice = formatPrice(convertedPrice, 'XAF');
  
  return <div>Price: {formattedPrice}</div>;
};
```

### Product Price Display

```jsx
import ProductPrice from '../components/ui/ProductPrice';

const ProductCard = ({ product }) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <ProductPrice product={product} />
    </div>
  );
};
```

### Cart Total Calculation

```jsx
import { useCartTotal } from '../hooks/useCurrency';

const CartSummary = ({ cartItems }) => {
  const { total, isLoading } = useCartTotal(cartItems);
  
  return (
    <div>
      <h3>Cart Total</h3>
      {isLoading ? (
        <p>Calculating...</p>
      ) : (
        <p>Total: {total}</p>
      )}
    </div>
  );
};
```

### Price Input with Currency Selection

```jsx
import PriceInput from '../components/ui/PriceInput';

const ProductForm = () => {
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('XAF');
  
  return (
    <PriceInput
      price={price}
      currency={currency}
      onPriceChange={setPrice}
      onCurrencyChange={setCurrency}
      label="Product Price"
      required
    />
  );
};
```

## API Endpoints

### Frontend API (`frontend/src/api/currency.js`)

- `getAllCurrencies()`: Get all supported currencies
- `getActiveCurrencies()`: Get active currencies
- `getCurrencyByCode(code)`: Get currency info by code
- `convertPrice(price, fromCurrency, toCurrency)`: Convert price
- `formatPrice(price, currency)`: Format price with symbol
- `convertAndFormatPrice(price, fromCurrency, toCurrency)`: Convert and format
- `getExchangeRates()`: Get current exchange rates
- `refreshExchangeRates()`: Refresh exchange rates
- `validateCurrency(currency)`: Validate currency code

### Backend API Routes

- `GET /api/currency/supported`: Get supported currencies
- `GET /api/currency/info/:code`: Get currency info
- `POST /api/currency/convert`: Convert price
- `POST /api/currency/format`: Format price
- `POST /api/currency/convert-and-format`: Convert and format
- `GET /api/currency/rates`: Get exchange rates
- `POST /api/currency/refresh-rates`: Refresh rates
- `POST /api/currency/validate`: Validate currency

## Currency Flow

### 1. Product Registration
- Vendors register products with their preferred currency
- Products are stored with original price and currency
- No conversion happens at registration time

### 2. Product Display
- User's currency is detected (timezone/localStorage)
- Products are converted to user's currency for display
- All prices show uniformly in user's selected currency

### 3. Cart Operations
- Cart items maintain original product currency
- Totals are calculated in user's currency
- Conversion happens in real-time

### 4. Checkout Process
- Order maintains original product currencies
- Final totals are converted to user's currency
- Payment processing uses converted amounts

## Configuration

### Exchange Rate Updates

To integrate with real exchange rate APIs, update the `loadExchangeRates` function in `backend/src/utils/currencyUtils.js`:

```javascript
const loadExchangeRates = async () => {
  try {
    // Replace with your preferred exchange rate API
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/XAF');
    const data = await response.json();
    return data.rates;
  } catch (error) {
    // Fallback to predefined rates
    return EXCHANGE_RATES;
  }
};
```

### Adding New Currencies

1. Add currency to `SUPPORTED_CURRENCIES` in both frontend and backend
2. Add exchange rate to `EXCHANGE_RATES`
3. Update timezone mapping if needed
4. Test conversion and formatting

### Currency Formatting

Currency formatting is handled by the `currency.js` library with configurations in `CURRENCY_CONFIGS`:

```javascript
const CURRENCY_CONFIGS = {
  XAF: { symbol: 'XAF', precision: 0, pattern: '# !' },
  USD: { symbol: '$', precision: 2, pattern: '!#', decimal: '.', separator: ',' },
  // ... more currencies
};
```

## Error Handling

The system includes comprehensive error handling:

- **API Failures**: Falls back to predefined rates
- **Invalid Currencies**: Uses default currency (XAF)
- **Network Issues**: Caches rates for offline use
- **Conversion Errors**: Returns original price

## Performance Optimizations

- **Caching**: Exchange rates cached for 30 minutes
- **Lazy Loading**: Currency data loaded on demand
- **Price Caching**: Converted prices cached per session
- **Batch Operations**: Multiple conversions handled efficiently

## Testing

### Manual Testing

1. **Currency Detection**: Test with different timezones
2. **Price Conversion**: Verify conversion accuracy
3. **Formatting**: Check currency symbol placement
4. **Cart Totals**: Ensure correct total calculation
5. **Error Scenarios**: Test with invalid currencies

### Automated Testing

```javascript
// Example test for currency conversion
describe('Currency Conversion', () => {
  it('should convert USD to XAF correctly', async () => {
    const converted = await convertPrice(100, 'USD', 'XAF');
    expect(converted).toBe(62500); // 100 USD = 62500 XAF
  });
});
```

## Migration Guide

### From Old System

1. **Update Imports**: Replace old currency imports with new hooks
2. **Component Updates**: Use new `ProductPrice` component
3. **API Changes**: Update API calls to use new endpoints
4. **Context Setup**: Ensure `CurrencyProvider` wraps your app

### Backward Compatibility

The system maintains backward compatibility:
- Legacy exports available in `currency.js`
- Old component APIs still work
- Gradual migration supported

## Troubleshooting

### Common Issues

1. **Prices Not Converting**: Check if currency service is initialized
2. **Wrong Currency Display**: Verify user currency detection
3. **API Errors**: Check network connectivity and API endpoints
4. **Formatting Issues**: Verify currency configurations

### Debug Mode

Enable debug logging:

```javascript
// In currencyService.js
const DEBUG = true;

if (DEBUG) {
  console.log('Currency conversion:', { price, fromCurrency, toCurrency, result });
}
```

## Future Enhancements

- **Real-time Updates**: WebSocket for live rate updates
- **Historical Rates**: Support for historical conversions
- **Multi-currency Payments**: Accept payments in multiple currencies
- **Currency Preferences**: User-specific currency preferences
- **Rate Alerts**: Notifications for significant rate changes

## Support

For issues or questions about the currency system:
1. Check the troubleshooting section
2. Review API documentation
3. Test with different currencies
4. Verify exchange rate sources 