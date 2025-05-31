# Orchestration Service

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0+-009688.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Required-2496ED.svg)](https://www.docker.com/)

<div align="center">
  <img src="docs/orchestration-service.png" alt="Orchestration Service Architecture" width="600"/>
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

The Orchestration Service is a central coordination hub built with FastAPI. It implements the API Gateway pattern, handling service discovery, load balancing, and request routing across the microservices ecosystem.

### Key Features
- 🔄 Service discovery and routing
- ⚖️ Load balancing
- 🔒 API Gateway functionality
- 🔍 Request tracing
- 📊 Service health monitoring
- 🛡️ Rate limiting
- 🔐 Authentication proxy
- 📝 Request/Response transformation

## 🏗️ Architecture

### Design Patterns
- **API Gateway** - Request routing and composition
- **Service Discovery** - Dynamic service location
- **Circuit Breaker** - Fault tolerance
- **Load Balancer** - Request distribution
- **Proxy** - Request forwarding
- **Decorator** - Request/Response modification
- **Observer** - Service health monitoring

### Technology Stack
- **Framework**: FastAPI
- **Database**: Redis
- **Caching**: Redis
- **Testing**: Pytest
- **Documentation**: OpenAPI/Swagger
- **Monitoring**: Prometheus
- **Logging**: Loguru
- **Service Mesh**: Consul

## 📚 API Documentation

### Gateway Endpoints

#### GET /api/gateway/health
```http
GET /api/gateway/health
```

#### GET /api/gateway/services
```http
GET /api/gateway/services
Authorization: Bearer {token}
```

### Service Management Endpoints

#### POST /api/gateway/services/register
```http
POST /api/gateway/services/register
Authorization: Bearer {token}
Content-Type: application/json

{
    "serviceName": "order-service",
    "serviceUrl": "http://order-service:8080",
    "healthCheckUrl": "http://order-service:8080/health",
    "loadBalancingStrategy": "round-robin"
}
```

#### PUT /api/gateway/services/{serviceName}/config
```http
PUT /api/gateway/services/{serviceName}/config
Authorization: Bearer {token}
Content-Type: application/json

{
    "rateLimit": 1000,
    "timeout": 5000,
    "retryAttempts": 3
}
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Redis 6.0+
- Docker and Docker Compose
- Consul (optional)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd backend-services/orchestration_service

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
PORT=7001
ENV=development

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_pass

# Service Configuration
SERVICE_NAME=orchestration-service
SERVICE_VERSION=1.0.0

# Gateway Configuration
RATE_LIMIT=1000
TIMEOUT=5000
MAX_RETRIES=3

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=3600
```

## 👨‍💻 Development

### Project Structure
```
orchestration_service/
├── app/
│   ├── api/                    # API endpoints
│   ├── core/                   # Core functionality
│   ├── gateway/                # Gateway implementation
│   ├── services/               # Service management
│   ├── middleware/             # Request middleware
│   └── utils/                  # Utilities
├── tests/
│   ├── integration/            # Integration tests
│   └── unit/                   # Unit tests
└── docs/                       # Documentation
```

### Building
```bash
# Build Docker image
docker build -t orchestration-service .

# Run with Docker
docker run -p 7001:7001 orchestration-service
```

### Running Tests
```bash
# Run all tests
pytest

# Run specific test
pytest tests/unit/test_gateway.py -v
```

## 📊 Monitoring

### Health Checks
- Redis connectivity
- Service registry health
- Gateway performance
- Request latency
- Circuit breaker status

### Metrics
- Request throughput
- Response times
- Error rates
- Service availability
- Cache hit/miss ratio
- Circuit breaker trips

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.