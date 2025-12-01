# Store Service

A NestJS microservice that manages stores and their book inventory by integrating with the book-service API using axios.


## Stores (v1)

- `GET /v1/stores` - Get all stores (paginated)
  - Query parameters: `?page=1&limit=10` (optional, defaults: page=1, limit=10)
  - Returns: `{ data: Store[], meta: { total, page, limit, totalPages, pageCount } }`
- `GET /v1/stores/:id` - Get store by ID
- `POST /v1/stores` - Create a new store
  ```json
  {
    "name": "Bookstore Central",
  }
  ```
- `PUT /v1/stores/:id` - Update a store (requires all fields)
- `DELETE /v1/stores/:id` - Delete a store

## Store Books Management

- `POST /v1/stores/:id/books` - Add a book to a store
  ```json
  {
    "bookId": 1
  }
  ```
- `GET /v1/stores/:id/books` - Get all books in a store (fetched from book-service)
- `DELETE /v1/stores/:id/books/:bookId` - Remove a book from a store

## Architecture

The store-service:
- Stores store information in its own MySQL database
- Stores book IDs for each store in a separate storeBooks collection
- Uses axios (via @nestjs/axios) to fetch book details from book-service
- Validates that books exist in book-service before adding them to stores

## Testing

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
- `BOOK_SERVICE_URL` - URL of the book-service (default: http://book-service:3000)

