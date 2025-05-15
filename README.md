# Microservices Project - Overview and Workflow

## Project Structure

This project is designed using a microservices architecture composed of multiple independent services communicating through APIs. The main components are:

- API Gateway
- Notification Service
- Payment Service
- Product Service

---

## 1. API Gateway

The API Gateway acts as the single entry point for all client requests. It routes requests to the appropriate microservices and handles authentication, GraphQL queries, and REST API endpoints.

- **Key files:**
  - `config/db.js`: Database connection setup.
  - `controllers/UserController.js`: Handles user authentication and user-related logic.
  - `graphql/resolvers/productResolver.js`: Resolves product-related GraphQL queries.
  - `graphql/schema/productSchema.gql`: Defines the GraphQL schema for product operations.
  - `models/product.js` and `models/user.js`: Data models for products and users.
  - `routes/routes.js`: REST API route definitions.
  - `app.js` and `server.js`: Express app configuration and server initialization.
  - `Dockerfile`: For containerizing the API Gateway.

**Workflow:**

- Receives client requests (REST or GraphQL).
- Validates user authentication.
- Routes product queries to Product Service via GraphQL resolvers.
- Forwards payment and notification requests to respective microservices.
- Aggregates responses to send back to the client.

---

## 2. Notification Service

Handles all notification-related tasks such as sending emails, SMS, or push notifications.

- **Key files:**
  - `app.js`: Main server handling notification requests.
  - `notification-service.log`: Log file for service events and errors.

**Workflow:**

- Listens for notification requests from API Gateway or other services.
- Sends notifications asynchronously to users.
- Logs activities and errors.

---

## 3. Payment Service

Manages payment processing and transaction handling.

- **Key files:**
  - `app.js`: Handles payment requests, processes transactions securely.

**Workflow:**

- Receives payment initiation requests from API Gateway.
- Processes payment with external payment providers or internal logic.
- Sends transaction status back to API Gateway.

---

## 4. Product Service

Responsible for managing product inventory and stock levels.

- **Key files:**
  - `config/db.js`: Database connection for product data.
  - `controllers/stockcontroller.js`: Business logic for stock management.
  - `models/stock.js`: Data model for stock items.
  - `routes/routes.js`: API routes for stock operations.
  - `app.js`: Service server setup.

**Workflow:**

- Receives requests related to product stock from API Gateway.
- Updates and retrieves stock information.
- Returns stock data to requesting service.

---

## Overall System Workflow Example: Making a Purchase

1. Client logs in via API Gateway → User authentication handled by `UserController`.
2. Client fetches product details → API Gateway uses `productResolver` to query Product Service.
3. Client initiates payment → API Gateway forwards payment request to Payment Service.
4. Payment Service processes the transaction and returns status.
5. Upon successful payment, API Gateway triggers Notification Service to send confirmation.
6. Product Service updates stock levels accordingly.

---

## Running the Project

Each microservice has its own `package.json` and can be run independently. Use Docker to containerize and orchestrate the services.

Example commands:

```bash
# In each service folder
npm install
npm start

# Or build and run Docker containers
docker build -t <service-name> .
docker run -p <port>:<port> <service-name>
