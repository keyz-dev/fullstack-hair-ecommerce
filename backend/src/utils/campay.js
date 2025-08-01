
const axios = require('axios');

class CampayService {
  constructor() {
    this.baseURL = process.env.CAMPAY_API_URL || 'https://demo.campay.net/api';
    this.appId = process.env.CAMPAY_APP_ID;
    this.username = process.env.CAMPAY_USERNAME;
    this.password = process.env.CAMPAY_APP_PASSWORD;
    this.permanentToken = process.env.CAMPAY_PERMANENT_ACCESS_TOKEN;
  }

  async getAccessToken() {
    try {
      // Use permanent token if available, otherwise authenticate
      if (this.permanentToken) {
        return this.permanentToken;
      }

      const response = await axios.post(`${this.baseURL}/token/`, {
        username: this.username,
        password: this.password
      });
      return response.data.token;
    } catch (error) {
      console.error('Error getting Campay access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Campay');
    }
  }

  // Initiate a payment collection
  async initiatePayment(paymentData) {
    try {
      const token = await this.getAccessToken();
      
      const payload = {
        amount: paymentData.amount.toString(),
        currency: paymentData.currency || 'XAF',
        from: paymentData.phoneNumber,
        description: paymentData.description,
        external_reference: paymentData.orderId,
        return_url: `${process.env.SERVER_URL}/api/payment/success`,
        cancel_url: `${process.env.SERVER_URL}/api/payment/cancel`
      };

      const response = await axios.post(
        `${this.baseURL}/collect/`,
        payload,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error initiating Campay payment:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment initiation failed');
    }
  }

  // Check payment status
  async checkPaymentStatus(reference) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(
        `${this.baseURL}/transaction/${reference}/`,
        {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error.response?.data || error.message);
      throw new Error('Failed to check payment status');
    }
  }
}

module.exports = new CampayService();
