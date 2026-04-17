# 🚀 Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm start
```

Server runs on: `http://localhost:3000`

---

## 5-Minute API Demo

### 1. Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Alice Johnson",
    "phoneNumber": "555-123-4567",
    "garments": [
      {"type": "Shirt", "quantity": 3, "price": 5.00},
      {"type": "Pants", "quantity": 2, "price": 7.50}
    ]
  }'
```

**Response:** Order created with ID `ORD-1001`, total bill = $30, status = `RECEIVED`

### 2. View All Orders
```bash
curl http://localhost:3000/api/orders
```

### 3. Get Specific Order
```bash
curl http://localhost:3000/api/orders/ORD-1001
```

### 4. Update Order Status
```bash
curl -X PUT http://localhost:3000/api/orders/ORD-1001 \
  -H "Content-Type: application/json" \
  -d '{"status": "PROCESSING"}'
```

### 5. View Dashboard
```bash
curl http://localhost:3000/admin/dashboard
```

**Shows:** Total orders, revenue, status breakdown, all orders

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | API README |
| GET | `/health` | Health check |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders?status=READY` | Filter by status |
| GET | `/api/orders?customerName=Alice` | Filter by name |
| GET | `/api/orders/:orderId` | Get specific order |
| PUT | `/api/orders/:orderId` | Update status |
| GET | `/admin/dashboard` | Admin stats |

---

## Valid Order Statuses

- `RECEIVED` (default, when order created)
- `PROCESSING` (being washed/processed)
- `READY` (ready for pickup)
- `DELIVERED` (handed to customer)

---

## Example Order Object

```json
{
  "orderId": "ORD-1001",
  "customerName": "Alice Johnson",
  "phoneNumber": "555-123-4567",
  "garments": [
    {"type": "Shirt", "quantity": 3, "price": 5},
    {"type": "Pants", "quantity": 2, "price": 7.5}
  ],
  "totalBill": 30,
  "status": "RECEIVED",
  "createdAt": "2026-04-17T10:30:00.000Z",
  "updatedAt": "2026-04-17T10:30:00.000Z"
}
```

---

## Validation Rules

✓ Customer name: Non-empty string  
✓ Phone number: Valid phone format  
✓ Garments: Non-empty array with type, quantity, price  
✓ Quantity: Positive integer  
✓ Price: Non-negative number  

---

## Features

✅ Create orders with unique IDs  
✅ Automatic total bill calculation  
✅ Update order status  
✅ Filter orders by status/name/phone  
✅ Admin dashboard with analytics  
✅ Comprehensive input validation  
✅ Error handling with helpful messages  
✅ In-memory storage (no database needed)  

---

## Directory Structure

```
Laundry/
├── server.js                  # Main server
├── package.json              # Dependencies
├── models/order.js           # Data storage & operations
├── controllers/orderController.js  # Route handlers
├── routes/orders.js          # API routes
├── utils/validation.js       # Input validation
├── README.md                 # Full documentation
├── API_TEST_EXAMPLES.js      # Example requests
└── IMPLEMENTATION_GUIDE.md   # Technical details
```

---

## Development

### Auto-reload (with Nodemon)
```bash
npm run dev
```

---

## Next Steps

1. Read [README.md](README.md) for detailed API documentation
2. Review [API_TEST_EXAMPLES.js](API_TEST_EXAMPLES.js) for sample requests
3. Check [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for technical details

---

**Happy coding! 🎉**
