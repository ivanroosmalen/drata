# NestJS MySQL Project

A NestJS application with MySQL database integration, comprehensive testing, and Docker support.

## Features

- ✅ NestJS framework with TypeScript
- ✅ MySQL database integration using TypeORM
- ✅ RESTful API with CRUD operations
- ✅ Unit tests and E2E tests
- ✅ Docker and Docker Compose setup
- ✅ Input validation with class-validator
- ✅ Environment configuration

## Prerequisites

- Node.js (v20 or higher)
- Docker and Docker Compose (for containerized setup)
- MySQL (if running locally without Docker)

## Getting Started

### Option 1: Using Docker Compose (Recommended)

1. Clone the repository and navigate to the project directory

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Start the application and database:
   ```bash
   docker-compose up -d
   ```

4. The application will be available at `http://localhost:3000`
   - MySQL will be available at `localhost:3306`

### Option 2: Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your MySQL database and update the `.env` file with your database credentials

3. Start the development server:
   ```bash
   npm run start:dev
   ```

## API Endpoints

The API uses URI versioning. All endpoints are prefixed with `/v1`.

### Health Check
- `GET /` - Returns "Hello World!"
- `GET /health` - Returns health status

### Authors (v1)
- `GET /v1/authors` - Get all authors (paginated)
  - Query parameters: `?page=1&limit=10` (optional, defaults: page=1, limit=10)
  - Returns: `{ data: Author[], meta: { total, page, limit, totalPages } }`
- `GET /v1/authors/:id` - Get author by ID
- `POST /v1/authors` - Create a new author
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- `PUT /v1/authors/:id` - Update an author (requires all fields)
- `DELETE /v1/authors/:id` - Delete an author

### Books (v1)
- `GET /v1/books` - Get all books (paginated)
  - Query parameters: `?page=1&limit=10` (optional, defaults: page=1, limit=10)
  - Returns: `{ data: Book[], meta: { total, page, limit, totalPages } }`
- `GET /v1/books/:id` - Get book by ID
- `POST /v1/books` - Create a new book
  ```json
  {
    "title": "The Great Book",
    "authorId": 1,
    "publisherId": 1,
    "releaseDate": "2023-01-01"
  }
  ```
- `PUT /v1/books/:id` - Update a book (requires all fields)
- `DELETE /v1/books/:id` - Delete a book

### Publishers (v1)
- `GET /v1/publishers` - Get all publishers (paginated)
  - Query parameters: `?page=1&limit=10` (optional, defaults: page=1, limit=10)
  - Returns: `{ data: Publisher[], meta: { total, page, limit, totalPages, pageCount } }`
- `GET /v1/publishers/:id` - Get publisher by ID
- `POST /v1/publishers` - Create a new publisher
  ```json
  {
    "name": "Penguin Books",
    "address": "123 Publishing St"
  }
  ```
- `PUT /v1/publishers/:id` - Update a publisher (requires all fields)
- `DELETE /v1/publishers/:id` - Delete a publisher

## Testing

The project uses a clear separation between unit tests and integration tests:
- **Unit tests** are located in the `test/` folder
- **E2E/Integration tests** are located in the `e2e/` folder

### Run unit tests:
```bash
npm run test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run tests with coverage:
```bash
npm run test:cov
```

### Run E2E/Integration tests:
```bash
npm run test:e2e
```

## Docker Commands

### Build the Docker image:
```bash
docker-compose build
```

### Start services:
```bash
docker-compose up -d
```

### View logs:
```bash
docker-compose logs -f app
```

### Stop services:
```bash
docker-compose down
```

### Stop services and remove volumes:
```bash
docker-compose down -v
```

## Project Structure

```
src/
├── authors/         # Authors module
│   ├── dto/         # Data Transfer Objects
│   ├── author.entity.ts
│   ├── authors.controller.ts
│   ├── authors.service.ts
│   └── authors.module.ts
├── app.module.ts    # Root module
├── app.controller.ts
├── app.service.ts
└── main.ts          # Application entry point

test/                # Unit tests
├── authors/         # Authors module unit tests
└── app.controller.spec.ts

e2e/                 # E2E/Integration tests
└── app.e2e-spec.ts
```

## Environment Variables

See `.env.example` for all available environment variables.

## License

MIT

