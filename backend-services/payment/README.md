# Payment Service

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0+-009688.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Required-2496ED.svg)](https://www.docker.com/)

<div align="center">
  <img src="docs/payment-service.png" alt="Payment Service Architecture" width="600"/>
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

The Payment Service is a secure payment processing system built with FastAPI. It handles payment transactions, integrates with payment gateways, and implements the Circuit Breaker pattern for fault tolerance.

### Key Features
- 💳 Payment processing
- 🔒 Secure transactions
- 🔄 Payment status tracking
- 📊 Transaction history
- 🔍 Payment verification
- ⚡ High performance
- 🛡️ Fault tolerance
- 📱 RESTful API

## 🏗️ Architecture

### Design Patterns
- **Circuit Breaker** - Fault tolerance
- **Repository Pattern** - Data access abstraction
- **Factory Pattern** - Payment gateway creation
- **Strategy Pattern** - Payment method selection
- **Observer Pattern** - Transaction monitoring
- **Unit of Work** - Transaction management
- **Command Pattern** - Payment operations

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

### Payment Endpoints

#### POST /api/payments
```http
POST /api/payments
Authorization: Bearer {token}
Content-Type: application/json

{
    "orderId": "123",
    "amount": 99.99,
    "currency": "USD",
    "paymentMethod": {
        "type": "credit_card",
        "cardNumber": "4111111111111111",
        "expiryMonth": "12",
        "expiryYear": "2025",
        "cvv": "123"
    }
}
```

#### GET /api/payments/{paymentId}
```http
GET /api/payments/{paymentId}
Authorization: Bearer {token}
```

#### POST /api/payments/{paymentId}/refund
```http
POST /api/payments/{paymentId}/refund
Authorization: Bearer {token}
Content-Type: application/json

{
    "amount": 99.99,
    "reason": "Customer request"
}
```

### Transaction History Endpoints

#### GET /api/payments/history/{orderId}
```http
GET /api/payments/history/{orderId}?page=1&limit=10
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
cd backend-services/payment

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
PORT=9001
ENV=development

# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=payment_db
MYSQL_USER=myuser
MYSQL_PASSWORD=mypassword

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Payment Gateway Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=3600
```

## 👨‍💻 Development

### Project Structure
```
payment/
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
docker build -t payment-service .

# Run with Docker
docker run -p 9001:9001 payment-service
```

### Running Tests
```bash
# Run all tests
pytest

# Run specific test
pytest tests/unit/test_payments.py -v
```

## 📊 Monitoring

### Health Checks
- Database connectivity
- RabbitMQ connection
- Payment gateway status
- Memory usage
- Request latency

### Metrics
- Payment success rate
- Transaction volume
- Processing times
- Error rates
- Gateway response times
- Queue processing times

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.