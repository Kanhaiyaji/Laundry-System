# Laundry Order Management System API

A complete backend API for managing laundry orders, built with Node.js and Express.

## Features

✅ Create orders with customer info and garments  
✅ Update order status (RECEIVED, PROCESSING, READY, DELIVERED)  
✅ List and filter orders by status, customer name, or phone  
✅ Admin dashboard with statistics  
✅ Input validation  
✅ Clean, modular code structure  
✅ In-memory storage  

## Project Structure

```
Laundry/
├── server.js                    # Main server file
├── package.json                 # Project dependencies
├── models/
│   └── order.js                # Order data model & in-memory storage
├── controllers/
│   └── orderController.js       # Business logic for endpoints
├── routes/
│   └── orders.js               # API route definitions
├── utils/
│   └── validation.js           # Input validation utilities
└── README.md                    # This file
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Server will run on:**
   ```
   http://localhost:3000
   ```

## API Endpoints

### 1. Create Order
**POST** `/api/orders`

Creates a new order with unique order ID and default status.

**Request Body:**
```json
{
  "customerName": "John Doe",
  "phoneNumber": "555-123-4567",
  "garments": [
    {
      "type": "Shirt",
      "quantity": 3,
      "price": 5.00
    },
    {
      "type": "Trousers",
      "quantity": 2,
      "price": 7.50
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "ORD-1001",
    "customerName": "John Doe",
    "phoneNumber": "555-123-4567",
    "garments": [
      { "type": "Shirt", "quantity": 3, "price": 5 },
      { "type": "Trousers", "quantity": 2, "price": 7.5 }
    ],
    "totalBill": 30,
    "status": "RECEIVED",
    "createdAt": "2026-04-17T10:30:00.000Z",
    "updatedAt": "2026-04-17T10:30:00.000Z"
  }
}
```

---

### 2. Get All Orders
**GET** `/api/orders`

Retrieve all orders with optional filtering.

**Query Parameters (all optional):**
- `status` - Filter by status (RECEIVED, PROCESSING, READY, DELIVERED)
- `customerName` - Filter by customer name (case-insensitive partial match)
- `phoneNumber` - Filter by phone number

**Examples:**
```
GET /api/orders
GET /api/orders?status=READY
GET /api/orders?customerName=John
GET /api/orders?phoneNumber=555-123-4567
GET /api/orders?status=PROCESSING&customerName=John
```

**Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "count": 2,
  "data": [
    {
      "orderId": "ORD-1001",
      "customerName": "John Doe",
      "phoneNumber": "555-123-4567",
      "garments": [...],
      "totalBill": 30,
      "status": "RECEIVED",
      "createdAt": "2026-04-17T10:30:00.000Z",
      "updatedAt": "2026-04-17T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Get Order by ID
**GET** `/api/orders/:orderId`

Retrieve a specific order by its order ID.

**Example:**
```
GET /api/orders/ORD-1001
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "orderId": "ORD-1001",
    "customerName": "John Doe",
    "phoneNumber": "555-123-4567",
    "garments": [...],
    "totalBill": 30,
    "status": "RECEIVED",
    "createdAt": "2026-04-17T10:30:00.000Z",
    "updatedAt": "2026-04-17T10:30:00.000Z"
  }
}
```

**Response (404) - Not Found:**
```json
{
  "success": false,
  "message": "Order ORD-1001 not found"
}
```

---

### 4. Update Order Status
**PUT** `/api/orders/:orderId`

Update the status of an existing order.

**Valid Statuses:**
- `RECEIVED` - Default status when order is created
- `PROCESSING` - Order is being processed
- `READY` - Order is ready for pickup
- `DELIVERED` - Order has been delivered

**Request Body:**
```json
{
  "status": "PROCESSING"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "orderId": "ORD-1001",
    "customerName": "John Doe",
    "phoneNumber": "555-123-4567",
    "garments": [...],
    "totalBill": 30,
    "status": "PROCESSING",
    "createdAt": "2026-04-17T10:30:00.000Z",
    "updatedAt": "2026-04-17T10:35:00.000Z"
  }
}
```

---

### 5. Admin Dashboard
**GET** `/admin/dashboard`

Get comprehensive dashboard statistics for administrators.

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalOrders": 5,
    "totalRevenue": "150.50",
    "ordersByStatus": {
      "RECEIVED": 2,
      "PROCESSING": 1,
      "READY": 1,
      "DELIVERED": 1
    },
    "orders": [
      {
        "orderId": "ORD-1001",
        "customerName": "John Doe",
        "phoneNumber": "555-123-4567",
        "garments": [...],
        "totalBill": 30,
        "status": "RECEIVED",
        "createdAt": "2026-04-17T10:30:00.000Z",
        "updatedAt": "2026-04-17T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 6. Health Check
**GET** `/health`

Check if the API is running.

**Response (200):**
```json
{
  "status": "OK",
  "message": "Laundry Order Management System is running",
  "timestamp": "2026-04-17T10:30:00.000Z"
}
```

---

## Input Validation

The API validates all inputs and returns detailed error messages:

**Example - Invalid Request:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Customer name is required and must be a non-empty string",
    "Phone number format is invalid",
    "Garments must be a non-empty array"
  ]
}
```

**Validation Rules:**
- **Customer Name:** Non-empty string
- **Phone Number:** Standard phone format (10-15 digits)
- **Garments:** Non-empty array of objects
- **Garment Type:** Non-empty string
- **Quantity:** Positive integer
- **Price:** Non-negative number
- **Order Status:** Must be one of RECEIVED, PROCESSING, READY, DELIVERED

---

## Testing with cURL

### Create an order:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jane Smith",
    "phoneNumber": "555-987-6543",
    "garments": [
      {"type": "Dress", "quantity": 1, "price": 15.00},
      {"type": "Jacket", "quantity": 1, "price": 20.00}
    ]
  }'
```

### Get all orders:
```bash
curl http://localhost:3000/api/orders
```

### Get orders by status:
```bash
curl http://localhost:3000/api/orders?status=READY
```

### Update order status:
```bash
curl -X PUT http://localhost:3000/api/orders/ORD-1001 \
  -H "Content-Type: application/json" \
  -d '{"status": "READY"}'
```

### Get admin dashboard:
```bash
curl http://localhost:3000/admin/dashboard
```

---

## Error Handling

All endpoints follow consistent error response format:

**4xx Client Errors (Bad Request, Not Found, etc.):**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Additional error details..."]
}
```

**5xx Server Errors:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## In-Memory Storage

The application uses an in-memory array to store orders. Data will be reset when the server restarts.

**To persist data**, consider using:
- MongoDB
- PostgreSQL
- MySQL
- Firebase Firestore
- Local JSON file

---

## Code Quality

✅ Modular structure (models, controllers, routes, utils)  
✅ Comprehensive input validation  
✅ Consistent error handling  
✅ Detailed comments  
✅ RESTful API design  
✅ Clean and readable code  

---

## Future Enhancements

- Add database persistence (MongoDB, PostgreSQL)
- Authentication & authorization
- User roles (admin, customer, staff)
- Email/SMS notifications
- Payment integration
- Order history & analytics
- Rate limiting
- API documentation with Swagger/OpenAPI
- Unit and integration tests

---

## Author

Created as a Software Engineering Assignment

## License

ISC
