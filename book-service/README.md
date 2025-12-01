# Book-Service

A NestJS microservice that manages books, authors, and publishers

## Authors (v1)
- `GET /v1/authors` - Get all authors (paginated)
  - Query parameters: `?page=1&limit=10` (optional, defaults: page=1, limit=10)
  - Returns: `{ data: Author[], meta: { total, page, limit, totalPages } }`
- `GET /v1/authors/:id` - Get author by ID
- `POST /v1/authors` - Create a new author
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
  }
  ```
- `PUT /v1/authors/:id` - Update an author (requires all fields)
- `DELETE /v1/authors/:id` - Delete an author

## Books (v1)
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

## Publishers (v1)
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

## Environment Variables

- `PORT` - Service port (default: 3001)
- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port
- `DB_USERNAME` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_DATABASE` - MySQL database name
