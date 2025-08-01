# Payment System Integration with Socket.IO

This document describes the integration of a real-time payment tracking system using Socket.IO for the BraidSter Commerce platform.

## Overview

The payment system has been enhanced with real-time tracking capabilities using Socket.IO, allowing customers to receive instant updates about their payment status without needing to refresh the page.

## Storage Architecture

### 🚨 **Why Not In-Memory Storage in Production?**

**In-memory storage is NOT optimal for production** because:

1. **Data Loss on Server Restart**: All active payments disappear when server restarts
2. **No Scalability**: Can't run multiple server instances or load balance
3. **Memory Limits**: Map grows indefinitely until server crashes
4. **No Persistence**: Payment tracking stops if server crashes

### ✅ **Production Solution: Redis Integration**

The system now uses **Redis in production** and **in-memory storage in development**:

- **Development**: In-memory storage for easy testing
- **Production**: Redis for scalability, persistence, and reliability
- **Automatic Fallback**: Falls back to in-memory if Redis is unavailable

## Backend Integration

### 1. Socket.IO Setup (`backend/src/sockets/index.js`)

The Socket.IO server is configured with:
- **Smart Storage**: Redis in production, in-memory in development
- CORS support for frontend connections
- Payment tracking functionality
- Webhook verification middleware
- Real-time notification system

### 2. Redis Service (`backend/src/sockets/redis.js`)

Production-ready Redis service with:
- **Automatic Expiration**: Payments expire after 1 hour, clients after 24 hours
- **Connection Management**: Automatic reconnection and error handling
- **Data Persistence**: Survives server restarts and crashes
- **Scalability**: Supports multiple server instances

### 3. Payment Controller (`backend/src/controller/payment.js`)

Enhanced with:
- Socket.IO integration for real-time updates
- Active payment tracking with async storage
- Webhook processing with real-time notifications
- Test simulation endpoints for development

### 4. Server Integration (`backend/server.js`)

Socket.IO is integrated into the main server:
```javascript
const io = setupSocketIO(server);
global.io = io; // Make io available globally
```

## Frontend Integration

### 1. Payment Socket Hook (`frontend/src/hooks/usePaymentSocket.js`)

Provides:
- Socket.IO connection management
- Payment tracking functions
- Real-time status updates
- Toast notifications for payment events

### 2. Payment Tracker Component (`frontend/src/components/payment/PaymentTracker.jsx`)

Displays:
- Real-time payment status
- Progress indicators
- Payment details
- Connection status

### 3. Checkout Integration (`frontend/src/hooks/useCheckout.js`)

Enhanced to:
- Track payments after initiation
- Pass payment references to confirmation page
- Provide real-time updates during checkout

## API Endpoints

### Payment Endpoints
- `POST /api/payment/initiate` - Initiate a payment
- `POST /api/payment/webhook` - CamPay webhook endpoint
- `GET /api/payment/status/:orderId` - Check payment status
- `GET /api/payment/tracking/:reference` - Get payment from active tracking
- `GET /api/payment/debug/connections` - Debug socket connections
- `POST /api/payment/test/simulate` - Simulate payment flow (dev only)

## Socket.IO Events

### Client to Server
- `track-payment` - Start tracking a payment
- `stop-tracking-payment` - Stop tracking a payment

### Server to Client
- `connected` - Connection acknowledgment
- `payment-initiated` - Payment request sent
- `payment-status` - Payment status update
- `payment-success` - Payment completed successfully
- `payment-failed` - Payment failed or cancelled
- `payment-completed` - General payment completion event

## Environment Variables

### Required for All Environments
```env
CAMPAY_WEBHOOK_KEY=your_webhook_key
CAMPAY_API_URL=https://demo.campay.net/api
CAMPAY_APP_ID=your_app_id
CAMPAY_USERNAME=your_username
CAMPAY_APP_PASSWORD=your_password
CAMPAY_PERMANENT_ACCESS_TOKEN=your_token
FRONTEND_URL=http://localhost:3000
```

