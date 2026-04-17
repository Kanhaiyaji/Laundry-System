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
