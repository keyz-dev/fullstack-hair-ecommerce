const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/v2/api';

// Test admin analytics endpoints
async function testAdminAnalytics() {
  try {
    console.log('Testing admin analytics endpoints...');
    
    // Test overview endpoint
    const overviewResponse = await axios.get(`${API_BASE_URL}/adminAnalytics/overview?range=30d`);
    console.log('✅ Overview endpoint working:', overviewResponse.data.success);
    
    // Test sales endpoint
    const salesResponse = await axios.get(`${API_BASE_URL}/adminAnalytics/sales?range=30d`);
    console.log('✅ Sales endpoint working:', salesResponse.data.success);
    
    // Test users endpoint
    const usersResponse = await axios.get(`${API_BASE_URL}/adminAnalytics/users?range=30d`);
    console.log('✅ Users endpoint working:', usersResponse.data.success);
    
    // Test products endpoint
    const productsResponse = await axios.get(`${API_BASE_URL}/adminAnalytics/products?range=30d`);
    console.log('✅ Products endpoint working:', productsResponse.data.success);
    
    // Test orders endpoint
    const ordersResponse = await axios.get(`${API_BASE_URL}/adminAnalytics/orders?range=30d`);
    console.log('✅ Orders endpoint working:', ordersResponse.data.success);
    
    // Test bookings endpoint
    const bookingsResponse = await axios.get(`${API_BASE_URL}/adminAnalytics/bookings?range=30d`);
    console.log('✅ Bookings endpoint working:', bookingsResponse.data.success);
    
    // Test revenue endpoint
    const revenueResponse = await axios.get(`${API_BASE_URL}/adminAnalytics/revenue?range=30d`);
    console.log('✅ Revenue endpoint working:', revenueResponse.data.success);
    
    // Test activity endpoint
    const activityResponse = await axios.get(`${API_BASE_URL}/adminAnalytics/activity?limit=10`);
    console.log('✅ Activity endpoint working:', activityResponse.data.success);
    
    console.log('🎉 All admin analytics endpoints are working!');
    
  } catch (error) {
    console.error('❌ Error testing admin analytics:', error.response?.data || error.message);
  }
}

testAdminAnalytics(); 