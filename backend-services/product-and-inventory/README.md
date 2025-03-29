<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

[![NPM Version](https://img.shields.io/npm/v/@nestjs/core.svg)](https://www.npmjs.com/~nestjscore)
[![License](https://img.shields.io/npm/l/@nestjs/core.svg)](https://github.com/nestjs/nest)
[![NPM Downloads](https://img.shields.io/npm/dm/@nestjs/common.svg)](https://www.npmjs.com/~nestjscore)
[![CircleCI](https://img.shields.io/circleci/build/github/nestjs/nest/master)](https://circleci.com/gh/nestjs/nest)

## Description

This project is a **Product & Inventory Management Microservice** built with [NestJS](https://nestjs.com), MongoDB (via Mongoose), and RabbitMQ. It provides  microservice event patterns to handle:

- Product CRUD operations
- Category management
- Inventory tracking and stock updates

The microservice leverages NestJS's modular architecture to separate concerns into distinct modules (e.g., products and categories) and integrates with RabbitMQ for asynchronous messaging.

## Project Setup

### Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:Algos70/micro-services.git
   cd backend-services/product-and-inventory
   ```
   
## Compile and Run the Project

### Production Mode

```bash
docker compose up --build
```

## Compodoc Documentation

This project uses [Compodoc](https://compodoc.app) to automatically generate project documentation.

### Generating Documentation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Generate and run the documentation:**

   ```bash
   npx compodoc -p tsconfig.json -s
   ```


Open your browser and navigate to `http://localhost:8080` (or the URL provided by Compodoc) to view your project's documentation.

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Compodoc Documentation](https://compodoc.app)


## License

This project is licensed under the MIT License.