### Required for Production (Redis)
```env
NODE_ENV=production
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
```

## Storage Configuration

### Development Mode
```javascript
// Automatically uses in-memory storage
NODE_ENV=development
// No Redis required
```

### Production Mode
```javascript
// Automatically uses Redis
NODE_ENV=production
// Redis connection required
```

## Usage

### 1. Starting the Backend
```bash
cd backend
npm install
npm run dev  # Development with in-memory storage
# or
NODE_ENV=production npm start  # Production with Redis
```

The server will start with Socket.IO support on the configured port.

### 2. Testing the System
Visit `/payment-test` in the frontend to test the payment tracking system.

### 3. Real Payment Flow
1. Customer places order with mobile money payment
2. Payment is initiated via CamPay API
3. Customer receives real-time updates via Socket.IO
4. Payment status is updated in real-time
5. Order status is updated when payment completes

## Production Deployment

### 1. Redis Setup
```bash
# Install Redis (Ubuntu/Debian)
sudo apt-get install redis-server

# Or use Docker
docker run -d --name redis -p 6379:6379 redis:alpine

# Or use cloud Redis (recommended)
# - AWS ElastiCache
# - Google Cloud Memorystore
# - Azure Cache for Redis
```

### 2. Environment Configuration
```env
NODE_ENV=production
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
FRONTEND_URL=https://yourdomain.com
```

### 3. Multiple Server Instances
With Redis, you can now run multiple server instances:
```bash
# Instance 1
NODE_ENV=production PORT=5000 npm start

# Instance 2  
NODE_ENV=production PORT=5001 npm start

# Load balancer will distribute connections
# All instances share the same Redis storage
```

## Monitoring and Debugging

### Debug Endpoints
- `GET /api/payment/debug/connections` - View all active connections and storage status
- Redis health check included in debug info

### Logging
- Connection events logged with timestamps
- Payment status updates logged
- Redis connection status logged
- Error handling with detailed logs

### Health Checks
```javascript
// Check storage health
const health = await storageService.healthCheck();
// Returns: { status: 'healthy', storage: 'redis', timestamp: '...' }
```

## Performance Considerations

### Redis Benefits
- **Persistence**: Data survives server restarts
- **Scalability**: Multiple server instances
- **Performance**: Fast in-memory operations
- **Reliability**: Automatic failover and reconnection

### Memory Management
- **Automatic Expiration**: Payments expire after 1 hour
- **Client Cleanup**: Disconnected clients removed after 24 hours
- **Manual Cleanup**: Old payments removed automatically

## Troubleshooting

### Common Issues

1. **Socket.IO Connection Failed**
   - Check if backend is running
   - Verify CORS configuration
   - Check network connectivity

2. **Payment Not Tracking**
   - Verify payment reference is correct
   - Check if payment is in active tracking
   - Review server logs for errors

3. **Webhook Not Working**
   - Verify webhook key configuration
   - Check webhook URL accessibility
   - Review webhook signature verification

4. **Redis Connection Issues**
   - Check Redis server status
   - Verify connection credentials
   - Check network connectivity to Redis

### Debug Tools
- Visit `/api/payment/debug/connections` to see active connections
- Check server logs for detailed error messages
- Use browser developer tools to monitor Socket.IO events
- Redis CLI for direct database inspection

## Future Enhancements

1. **Redis Clustering** - For high availability
2. **Payment Analytics** - Track payment success rates and timing
3. **Retry Mechanisms** - Implement automatic retry for failed payments
4. **Multi-currency Support** - Extend for different currencies
5. **Payment History** - Store payment history for analysis
6. **Real-time Analytics** - Live payment statistics and monitoring

## Support

For issues or questions about the payment system integration, please refer to the server logs and debug endpoints, or contact the development team. 