# Microservices E-commerce Platform

This is a microservices-based e-commerce platform that consists of multiple services working together to provide a complete shopping experience.

## Services Overview

- **Authentication Service**: Handles user authentication and authorization
- **Order Service**: Manages order processing and tracking
- **Payment Service**: Handles payment processing
- **Product & Inventory Service**: Manages product catalog and inventory
- **Orchestration Service**: Coordinates between different services
- **Frontend**: React-based web interface

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd backend-services
```

2. Create a `.env` file in the root directory with the following environment variables:

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

# RabbitMQ Configuration
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest

# Service Ports
AUTH_SERVICE_PORT=8086
ORDER_SERVICE_PORT=8080
PAYMENT_SERVICE_PORT=9001
ORCHESTRATION_SERVICE_PORT=7001
PRODUCT_SERVICE_PORT=9292
FRONTEND_PORT=5173
```

3. Start all services:
```bash
docker-compose up -d
```

## Service Details

### Authentication Service
The Authentication Service is a .NET Core-based service that handles user authentication and authorization for the entire platform. It provides secure user management, JWT token generation, and role-based access control.

#### Architecture
- **Framework**: .NET Core
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) with Auth0 integration
- **API Documentation**: Swagger/OpenAPI
- **Port**: 8086

#### Key Features
- User registration and management
- JWT-based authentication
- Role-based authorization
- CORS support for frontend integration
- Swagger API documentation
- Database migrations support
- Secure cookie handling

#### Project Structure
```
AuthenticationService/
├── Controllers/         # API endpoints
├── Services/           # Business logic
├── Interfaces/         # Service contracts
├── DTOs/              # Data transfer objects
├── Entities/          # Database models
├── Contexts/          # Database context
├── Repositories/      # Data access layer
├── Extensions/        # Custom extensions
├── Mappings/          # Object mapping profiles
└── Settings/          # Configuration settings
```

#### Environment Variables
```env
# Database Configuration
ConnectionStrings__DefaultConnection=Host=postgres;Database=authentication_service;Username=electi;Password=536051;Port=5432;Pooling=true;

# Auth0 Configuration
Auth0__Domain=your-auth0-domain
Auth0__Audience=your-auth0-audience

# Application Settings
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8086
```

#### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/validate` - Token validation
- `GET /api/auth/profile` - User profile information
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/refresh` - Refresh JWT token

#### Security Features
- JWT token-based authentication
- Role-based access control
- Secure password hashing
- CORS protection
- HTTPS redirection
- SameSite cookie policy
- Token validation and lifetime management

#### Dependencies
- Entity Framework Core
- PostgreSQL
- Auth0
- JWT Bearer Authentication
- Swagger/OpenAPI

#### Development Setup
1. Ensure PostgreSQL is running
2. Set up Auth0 credentials
3. Configure environment variables
4. Run database migrations
5. Start the service using Docker Compose

#### Health Checks
The service includes built-in health checks for:
- Database connectivity
- Auth0 service availability
- API endpoint availability

### Order Service
The Order Service is a Python-based microservice that handles order processing, management, and tracking in the e-commerce platform. It integrates with other services through RabbitMQ for event-driven operations and maintains order data in MySQL.

#### Architecture
- **Framework**: FastAPI
- **Database**: MySQL
- **Message Broker**: RabbitMQ
- **ORM**: SQLAlchemy
- **Port**: 8080

#### Key Features
- Order creation and management
- Order status tracking
- Event-driven architecture
- Saga pattern integration
- Authentication integration
- Database transaction management
- API documentation with Swagger
- Health monitoring

#### Project Structure
```
order/
├── app/
│   ├── main.py                # Application entry point
│   │   └── endpoints/         # API route handlers
│   ├── core/
│   │   └── config.py         # Configuration settings
│   ├── entity/
│   │   └── order.py          # Database models
│   ├── dtos/
│   │   └── order_schema.py   # Data transfer objects
│   ├── db/
│   │   ├── dependencies.py   # Database dependencies
│   │   └── base.py          # Database connection
│   └── services/
│       ├── order_service.py  # Business logic
│       ├── auth_service.py   # Authentication
│       └── rabbitmq_publisher.py
└── tests/                    # Test suite
```

#### Environment Variables
```env
# Database Configuration
DATABASE_HOST=mysql
DATABASE_NAME=orders_db
DATABASE_USER=root
DATABASE_PASSWORD=root

