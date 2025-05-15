const express = require('express');
const bodyParser = require('body-parser');
const { Kafka } = require('kafkajs');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3001;

// Kafka Configuration
const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: ['localhost:9092'] // Update with your Kafka broker addresses
});

const producer = kafka.producer();

// Connect to Kafka on startup
const connectKafka = async () => {
  await producer.connect();
  console.log('Connected to Kafka');
};

connectKafka().catch(console.error);

// Payment Processing Endpoint
app.post('/payments', async (req, res) => {
  try {
    
    
   

    // In a real implementation, you would process payment here
    const payment = 
      req.body
    

    // Send payment created event to Kafka
    await producer.send({
      topic: 'payments',
      messages: [
        { value: JSON.stringify({
          type: 'PAYMENT_CREATED',
          data: payment
        })}
      ]
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Payment processing failed:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Payment service running on port ${port}`);
});