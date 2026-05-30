# E-Commerce API Backend

Simple Express and MongoDB backend for product management with JWT auth, validation, and image uploads.

## Setup

1. Install dependencies.
2. Copy `.env.example` to `.env` and update the values.
3. Start MongoDB.
4. Run `npm run dev`.

## Environment Variables

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `UPLOAD_DIR`

## Base URL

`/api`

## Auth

### Register

`POST /api/auth/register`

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login

`POST /api/auth/login`

Request body:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Products

Images are uploaded with the field name `images`.

### Get all products

`GET /api/products`

Optional query params:

- `category`
- `search`

Response:

```json
{
  "success": true,
  "count": 1,
  "products": []
}
```

### Get a product

`GET /api/products/:id`

Response:

```json
{
  "success": true,
  "product": {}
}
```

### Create a product

`POST /api/products`

Auth required: yes

Form data fields:

- `name` required
- `description` optional
- `price` required
- `category` optional
- `images` optional, multiple files

Response:

```json
{
  "success": true,
  "product": {}
}
```

### Update a product

`PUT /api/products/:id`

Auth required: yes

Form data fields are the same as create. New uploaded images are appended to the existing list.

### Delete a product

`DELETE /api/products/:id`

Auth required: yes

Response:

```json
{
  "success": true,
  "message": "Product deleted"
}
```

## Error Responses

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

Common status codes:

- `400` invalid data
- `401` missing or bad token
- `404` not found
- `500` server error

## Notes

- Uploaded files are served from `/uploads`.
- The API uses MongoDB models for users and products.
- Postman collection files are in the `postman/` folder.