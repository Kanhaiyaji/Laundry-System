# Laundry Order Management System - Implementation Guide

## Overview

This is a production-ready backend API for managing laundry orders. It features a clean, modular architecture with comprehensive input validation and error handling.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### 3. Verify It's Running
```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Laundry Order Management System is running"
}
```

---

## Architecture

### Directory Structure
```
Laundry/
├── server.js                    # Main Express app & server start
├── package.json                 # Dependencies
├── models/
│   └── order.js                # Order CRUD operations & in-memory storage
├── controllers/
│   └── orderController.js       # Request handlers & business logic
├── routes/
│   └── orders.js               # Route definitions
├── utils/
│   └── validation.js           # Input validation functions
└── docs/
    └── README.md               # API documentation
```

### Data Flow

```
Request → Express Middleware → Routes → Controllers → Models → Database (Memory) → Response
```

1. **Request**: HTTP request comes in
2. **Middleware**: JSON parsing
3. **Routes**: Route matching (`routes/orders.js`)
4. **Controller**: Business logic (`controllers/orderController.js`)
5. **Model**: Data operations (`models/order.js`)
6. **Response**: JSON response sent back

---

## Core Components

### 1. Models (`models/order.js`)
**Responsibility**: Manage data and in-memory storage

Functions:
- `createOrder()` - Add new order
- `getAllOrders()` - Retrieve all orders
- `getOrderById()` - Get specific order
- `updateOrderStatus()` - Change order status
- `filterOrders()` - Apply filters (status, name, phone)
- `getDashboardStats()` - Calculate statistics

### 2. Controllers (`controllers/orderController.js`)
**Responsibility**: Handle HTTP requests and business logic

Functions:
- `createOrder()` - Handle POST /api/orders
- `getOrders()` - Handle GET /api/orders
- `getOrderById()` - Handle GET /api/orders/:orderId
- `updateOrderStatus()` - Handle PUT /api/orders/:orderId
- `getAdminDashboard()` - Handle GET /admin/dashboard

### 3. Routes (`routes/orders.js`)
**Responsibility**: Define API endpoints

- POST `/api/orders` → createOrder
- GET `/api/orders` → getOrders
- GET `/api/orders/:orderId` → getOrderById
- PUT `/api/orders/:orderId` → updateOrderStatus

### 4. Utilities (`utils/validation.js`)
**Responsibility**: Validate user input

Functions:
- `validateCustomerData()` - Check customer name & phone
- `validateGarments()` - Check garments array
- `validateOrderStatus()` - Check status value
- `validateCreateOrderRequest()` - Complete order validation

---

## Key Features Explained

### Unique Order ID Generation
```javascript
// models/order.js
const generateOrderId = () => {
  return `ORD-${++orderIdCounter}`;
};
// Generates: ORD-1001, ORD-1002, etc.
```

### Total Bill Calculation
```javascript
const calculateTotalBill = (garments) => {
  return garments.reduce((total, garment) => {
    return total + (garment.quantity * garment.price);
  }, 0);
};
// Multiplies quantity × price for each garment, then sums
```

### Order Filtering
```javascript
const filterOrders = (filters = {}) => {
  let filtered = [...orders];
  
  if (filters.status)
    filtered = filtered.filter(order => order.status === filters.status);
  
  if (filters.customerName)
    filtered = filtered.filter(order =>
      order.customerName.toLowerCase().includes(filters.customerName.toLowerCase())
    );
  
  if (filters.phoneNumber)
    filtered = filtered.filter(order =>
      order.phoneNumber.includes(filters.phoneNumber)
    );
  
  return filtered;
};
// Supports multiple filters simultaneously
```

### Admin Dashboard Statistics
```javascript
const getDashboardStats = () => {
  return {
    totalOrders: orders.length,
    totalRevenue: sum of all bills,
    ordersByStatus: count for each status,
    orders: all orders list
  };
};
```

---

## Testing with cURL

### 1. Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "phoneNumber": "555-123-4567",
    "garments": [
      {"type": "Shirt", "quantity": 3, "price": 5.00},
      {"type": "Trousers", "quantity": 2, "price": 7.50}
    ]
  }'
```

### 2. Get All Orders
```bash
curl http://localhost:3000/api/orders
```

### 3. Get Orders by Status
```bash
curl "http://localhost:3000/api/orders?status=READY"
```

### 4. Get Orders by Customer Name
```bash
curl "http://localhost:3000/api/orders?customerName=John"
```

### 5. Get Specific Order
```bash
curl http://localhost:3000/api/orders/ORD-1001
```

### 6. Update Order Status
```bash
curl -X PUT http://localhost:3000/api/orders/ORD-1001 \
  -H "Content-Type: application/json" \
  -d '{"status": "PROCESSING"}'
