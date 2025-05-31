# Authentication Service

[![.NET](https://img.shields.io/badge/.NET-6.0+-512BD4.svg)](https://dotnet.microsoft.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Required-2496ED.svg)](https://www.docker.com/)

<div align="center">
  <img src="docs/auth-service.png" alt="Authentication Service Architecture" width="600"/>
</div>

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Development](#development)
- [Security](#security)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Contributing](#contributing)

## 🚀 Overview

The Authentication Service is a secure, scalable identity management system built with .NET Core. It provides robust authentication and authorization capabilities for the entire microservices ecosystem.

### Key Features
- 🔐 JWT-based authentication
- 🔑 OAuth 2.0 and OpenID Connect
- 👥 User and role management
- 🔒 Password hashing and security
- 🔄 Token refresh mechanism
- 📝 Audit logging
- 🛡️ Rate limiting
- 🔍 Activity monitoring

## 🏗️ Architecture

### Design Patterns
- **Repository Pattern** - Data access abstraction
- **Unit of Work** - Transaction management
- **CQRS** - Command Query Responsibility Segregation
- **Mediator** - Request handling
- **Factory** - Object creation
- **Strategy** - Algorithm selection
- **Observer** - Event handling

### Technology Stack
- **Framework**: .NET Core 6.0
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core
- **Authentication**: JWT, OAuth 2.0
- **API Documentation**: Swagger/OpenAPI
- **Testing**: xUnit, Moq
- **Logging**: Serilog
- **Monitoring**: Prometheus, Grafana

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securepassword"
}
```

#### POST /api/auth/register
```http
POST /api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securepassword",
    "firstName": "John",
    "lastName": "Doe"
}
```

#### POST /api/auth/refresh
```http
POST /api/auth/refresh
Content-Type: application/json

{
    "refreshToken": "your-refresh-token"
}
```

### User Management Endpoints

#### GET /api/users/{id}
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

#### PUT /api/users/{id}
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
}
```

## 🚀 Getting Started

### Prerequisites
- .NET Core 6.0 SDK
- PostgreSQL 13+
- Docker and Docker Compose
- Visual Studio 2022 or VS Code

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd backend-services/AuthenticationService

# Restore dependencies
dotnet restore

# Run the service
dotnet run
```

### Environment Setup
Create a `appsettings.json` file:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=auth_db;Username=postgres;Password=your_password"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key",
    "Issuer": "your-issuer",
    "Audience": "your-audience",
    "ExpirationInMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  }
}
```

## 👨‍💻 Development

### Project Structure
```
AuthenticationService/
├── src/
│   ├── AuthenticationService.API/        # API project
│   ├── AuthenticationService.Core/       # Domain models
│   ├── AuthenticationService.Infrastructure/  # Data access
│   └── AuthenticationService.Application/     # Business logic
├── tests/
│   ├── AuthenticationService.UnitTests/  # Unit tests
│   └── AuthenticationService.IntegrationTests/  # Integration tests
└── docs/                                # Documentation
```

### Building
```bash
dotnet build
```

### Running Tests
```bash
dotnet test
```

## 🔒 Security

### Authentication Flow
1. User submits credentials
2. Service validates credentials
3. JWT token generated
4. Refresh token issued
5. Tokens returned to client

### Security Measures
- Password hashing with bcrypt
- JWT token encryption
- Rate limiting
- CORS configuration
- HTTPS enforcement
- Input validation
- SQL injection prevention
- XSS protection

## 📊 Monitoring

### Health Checks
- Database connectivity
- External service dependencies
- Memory usage
- CPU utilization
- Request latency

### Metrics
- Authentication attempts
- Failed logins
- Token refreshes
- User registrations
- API response times
- Error rates

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details. 