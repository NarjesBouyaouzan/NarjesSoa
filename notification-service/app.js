const express = require('express');
const bodyParser = require('body-parser');
const { Kafka } = require('kafkajs');
const winston = require('winston');

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'notification-service.log' })
  ]
});

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3003;

// In-memory store for notifications (replace with DB in production)
const notifications = new Map();

// Kafka Configuration
const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [ 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

// Process payment events from Kafka
const processPaymentEvent = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'payments', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        logger.info(`Received event: ${event.type}`);

        if (event.type === 'PAYMENT_CREATED') {
          const payment = event.data;
          
          // Store notification
          notifications.set(payment.id, {
            paymentId: payment.id,
            orderId: payment.orderId,
            userId: payment.userId,
            amount: payment.amount,
            status: 'processed',
            timestamp: new Date().toISOString()
          });

          logger.info(`Processed payment notification for payment ID: ${payment.id}`);
          
          // Here you would add actual notification logic (email, SMS, etc.)
          logger.info(`Would send notification to user ${payment.userId} about payment ${payment.id}`);
        }
      } catch (error) {
        logger.error(`Error processing message: ${error.message}`);
      }
    }
  });
};

// API Endpoints
app.get('/notifications/:paymentId', (req, res) => {
  const notification = notifications.get(req.params.paymentId);
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  res.json(notification);
});

app.get('/notifications/user/:userId', (req, res) => {
  const userNotifications = Array.from(notifications.values())
    .filter(n => n.userId === req.params.userId);
  res.json(userNotifications);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start the server and Kafka consumer
const startService = async () => {
  try {
    await processPaymentEvent();
    app.listen(port, () => {
      logger.info(`Notification service running on port ${port}`);
    });
  } catch (error) {
    logger.error(`Failed to start service: ${error.message}`);
    process.exit(1);
  }
};

startService();