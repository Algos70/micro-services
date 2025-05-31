# Inventory Service

[![Go](https://img.shields.io/badge/Go-1.16+-00ADD8.svg)](https://golang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Required-2496ED.svg)](https://www.docker.com/)

<div align="center">
  <img src="docs/inventory-service.png" alt="Inventory Service Architecture" width="600"/>
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

The Inventory Service is a high-performance inventory management system built with Go. It provides real-time stock tracking, product management, and inventory operations for the e-commerce platform.

### Key Features
- 📦 Real-time inventory tracking
- 🔄 Stock level management
- 📊 Product categorization
- 🔍 Search functionality
- 📈 Stock movement history
- ⚡ High-performance operations
- 🔒 Data consistency
- 📱 RESTful API

## 🏗️ Architecture

### Design Patterns
- **CQRS** - Command Query Responsibility Segregation
- **Repository Pattern** - Data access abstraction
- **Factory Pattern** - Object creation
- **Observer Pattern** - Event handling
- **Strategy Pattern** - Algorithm selection
- **Unit of Work** - Transaction management
- **Event Sourcing** - State tracking

### Technology Stack
- **Language**: Go 1.16+
- **Framework**: Gin
- **Database**: MongoDB
- **ORM**: GORM
- **Testing**: Go testing, testify
- **Documentation**: Swagger
- **Monitoring**: Prometheus
- **Logging**: Zap

## 📚 API Documentation

### Product Endpoints

#### GET /api/products
```http
GET /api/products?page=1&limit=10
Authorization: Bearer {token}
```

#### POST /api/products
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99,
    "category": "Electronics",
    "stock": 100
}
```

#### PUT /api/products/{id}
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Updated Product Name",
    "price": 89.99,
    "stock": 150
}
```

### Inventory Endpoints

#### GET /api/inventory/{productId}
```http
GET /api/inventory/{productId}
Authorization: Bearer {token}
```

#### POST /api/inventory/adjust
```http
POST /api/inventory/adjust
Authorization: Bearer {token}
Content-Type: application/json

{
    "productId": "123",
    "quantity": -5,
    "reason": "Sale"
}
```

## 🚀 Getting Started

### Prerequisites
- Go 1.16+
- MongoDB 4.4+
- Docker and Docker Compose
- Make (optional)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd backend-services/inventory_go

# Install dependencies
go mod download

# Run the service
go run cmd/main.go
```

### Environment Setup
Create a `.env` file:
```env
# Server Configuration
PORT=9292
ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017
MONGO_DB=inventory_db
MONGO_USER=inventory_user
MONGO_PASSWORD=inventory_pass

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=3600

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_pass
```

## 👨‍💻 Development

### Project Structure
```
inventory_go/
├── cmd/
│   └── main.go                 # Application entry point
├── internal/
│   ├── api/                    # API handlers
│   ├── config/                 # Configuration
│   ├── domain/                 # Domain models
│   ├── repository/             # Data access
│   ├── service/                # Business logic
│   └── middleware/             # HTTP middleware
├── pkg/
│   ├── logger/                 # Logging
│   ├── validator/              # Input validation
│   └── utils/                  # Utilities
├── test/
│   ├── integration/            # Integration tests
│   └── unit/                   # Unit tests
└── docs/                       # Documentation
```

### Building
```bash
# Build the application
go build -o bin/inventory-service cmd/main.go

# Build for different platforms
make build-all
```

### Running Tests
```bash
# Run all tests
go test ./...

# Run specific test
go test ./internal/service -v
```

## 📊 Monitoring

### Health Checks
- Database connectivity
- Redis connection
- Memory usage
- Goroutine count
- Request latency

### Metrics
- Product operations
- Stock adjustments
- API response times
- Error rates
- Cache hit/miss ratio
- Database query performance

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details. 