# RabbitMQ Configuration
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Auth Service Configuration
AUTHERIZATION_SERVER_URL=http://auth-service
AUTHORIZATION_SERVER_PORT=8086
```

#### API Endpoints
- **Orders**
  - `POST /orders` - Create new order
  - `GET /orders` - List all orders
  - `GET /orders/{order_id}` - Get order details
  - `PUT /orders/{order_id}` - Update order
  - `DELETE /orders/{order_id}` - Cancel order
  - `GET /orders/user/{user_id}` - Get user orders
  - `GET /orders/status/{status}` - Get orders by status

#### Dependencies
- FastAPI
- SQLAlchemy
- MySQL
- RabbitMQ
- Pydantic
- Uvicorn
- Python-Jose (JWT)
- Requests

#### Development Setup
1. Create virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run locally:
```bash
uvicorn app.main:app --reload --port 8080
```

#### Database Setup
1. Start MySQL container:
```bash
docker run --name mysql-dev \
  --network app-network \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=orders_db \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=mypassword \
  -p 3306:3306 \
  -d mysql:8.0
```

2. Configure database access:
```sql
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

#### Error Handling
- Database transaction rollback
- Event retry mechanisms
- Error logging
- Exception handling
- Validation errors
- Authentication errors

#### Testing
Run tests using pytest:
```bash
pytest
```

#### Health Checks
The service includes built-in health checks for:
- Database connectivity
- RabbitMQ connection
- Auth service availability
- API endpoint status
- Service dependencies

### Payment Service
The Payment Service is a Python-based microservice that handles payment processing, transaction management, and payment status tracking in the e-commerce platform. It integrates with other services through RabbitMQ for event-driven operations and maintains payment data in MySQL.

#### Architecture
- **Framework**: FastAPI
- **Database**: MySQL
- **Message Broker**: RabbitMQ
- **ORM**: SQLAlchemy
- **Port**: 9001

#### Key Features
- Payment processing
- Transaction management
- Payment status tracking
- Event-driven architecture
- Saga pattern integration
- Authentication integration
- Database transaction management
- API documentation with Swagger
- Health monitoring

#### Project Structure
```
payment/
├── app/
│   ├── main.py                # Application entry point
│   ├── api/
│   │   ├── dependencies.py    # API dependencies
│   │   └── endpoints/         # API route handlers
│   ├── core/
│   │   └── config.py         # Configuration settings
│   ├── models/
│   │   └── payment.py        # Database models
│   ├── schemas/
│   │   └── payment_schema.py # Data validation schemas
│   ├── db/
│   │   ├── dependencies.py   # Database dependencies
│   │   └── base.py          # Database connection
│   └── services/
│       ├── payment_service.py # Business logic
│       ├── auth_service.py    # Authentication
│       └── rabbitmq_publisher.py
└── tests/                    # Test suite
```

#### Environment Variables
```env
# Database Configuration
DATABASE_HOST=mysql
DATABASE_NAME=payments_db
DATABASE_USER=root
DATABASE_PASSWORD=root

# RabbitMQ Configuration
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Auth Service Configuration
AUTHERIZATION_SERVER_URL=http://auth-service
AUTHORIZATION_SERVER_PORT=8086
```

#### API Endpoints
- **Payments**
  - `POST /payments` - Process new payment
  - `GET /payments` - List all payments
  - `GET /payments/{payment_id}` - Get payment details
  - `PUT /payments/{payment_id}` - Update payment
  - `DELETE /payments/{payment_id}` - Cancel payment
  - `GET /payments/user/{user_id}` - Get user payments
  - `GET /payments/status/{status}` - Get payments by status
  - `POST /payments/refund/{payment_id}` - Process refund

#### Dependencies
- FastAPI
- SQLAlchemy
- MySQL
- RabbitMQ
- Pydantic
- Uvicorn
- Python-Jose (JWT)
- Requests

#### Development Setup
1. Create virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run locally:
```bash
uvicorn app.main:app --reload --port 9001
```

#### Database Setup
1. Start MySQL container:
```bash
docker run --name mysql-dev \
  --network app-network \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=payments_db \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=mypassword \
  -p 3306:3306 \
  -d mysql:8.0
```

2. Configure database access:
```sql
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

#### Error Handling
- Database transaction rollback
- Payment processing retry
- Error logging
- Exception handling
- Validation errors
- Authentication errors
- Payment gateway errors

#### Testing
Run tests using pytest:
```bash
pytest
```

#### Health Checks
The service includes built-in health checks for:
- Database connectivity
- RabbitMQ connection
- Auth service availability
- API endpoint status
- Payment gateway status
- Service dependencies

### Product & Inventory Service
The Product & Inventory Service is a Go-based microservice that manages the product catalog, inventory levels, and category management. It provides real-time inventory tracking and integrates with other services through RabbitMQ for event-driven operations.

#### Architecture
- **Framework**: Go with Gin
- **Database**: MongoDB
- **Message Broker**: RabbitMQ
- **API Documentation**: Swagger/OpenAPI
- **Port**: 9292

#### Key Features
- Product catalog management
- Category management
- Real-time inventory tracking
- Transaction history
- Event-driven architecture
- RESTful API endpoints
- Swagger documentation
- CORS support

#### Project Structure
```
inventory_go/
├── api/              # API handlers and routes
├── service/          # Business logic
├── infrastructure/   # Database and external service connections
├── rabbitmq/         # Message broker integration
├── product/          # Product domain logic
├── category/         # Category domain logic
├── transaction/      # Transaction handling
└── docs/            # API documentation
```

#### Environment Variables
```env
# MongoDB Configuration
MONGO_URL=mongodb://mongodb:27017/inventory