```

### 7. Get Admin Dashboard
```bash
curl http://localhost:3000/admin/dashboard
```

---

## Input Validation Rules

### Customer Name
- Required
- Must be a non-empty string
- Cannot be just whitespace

### Phone Number
- Required
- Format: Standard phone format (10-15 digits)
- Accepts: `555-123-4567`, `(555) 123-4567`, `5551234567`, `+1-555-123-4567`

### Garments Array
- Required
- Must be non-empty array
- Each garment must have:
  - **type**: Non-empty string (e.g., "Shirt", "Trousers")
  - **quantity**: Positive integer (> 0)
  - **price**: Non-negative number (≥ 0)

### Order Status
- Must be one of: `RECEIVED`, `PROCESSING`, `READY`, `DELIVERED`
- Case-sensitive

---

## Error Handling

### Process
1. Input validation fails → 400 Bad Request
2. Order not found → 404 Not Found
3. Server error → 500 Internal Server Error
4. All errors include helpful error messages

### Example Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Phone number format is invalid",
    "Garment 1: quantity must be a positive integer"
  ]
}
```

---

## Status Lifecycle

```
Order Created (RECEIVED)
        ↓
    Receives validation
    ↓
PROCESSING (Staff is processing)
        ↓
    Ready for pickup
    ↓
    READY
        ↓
    Customer picks up
    ↓
    DELIVERED
```

---

## Database (In-Memory)

Currently uses a JavaScript array for storage:
```javascript
let orders = [];
```

**Data is reset when server restarts.**

### To Add Persistence
1. **MongoDB**
   ```bash
   npm install mongoose
   ```
   Replace in-memory operations with MongoDB queries

2. **PostgreSQL**
   ```bash
   npm install pg
   ```
   Use SQL queries

3. **JSON File** (Simple option)
   ```javascript
   const fs = require('fs');
   // Save/load orders from JSON file
   ```

---

## Response Format Standards

### Successful Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...} // or "count": X and "data": [...]
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detail 1", "Detail 2"]
}
```

---

## Future Enhancements

### Short-term
- [ ] Add database persistence (MongoDB recommended)
- [ ] Add authentication (JWT tokens)
- [ ] Add request logging and monitoring
- [ ] Add unit tests (Jest/Mocha)
- [ ] Add API documentation (Swagger)

### Medium-term
- [ ] Add user roles (Admin, Staff, Customer)
- [ ] Add email notifications
- [ ] Add order pricing tiers
- [ ] Add payment integration
- [ ] Add analytics dashboard

### Long-term
- [ ] Add mobile app
- [ ] Add SMS notifications
- [ ] Add AI-based demand forecasting
- [ ] Add multi-location support
- [ ] Add loyalty program

---

## Deployment

### Local
```bash
npm install
npm start
```

### Heroku
```bash
git push heroku main
```

### Docker
Create `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t laundry-api .
docker run -p 3000:3000 laundry-api
```

### AWS/Azure/GCP
- Deploy Node.js app using cloud services
- Use managed databases instead of in-memory storage
- Add CDN for static content
- Configure auto-scaling

---

## Performance Considerations

### Current Limitations
- In-memory storage: Limited to available RAM
- No caching: Every request queries full array
- No database indexes: Filtering is O(n)

### Optimizations for Production
1. Add database with indexes
2. Add caching (Redis)
3. Add pagination for large result sets
4. Add request validation early
5. Add compression middleware
6. Monitor performance with APM tools

---

## Security Considerations

### Current
- Input validation on all fields
- Error messages don't expose system details

### To Add
- [ ] Add rate limiting
- [ ] Add CORS configuration
- [ ] Add helmet.js for security headers
- [ ] Add request timeout
- [ ] Add SQL injection prevention (if using SQL)
- [ ] Add audit logging
- [ ] Add API key authentication
- [ ] Add HTTPS in production

---

## Code Quality Checklist

✅ Modular structure  
✅ Clear separation of concerns  
✅ Comprehensive validation  
✅ Consistent error handling  
✅ Detailed comments  
✅ Meaningful variable names  
✅ No hardcoded values  
✅ DRY (Don't Repeat Yourself)  
✅ RESTful API design  

---

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Module Not Found
```bash
npm install
```

### Validation Errors
Check the error message - it specifies exactly what's wrong.

### Order Not Found
Verify the order ID exists: `GET /api/orders`

---

## Support

For issues or questions, refer to:
- [API Documentation](README.md)
- [API Test Examples](API_TEST_EXAMPLES.js)
- Code comments in source files

---

## License

ISC

---

**Last Updated**: April 17, 2026
