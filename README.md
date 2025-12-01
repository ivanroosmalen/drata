# Drata take-home project

This project contains two services:
- book-service
- store-service

Book service manages entities like books, authors, and publishers. The Store service manages bookstores and their inventory.


## Prerequisites

- Node.js (v20 or higher)
- Docker and Docker Compose (for containerized setup)

## Getting Started

Use Docker Compose

1. Start the application and database:
   ```bash
   docker-compose up --build
   ```

2. Book-service will be available at `http://localhost:3000`
   - Store-service will be available at `http://localhost:3001`
   - MySQL will be available at `localhost:3306`


## Testing
See individual service README for API integrations and how to run tests on the repos.
