const Redis = require('ioredis');
require('dotenv').config();

class RedisService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB || 0,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    });

    this.redis.on('connect', () => {
      console.log('🔗 Connected to Redis');
    });

    this.redis.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
    });

    this.redis.on('close', () => {
      console.log('🔌 Redis connection closed');
    });
  }

  // Payment tracking methods
  async addActivePayment(paymentReference, paymentData) {
    const key = `payment:${paymentReference}`;
    const data = {
      ...paymentData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    await this.redis.setex(key, 3600, JSON.stringify(data)); // Expire in 1 hour
    console.log(`💳 Payment added to Redis: ${paymentReference}`);
    return data;
  }

  async updatePaymentStatus(paymentReference, status, additionalData = {}) {
    const key = `payment:${paymentReference}`;
    const existingData = await this.redis.get(key);
    
    if (existingData) {
      const paymentInfo = JSON.parse(existingData);
      const updatedData = {
        ...paymentInfo,
        status,
        lastUpdated: new Date().toISOString(),
        ...additionalData
      };

      await this.redis.setex(key, 3600, JSON.stringify(updatedData));
      console.log(`📊 Payment status updated in Redis: ${paymentReference} -> ${status}`);
      return updatedData;
    }
    return null;
  }

  async getPaymentInfo(paymentReference) {
    const key = `payment:${paymentReference}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async removeActivePayment(paymentReference) {
    const key = `payment:${paymentReference}`;
    const removed = await this.redis.del(key);
    if (removed) {
      console.log(`🗑️ Payment removed from Redis: ${paymentReference}`);
    }
    return removed > 0;
  }

  async getAllActivePayments() {
    const keys = await this.redis.keys('payment:*');
    const payments = [];
    
    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        const paymentInfo = JSON.parse(data);
        payments.push({
          reference: key.replace('payment:', ''),
          ...paymentInfo
        });
      }
    }
    
    return payments;
  }

  // Client tracking methods
  async addConnectedClient(socketId, clientData) {
    const key = `client:${socketId}`;
    const data = {
      ...clientData,
      connectedAt: new Date().toISOString(),
      activePayments: []
    };

    await this.redis.setex(key, 86400, JSON.stringify(data)); // Expire in 24 hours
    console.log(`👤 Client added to Redis: ${socketId}`);
    return data;
  }

  async updateClientPayments(socketId, paymentReference, action = 'add') {
    const key = `client:${socketId}`;
    const existingData = await this.redis.get(key);
    
    if (existingData) {
      const clientInfo = JSON.parse(existingData);
      
      if (action === 'add') {
        if (!clientInfo.activePayments.includes(paymentReference)) {
          clientInfo.activePayments.push(paymentReference);
        }
      } else if (action === 'remove') {
        clientInfo.activePayments = clientInfo.activePayments.filter(
          ref => ref !== paymentReference
        );
      }

      await this.redis.setex(key, 86400, JSON.stringify(clientInfo));
      return clientInfo;
    }
    return null;
  }

  async removeConnectedClient(socketId) {
    const key = `client:${socketId}`;
    const removed = await this.redis.del(key);
    if (removed) {
      console.log(`🔌 Client removed from Redis: ${socketId}`);
    }
    return removed > 0;
  }

  async getAllConnectedClients() {
    const keys = await this.redis.keys('client:*');
    const clients = [];
    
    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        const clientInfo = JSON.parse(data);
        clients.push({
          socketId: key.replace('client:', ''),
          ...clientInfo
        });
      }
    }
    
    return clients;
  }

  // Cleanup methods
  async cleanupExpiredPayments() {
    // Redis automatically handles expiration, but we can add custom cleanup
    const payments = await this.getAllActivePayments();
    const now = new Date();
    
    for (const payment of payments) {
      const lastUpdated = new Date(payment.lastUpdated);
      const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60);
      
      // Remove payments older than 24 hours
      if (hoursSinceUpdate > 24) {
        await this.removeActivePayment(payment.reference);
      }
    }
  }

  // Health check
  async healthCheck() {
    try {
      await this.redis.ping();
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
    }
  }

  // Close connection
  async close() {
    await this.redis.quit();
    console.log('🔌 Redis connection closed');
  }
}

// Create singleton instance
const redisService = new RedisService();

module.exports = redisService; 