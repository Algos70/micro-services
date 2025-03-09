# Order and Payment Service

## Description
A microservice for order processing and payment operations built with FastAPI and SQLAlchemy.

## Tech Stack
- FastAPI - High-performance web framework
- SQLAlchemy - SQL toolkit and ORM
- MySQL - Database
- Docker - Containerization
- Pydantic - Data validation
- Uvicorn - ASGI server

## Prerequisites
- Python 3.8+
- Docker
- pip

## Database Setup
Start the MySQL database using Docker:

```bash
docker run --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=mydatabase \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=mypassword \
  -p 3306:3306 \
  -d mysql:8.0
```
## To Connect To Your Docker Mysql Image
```bash
docker exec -it mysql-dev mysql -u root -p
```
## Installation

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Mac/Linux
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```
## To Run The App
```bash
. venv/bin/activate
fastapi dev app/main.py
```
## Project Structure
```
project/
├── app/
│   ├── main.py                # Application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── endpoints/
│   │       ├── __init__.py
│   │       ├── orders.py      # Contains routes for orders
│   │       └── payments.py    # Contains routes for payments
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py          # Configuration settings (DB, broker URLs, etc.)
│   ├── models/
│   │   ├── __init__.py
│   │   ├── order.py           # Pydantic models and/or ORM models for orders
│   │   └── payment.py         # Pydantic models and/or ORM models for payments
│   ├── db/
│   │   ├── __init__.py
│   │   └── base.py            # Database connection and session handling
│   └── services/
│       ├── __init__.py
│       ├── order_service.py   # Business logic for orders (including Saga pattern)
│       └── payment_service.py # Business logic for payments
├── tests/                     # Test suite for your application
│   ├── __init__.py
│   ├── test_orders.py
│   └── test_payments.py
├── requirements.txt           # Python dependencies
├── Dockerfile                 # (Optional) Containerization file
└── README.md                  # Project documentation

```

## API Endpoints

### Orders

### Payments


## Development

Run tests:
```bash
pytest
```