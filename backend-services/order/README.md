# Order Service

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0+-009688.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Required-2496ED.svg)](https://www.docker.com/)

<div align="center">
  <img src="docs/order-service.png" alt="Order Service Architecture" width="600"/>
</div>

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Contributing](#contributing)

## 🚀 Overview

The Order Service is a robust order management system built with FastAPI. It handles the complete order lifecycle, from creation to fulfillment, implementing the Saga pattern for distributed transactions.

### Key Features
- 🛒 Order creation and management
- 🔄 Order status tracking
- 💳 Payment integration
- 📦 Inventory synchronization
- 📊 Order analytics
- 🔍 Search functionality
- 📱 RESTful API
- 🔒 Transaction safety

## 🏗️ Architecture

### Design Patterns
- **Saga Pattern** - Distributed transactions
- **CQRS** - Command Query Responsibility Segregation
- **Repository Pattern** - Data access abstraction
- **Factory Pattern** - Object creation
- **Observer Pattern** - Event handling
- **Strategy Pattern** - Algorithm selection
- **Unit of Work** - Transaction management

### Technology Stack
- **Framework**: FastAPI
- **Database**: MySQL
- **ORM**: SQLAlchemy
- **Testing**: Pytest
- **Documentation**: OpenAPI/Swagger
- **Monitoring**: Prometheus
- **Logging**: Loguru
- **Message Queue**: RabbitMQ

## 📚 API Documentation

### Order Endpoints

#### POST /api/orders
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
    "customerId": "123",
    "items": [
        {
            "productId": "456",
            "quantity": 2,
            "price": 29.99
        }
    ],
    "shippingAddress": {
        "street": "123 Main St",
        "city": "Boston",
        "state": "MA",
        "zipCode": "02108"
    }
}
```

#### GET /api/orders/{orderId}
```http
GET /api/orders/{orderId}
Authorization: Bearer {token}
```

#### PUT /api/orders/{orderId}/status
```http
PUT /api/orders/{orderId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
    "status": "SHIPPED",
    "trackingNumber": "1Z999AA10123456789"
}
```

### Order History Endpoints

#### GET /api/orders/history/{customerId}
```http
GET /api/orders/history/{customerId}?page=1&limit=10
Authorization: Bearer {token}
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- MySQL 8.0+
- Docker and Docker Compose
- RabbitMQ 3.8+

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd backend-services/order

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Unix
# or
.\venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run the service
uvicorn app.main:app --reload
```

### Environment Setup
Create a `.env` file:
```env
# Server Configuration
PORT=8080
ENV=development

# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=orders_db
MYSQL_USER=myuser
MYSQL_PASSWORD=mypassword

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=3600
```

## 👨‍💻 Development

### Project Structure
```
order/
├── app/
│   ├── api/                    # API endpoints
│   ├── core/                   # Core functionality
│   ├── db/                     # Database models
│   ├── schemas/                # Pydantic models
│   ├── services/               # Business logic
│   └── utils/                  # Utilities
├── tests/
│   ├── integration/            # Integration tests
│   └── unit/                   # Unit tests
├── alembic/                    # Database migrations
└── docs/                       # Documentation
```

### Building
```bash
# Build Docker image
docker build -t order-service .

# Run with Docker
docker run -p 8080:8080 order-service
```

### Running Tests
```bash
# Run all tests
pytest

# Run specific test
pytest tests/unit/test_orders.py -v
```

## 📊 Monitoring

### Health Checks
- Database connectivity
- RabbitMQ connection
- Memory usage
- Request latency
- Service dependencies

### Metrics
- Order creation rate
- Order status changes
- Payment processing
- API response times
- Error rates
- Queue processing times

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
