import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { calculateMarketplaceShipping, convertShippingCost } from '../../services/shippingService';

const OrderSummary = ({ 
  cartItems, 
  cartTotal, 
  shippingAddress,
  selectedPaymentMethod 
}) => {
  const { convertPrice, formatPrice, userCurrency } = useCurrency();
  const [itemPrices, setItemPrices] = useState({});
  const [marketplaceShipping, setMarketplaceShipping] = useState(null);
  const [convertedShippingCosts, setConvertedShippingCosts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const tax = cartTotal * 0.195; // 19.5% VAT
  const processingFee = selectedPaymentMethod?.fees ? (cartTotal * selectedPaymentMethod.fees) / 100 : 0;

  // Calculate marketplace shipping
  useEffect(() => {
    if (cartItems.length > 0 && shippingAddress?.city) {
      const shipping = calculateMarketplaceShipping(cartItems, shippingAddress);
      setMarketplaceShipping(shipping);
    }
  }, [cartItems, shippingAddress]);

  // Convert item prices to user's currency
  useEffect(() => {
    const convertItemPrices = async () => {
      setIsLoading(true);
      const prices = {};
      
      try {
        for (const item of cartItems) {
          const convertedPrice = await convertPrice(
            item.price, 
            item.currency || 'XAF', 
            userCurrency
          );
          prices[item._id] = convertedPrice;
        }
        setItemPrices(prices);
      } catch (error) {
        console.error('Error converting item prices:', error);
        // Fallback to original prices
        cartItems.forEach(item => {
          prices[item._id] = item.price;
        });
        setItemPrices(prices);
      } finally {
        setIsLoading(false);
      }
    };

    if (cartItems.length > 0) {
      convertItemPrices();
    } else {
      setIsLoading(false);
    }
  }, [cartItems, convertPrice, userCurrency]);

  // Convert shipping costs to user's currency
  useEffect(() => {
    const convertShippingCosts = async () => {
      if (!marketplaceShipping) return;

      const converted = {};
      try {
        for (const [vendorId, shipping] of Object.entries(marketplaceShipping.vendorShipping)) {
          const convertedCost = await convertShippingCost(
            shipping.cost, 
            shipping.currency || 'XAF', 
            userCurrency, 
            convertPrice
          );
          converted[vendorId] = convertedCost;
        }
        setConvertedShippingCosts(converted);
      } catch (error) {
        console.error('Error converting shipping costs:', error);
        // Fallback to original costs
        Object.entries(marketplaceShipping.vendorShipping).forEach(([vendorId, shipping]) => {
          converted[vendorId] = shipping.cost;
        });
        setConvertedShippingCosts(converted);
      }
    };

    convertShippingCosts();
  }, [marketplaceShipping, convertPrice, userCurrency]);

  // Calculate total shipping cost
  const totalShippingCost = Object.values(convertedShippingCosts).reduce((sum, cost) => sum + cost, 0);
  const total = cartTotal + totalShippingCost + tax + processingFee;

  // Group items by vendor for display
  const vendorGroups = {};
  cartItems.forEach(item => {
    const vendorId = item.vendorId || 'default';
    const vendorName = item.vendorName || 'Store';
    if (!vendorGroups[vendorId]) {
      vendorGroups[vendorId] = {
        name: vendorName,
        items: [],
        subtotal: 0
      };
    }
    vendorGroups[vendorId].items.push(item);
    const itemPrice = itemPrices[item._id] || 0;
    vendorGroups[vendorId].subtotal += (itemPrice * item.quantity);
  });

  return (
    <div className="lg:w-96">
      <div className="bg-white rounded-sm border border-gray-200 p-6 sticky top-4">
        <h3 className="text-lg font-semibold text-primary mb-4">Order Summary</h3>
        
        {/* Cart Items by Vendor */}
        <div className="space-y-4 mb-4">
          {Object.entries(vendorGroups).map(([vendorId, vendor]) => (
            <div key={vendorId} className="space-y-3">
              {/* Vendor Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h4 className="font-medium text-sm text-gray-700">{vendor.name}</h4>
                {marketplaceShipping?.vendorShipping[vendorId] && (
                  <span className="text-xs text-gray-500">
                    {marketplaceShipping.vendorShipping[vendorId].isFree ? 'Free Shipping' : 
                     formatPrice(convertedShippingCosts[vendorId] || 0, userCurrency)}
                  </span>
                )}
              </div>
              
              {/* Vendor Items */}
              {vendor.items.map((item) => {
                const itemPrice = itemPrices[item._id] || 0;
                const itemTotal = itemPrice * item.quantity;
                
                return (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      <img
                        src={item.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-primary truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">
                      {isLoading ? (
                        <span className="text-gray-400 animate-pulse">Loading...</span>
                      ) : (
                        formatPrice(itemTotal, userCurrency)
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Order Totals */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              {formatPrice(cartTotal)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {marketplaceShipping?.vendorCount > 1 ? (
                <span className="text-sm">
                  {formatPrice(totalShippingCost, userCurrency)}
                  <span className="text-gray-500 ml-1">({marketplaceShipping.vendorCount} vendors)</span>
                </span>
              ) : (
                formatPrice(totalShippingCost, userCurrency)
              )}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (VAT)</span>
            <span className="font-medium">
              {formatPrice(tax)}
            </span>
          </div>
          
          {processingFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-medium">
                {formatPrice(processingFee)}
              </span>
            </div>
          )}
          
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        {shippingAddress?.city && marketplaceShipping && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="font-medium text-gray-800 text-sm mb-2">Shipping to:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
              <p>{shippingAddress.country}</p>
              <p className="text-green-600 font-medium mt-2">
                Estimated Delivery: {marketplaceShipping.estimatedDeliveryTime}
              </p>
              {marketplaceShipping.vendorCount > 1 && (
                <p className="text-blue-600 font-medium">
                  Ordering from {marketplaceShipping.vendorCount} vendor{marketplaceShipping.vendorCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Payment Method */}
        {selectedPaymentMethod && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800 text-sm mb-2">Payment Method:</h4>
            <div className="text-xs text-blue-700">
              <p className="font-medium">{selectedPaymentMethod.name}</p>
              {selectedPaymentMethod.description && (
                <p className="text-blue-600">{selectedPaymentMethod.description}</p>
              )}
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-xs">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 