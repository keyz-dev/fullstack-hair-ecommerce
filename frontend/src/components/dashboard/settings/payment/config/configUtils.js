export const getConfigKey = (paymentMethodType) => {
  switch (paymentMethodType) {
    case 'MOBILE_MONEY':
      return 'mobileMoney';
    case 'BANK_TRANSFER':
      return 'bankTransfer';
    case 'CARD_PAYMENT':
      return 'cardPayment';
    case 'PAYPAL':
      return 'paypal';
    case 'CRYPTO':
      return 'crypto';
    default:
      return '';
  }
};

export const providerOptions = [
  {label: 'Select Provider', value: ''},
  {label: 'MTN', value: 'MTN'},
  {label: 'ORANGE', value: 'ORANGE'},
  {label: 'OTHER', value: 'OTHER'}
]; 