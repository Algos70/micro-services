# Order Service

## Description
A microservice for order processing built with FastAPI and SQLAlchemy.

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
  --network app-network \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=orders_db \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=mypassword \
  -p 3306:3306 \
  -d mysql:8.0
```
## To Connect To Your Docker Mysql Image
```bash
docker exec -it mysql-dev mysql -u root -p
```

## Add Access To The DB
```
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;
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
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py          # Configuration settings (DB, broker URLs, etc.)
│   ├── entity/
│   │   ├── __init__.py
│   │   ├── order.py           
│   ├── dtos/
│   │   ├── __init__.py
│   │   ├── order_schema.py    # Pydantic models for orders
│   ├── db/
│   │   ├── __init__.py
│   │   └── base.py            # Database connection and session handling
│   └── services/
│       ├── __init__.py
│       ├── order_service.py   # Business logic for orders (including Saga pattern)
├── tests/                     # Test suite for your application
│   ├── __init__.py
│   ├── test_orders.py
├── requirements.txt           # Python dependencies
├── Dockerfile                 # (Optional) Containerization file
└── README.md                  # Project documentation

```

## API Endpoints

### Orders

## Development


## Build Docker Image And Run it
First build the docker image of the app
```bash
sudo docker build \
--build-arg DATABASE_HOST=mysql-dev:3306 \
--build-arg DATABASE_PASSWORD=root \
--build-arg DATABASE_NAME=orders_db \
--build-arg DATABASE_USER=root \
-t my_fastapi_app:latest .
```
Than connect db and service to the same network(all the services and the database must be in the same network):
For more information $ docker network
```bash
sudo docker run --name fastapi-container --network app-network -d my_fastapi_app:latest

```
Run tests:
```bash
pytest
```