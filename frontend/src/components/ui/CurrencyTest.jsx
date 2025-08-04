import React, { useEffect, useState } from 'react';
import { useCurrency } from '../../hooks/useCurrency';

const CurrencyTest = () => {
  const { formatPrice, userCurrency, convertPrice, changeCurrency, availableCurrencies } = useCurrency();
  const [testResults, setTestResults] = useState([]);
  const [conversionTests, setConversionTests] = useState([]);

  useEffect(() => {
    const runTests = async () => {
      const results = [];
      
      // Test 1: Basic formatting
      try {
        const formatted = formatPrice(100, 'XAF');
        results.push({ test: 'Basic XAF formatting', result: formatted, success: true });
      } catch (error) {
        results.push({ test: 'Basic XAF formatting', result: error.message, success: false });
      }

      // Test 2: USD formatting
      try {
        const formatted = formatPrice(100, 'USD');
        results.push({ test: 'USD formatting', result: formatted, success: true });
      } catch (error) {
        results.push({ test: 'USD formatting', result: error.message, success: false });
      }

      // Test 3: Undefined currency
      try {
        const formatted = formatPrice(100, undefined);
        results.push({ test: 'Undefined currency', result: formatted, success: true });
      } catch (error) {
        results.push({ test: 'Undefined currency', result: error.message, success: false });
      }

      // Test 4: Null currency
      try {
        const formatted = formatPrice(100, null);
        results.push({ test: 'Null currency', result: formatted, success: true });
      } catch (error) {
        results.push({ test: 'Null currency', result: error.message, success: false });
      }

      // Test 5: Empty string currency
      try {
        const formatted = formatPrice(100, '');
        results.push({ test: 'Empty string currency', result: formatted, success: true });
      } catch (error) {
        results.push({ test: 'Empty string currency', result: error.message, success: false });
      }

      // Test 6: Invalid currency code
      try {
        const formatted = formatPrice(100, 'INVALID');
        results.push({ test: 'Invalid currency code', result: formatted, success: true });
      } catch (error) {
        results.push({ test: 'Invalid currency code', result: error.message, success: false });
      }

      setTestResults(results);
    };

    const runConversionTests = async () => {
      const conversions = [];
      
      // Test currency conversions
      const testCases = [
        { from: 'XAF', to: 'USD', amount: 1000 },
        { from: 'USD', to: 'XAF', amount: 1 },
        { from: 'EUR', to: 'XAF', amount: 10 },
        { from: 'XAF', to: 'EUR', amount: 1000 },
      ];

      for (const testCase of testCases) {
        try {
          const converted = await convertPrice(testCase.amount, testCase.from, testCase.to);
          const formatted = formatPrice(converted, testCase.to);
          conversions.push({
            test: `${testCase.amount} ${testCase.from} → ${testCase.to}`,
            result: formatted,
            success: true
          });
        } catch (error) {
          conversions.push({
            test: `${testCase.amount} ${testCase.from} → ${testCase.to}`,
            result: error.message,
            success: false
          });
        }
      }

      setConversionTests(conversions);
    };

    runTests();
    runConversionTests();
  }, [formatPrice, convertPrice]);

  const handleCurrencyChange = async (currencyCode) => {
    try {
      await changeCurrency(currencyCode);
      console.log('Currency changed to:', currencyCode);
    } catch (error) {
      console.error('Error changing currency:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg space-y-6">
      <h3 className="text-lg font-bold mb-4">Currency System Test</h3>
      
      <div>
        <p className="mb-2">Current user currency: <strong>{userCurrency}</strong></p>
        <p className="mb-4">Available currencies: {availableCurrencies.map(c => c.code).join(', ')}</p>
        
        <div className="flex gap-2 mb-4">
          {availableCurrencies.slice(0, 5).map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className={`px-3 py-1 text-sm rounded ${
                currency.code === userCurrency 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {currency.code}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">Formatting Tests:</h4>
        <div className="space-y-2">
          {testResults.map((test, index) => (
            <div key={index} className={`p-2 rounded ${test.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="font-medium">{test.test}:</div>
              <div className="text-sm">{test.result}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Conversion Tests:</h4>
        <div className="space-y-2">
          {conversionTests.map((test, index) => (
            <div key={index} className={`p-2 rounded ${test.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="font-medium">{test.test}:</div>
              <div className="text-sm">{test.result}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyTest; 