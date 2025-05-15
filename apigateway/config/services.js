require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  productServiceURL: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
  paymentServiceURL: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3002',
  userServiceURL: process.env.USER_SERVICE_URL || 'http://localhost:3003'
  
};