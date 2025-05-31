# Microservices Architecture

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Go](https://img.shields.io/badge/Go-1.16+-00ADD8.svg)](https://golang.org/)
[![.NET](https://img.shields.io/badge/.NET-6.0+-512BD4.svg)](https://dotnet.microsoft.com/)
[![Docker](https://img.shields.io/badge/Docker-Required-2496ED.svg)](https://www.docker.com/)

<div align="center">
  <img src="docs/architecture.png" alt="System Architecture" width="800"/>
</div>

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Services](#services)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Monitoring](#monitoring)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🚀 Overview

A scalable e-commerce platform built with microservices architecture. This system implements industry best practices and patterns to ensure high availability, scalability, and maintainability.

### Key Features
- 🔐 Secure authentication and authorization
- 📦 Real-time inventory management
- 🛒 Order processing and tracking
- 💳 Secure payment processing
- 🔄 Event-driven architecture
- 📊 Service monitoring
- 🔍 Request tracing
- 🛡️ Circuit breaker implementation

## 🏗️ Architecture

### Design Patterns
- **Saga Pattern** - Distributed transactions
- **CQRS** - Command Query Responsibility Segregation
- **Event Sourcing** - Reliable event tracking
- **Circuit Breaker** - Fault tolerance
- **API Gateway** - Request routing and composition
- **Service Discovery** - Dynamic service location
- **Event-Driven** - Asynchronous communication

## 🛠️ Services

### 1. Authentication Service (.NET Core)
- User authentication and authorization
- JWT-based security
- OAuth 2.0 and OpenID Connect
- [View Documentation](./backend-services/AuthenticationService/README.md)

### 2. Inventory Service (Go)
- Product inventory management
- Real-time stock tracking
- CQRS implementation
- [View Documentation](./backend-services/inventory_go/README.md)

### 3. Order Service (Python/FastAPI)
- Order lifecycle management
- Payment integration
- Saga pattern implementation
- [View Documentation](./backend-services/order/README.md)

### 4. Orchestration Service (Python/FastAPI)
- Service coordination
- Load balancing
- API Gateway implementation
- [View Documentation](./backend-services/orchestration_service/README.md)

### 5. Payment Service (Python/FastAPI)
- Payment processing
- Transaction management
- Circuit breaker implementation
- [View Documentation](./backend-services/payment/README.md)

## 💻 Tech Stack

### Languages & Frameworks
- **Python**: FastAPI, SQLAlchemy, Pydantic
- **Go**: Gin, GORM
- **.NET Core**: ASP.NET Core, Entity Framework Core
- **Frontend**: React, TypeScript, Material-UI

### Infrastructure
- **Databases**: 
  - PostgreSQL (Authentication Service)
  - MySQL (Order and Payment Services)
  - MongoDB (Inventory Service)
  - Redis (Caching)
- **Message Queue**: RabbitMQ
- **Containerization**: Docker, Docker Compose

### Monitoring & Security
- **Metrics**: Prometheus, Grafana
- **Logging**: ELK Stack
- **Security**: JWT, OAuth 2.0

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Python 3.8+
- Go 1.16+
- .NET Core 6.0+
- Node.js 16+

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd micro-services

# Load Docker images
docker load -i microservices_bundle.tar

# Start services
cd backend-services
./start.bat  # Windows
# or
docker-compose up -d  # Unix
```

### Environment Setup
Create a `.env` file in the root directory:
```env
# Database Configurations
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=orders_db
MYSQL_USER=myuser
MYSQL_PASSWORD=mypassword

# PostgreSQL Configuration
POSTGRES_DB=authentication_service
POSTGRES_USER=electi
POSTGRES_PASSWORD=536051

# MongoDB Configuration
MONGO_URI=mongodb://mongodb:27017
MONGO_DB=inventory_db
MONGO_USER=inventory_user
MONGO_PASSWORD=inventory_pass

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis_pass

# RabbitMQ Configuration
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672

# Service Ports
AUTH_SERVICE_PORT=8086
ORDER_SERVICE_PORT=8080
PAYMENT_SERVICE_PORT=9001
ORCHESTRATION_SERVICE_PORT=7001
INVENTORY_SERVICE_PORT=9292
```

## 👨‍💻 Development

### Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Update documentation
6. Submit a pull request

### Testing
```bash
cd backend-services
./test.bat  # Windows
# or
docker-compose -f docker-compose.ci.yml up  # Unix
```

## 📊 Monitoring

### Metrics & Logging
- Prometheus for metrics collection
- Grafana for visualization
- ELK Stack for log aggregation

### Health Checks
- Service health endpoints
- Database connectivity
- Message queue status
- Cache availability

## 🔒 Security

### Authentication & Authorization
- JWT-based authentication
- OAuth 2.0 and OpenID Connect
- Role-based access control
- API key management

### Data Protection
- Encryption at rest and in transit
- Secure service communication
- Environment-based configuration
- Input validation and sanitization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- 📚 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/yourusername/micro-services/issues)
- 💻 [Development Team](mailto:dev@example.com)
- 💬 [Slack Channel](https://slack.example.com)
- 🕒 Weekly Office Hours: [Schedule](https://calendly.com/yourusername/office-hours)
