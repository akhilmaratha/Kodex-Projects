# Product CRUD API

Simple CRUD API for managing products using Express.js

## Setup

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### GET /api/products
Get all products

### GET /api/products/:id
Get a single product

### POST /api/products
Create new product

Body:
```json
{
  "name": "Laptop",
  "price": 999,
  "description": "Gaming laptop",
  "category": "Electronics",
  "stock": 10
}
```

### PUT /api/products/:id
Update a product

Body (same as POST)

### DELETE /api/products/:id
Delete a product

## Error Handling

- 404: Product not found
- 400: Missing required fields
- 500: Server error