# Collection Names
CATEGORY_COLLECTION=categories
PRODUCT_COLLECTION=products
TRANSACTION_COLLECTION=transactions

# RabbitMQ Configuration
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
PRODUCT_QUEUE=products_queue
ORCHESTRATION_QUEUE=orchestration_queue
```

#### API Endpoints
- **Categories**
  - `GET /api/categories` - List all categories
  - `POST /api/categories` - Create new category
  - `GET /api/categories/:id` - Get category details
  - `PUT /api/categories/:id` - Update category
  - `DELETE /api/categories/:id` - Delete category

- **Products**
  - `GET /api/products` - List all products
  - `POST /api/products` - Create new product
  - `GET /api/products/:id` - Get product details
  - `PUT /api/products/:id` - Update product
  - `DELETE /api/products/:id` - Delete product
  - `GET /api/products/category/:categoryId` - Get products by category

#### Message Queue Integration
- **Consumers**
  - Product queue for inventory updates
  - Order processing events
  - Stock level notifications

- **Publishers**
  - Orchestration queue for service coordination
  - Inventory update notifications
  - Stock level alerts

#### Dependencies
- Gin Web Framework
- MongoDB Go Driver
- RabbitMQ Client
- Swagger/OpenAPI
- Go Modules

#### Development Setup
1. Ensure MongoDB is running
2. Configure RabbitMQ connection
3. Set environment variables
4. Run the service:
```bash
go mod download
go run main.go
```

#### Health Checks
The service includes built-in health checks for:
- MongoDB connectivity
- RabbitMQ connection
- API endpoint availability
- Message queue consumers

#### Error Handling
- Graceful shutdown
- Connection retry mechanisms
- Error logging
- Recovery middleware
- CORS error handling

### Orchestration Service
The Orchestration Service is a Python-based microservice that implements the Saga pattern to coordinate distributed transactions across the e-commerce platform. It ensures data consistency and handles complex workflows between different services using event-driven architecture.

#### Architecture
- **Framework**: FastAPI
- **Message Broker**: RabbitMQ
- **State Management**: Redis
- **Authentication**: JWT with Auth Service
- **Port**: 7001

#### Key Features
- Saga pattern implementation
- Distributed transaction coordination
- Event-driven workflow management
- State persistence with Redis
- Authentication verification
- Health monitoring
- Error handling and compensation
- Event logging and tracking

#### Project Structure
```
orchestration_service/
├── app/
│   ├── main.py           # FastAPI application entry point
│   ├── config.py         # Configuration settings
│   ├── routers/          # API route handlers
│   ├── services/         # Business logic & external services
│   ├── models/           # Data models & schemas
│   └── events/           # Event definitions
├── tests/                # Test files
└── requirements.txt      # Python dependencies
```

## Environment Variables

### Global Configuration
```env
# RabbitMQ Configuration
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0

# MySQL Configuration
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=orders_db
MYSQL_USER=myuser
MYSQL_PASSWORD=mypassword

# PostgreSQL Configuration
POSTGRES_DB=authentication_service
POSTGRES_USER=electi
POSTGRES_PASSWORD=536051

# MongoDB Configuration
MONGO_URL=mongodb://mongodb:27017/inventory
CATEGORY_COLLECTION=categories
PRODUCT_COLLECTION=products
TRANSACTION_COLLECTION=transactions
```

### Service-Specific Configuration

#### Authentication Service
```env
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__DefaultConnection=Host=postgres;Database=authentication_service;Username=electi;Password=536051;Port=5432;Pooling=true;
ASPNETCORE_URLS=http://+:8086
```

#### Order Service
```env
DATABASE_HOST=mysql
DATABASE_NAME=orders_db
DATABASE_USER=root
DATABASE_PASSWORD=root
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
AUTHERIZATION_SERVER_URL=http://auth-service
AUTHORIZATION_SERVER_PORT=8086
```

#### Payment Service
```env
DATABASE_HOST=mysql
DATABASE_NAME=payments_db
DATABASE_USER=root
DATABASE_PASSWORD=root
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
AUTHERIZATION_SERVER_URL=http://auth-service
AUTHORIZATION_SERVER_PORT=8086
```

#### Product & Inventory Service
```env
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
ORCHESTRATION_QUEUE=orchestration_queue
PRODUCT_QUEUE=products_queue
MONGO_URL=mongodb://mongodb:27017/inventory
CATEGORY_COLLECTION=categories
PRODUCT_COLLECTION=products
TRANSACTION_COLLECTION=transactions
```

#### Orchestration Service
```env
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
AUTHERIZATION_SERVER_HOST=http://auth-service
AUTHORIZATION_SERVER_PORT=8086
```