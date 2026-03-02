This a backend for hotel booking.

Endpoints:

## **1. POST /api/auth/signup**

Register a new user (customer or owner)

### **Request Body**

```jsx
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "priya123",
  "role": "customer",
  "phone": "+919876543210"
}
```

### **Success Response** – `201 Created`

```jsx
{
  "success": true,
  "data": {
    "id": "usr_1a2b3c4d5e",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "role": "customer",
    "phone": "+919876543210"
  },
  "error": null
}
```

- If no role is given then default is `customer`
- Phone is optional

### **Error Responses**

**400 Bad Request** – Invalid schema

```jsx
{
  "success": false,
  "data": null,
  "error": "INVALID_REQUEST"
}
```

**400 Bad Request** – Email exists

```jsx
{
  "success": false,
  "data": null,
  "error": "EMAIL_ALREADY_EXISTS"
}
```

## **2. POST /api/auth/login**

Login and receive JWT token

### **Request Body**

```jsx
{
  "email": "priya@example.com",
  "password": "priya123"
}
```

### **Success Response** – `200 OK`

```jsx
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "usr_1a2b3c4d5e",
      "name": "Priya Sharma",
      "email": "priya@example.com",
      "role": "customer"
    }
  },
  "error": null
}
```

### **Error Responses**

**400 Bad Request** – Invalid schema

```jsx
{
  "success": false,
  "data": null,
  "error": "INVALID_REQUEST"
}
```

**401 Unauthorized** – Wrong credentials

```jsx
{
  "success": false,
  "data": null,
  "error": "INVALID_CREDENTIALS"
}
```

## **3. POST /api/hotels** – *(Owner Only)*

Create a new hotel

**Headers:** `Authorization: Bearer <token>`

### **Request Body**

```jsx
{
  "name": "Grand Palace Hotel",
  "description": "Luxury 5-star hotel in the heart of the city",
  "city": "Mumbai",
  "country": "India",
  "amenities": ["wifi", "pool", "gym", "parking", "restaurant"]
}
```

### **Success Response** – `201 Created`

```jsx
{
  "success": true,
  "data": {
    "id": "hotel_abc123",
    "ownerId": "usr_1a2b3c4d5e",
    "name": "Grand Palace Hotel",
    "description": "Luxury 5-star hotel in the heart of the city",
    "city": "Mumbai",
    "country": "India",
    "amenities": ["wifi", "pool", "gym", "parking", "restaurant"],
    "rating": 0.0,
    "totalReviews": 0
  },
  "error": null
}
```


```jsx
}
```

### **Error Responses**

**401 Unauthorized**

```jsx
{
  "success": false,
  "data": null,
  "error": "UNAUTHORIZED"
}
```

**403 Forbidden** – Not an owner

```jsx
{
  "success": false,
  "data": null,
  "error": "FORBIDDEN"
}
```

**400 Bad Request** – Invalid schema

```jsx
{
  "success": false,
  "data": null,
  "error": "INVALID_REQUEST"
}
```

## **4. POST /api/hotels/:hotelId/rooms** – *(Owner Only)*

Add a room to a hotel

**Headers:** `Authorization: Bearer <token>`

### **Request Body**

```jsx
{
  "roomNumber": "101",
  "roomType": "Deluxe",
  "pricePerNight": 5000,
  "maxOccupancy": 2
}
```

```jsx
}
```

### **Success Response** – `201 Created`

```jsx
{
  "success": true,
  "data": {
    "id": "room_xyz789",
    "hotelId": "hotel_abc123",
    "roomNumber": "101",
    "roomType": "Deluxe",
    "pricePerNight": 5000,
    "maxOccupancy": 2,
  },
  "error": null
}
```

### **Error Responses**

**401 Unauthorized**

```jsx
{
  "success": false,
  "data": null,
  "error": "UNAUTHORIZED"
}
```

**403 Forbidden** – Not the owner of this hotel

```jsx
{
  "success": false,
  "data": null,
  "error": "FORBIDDEN"
}
```

**400 Bad Request** – Room number already exists

```jsx
{
  "success": false,
  "data": null,
  "error": "ROOM_ALREADY_EXISTS"
}
```

**400 Bad Request** – Invalid schema

```jsx
{
  "success": false,
  "data": null,
  "error": "INVALID_REQUEST"
}
```

**404 Not Found** – Hotel not found

```jsx
{
  "success": false,
  "data": null,
  "error": "HOTEL_NOT_FOUND"
}
```

## **5. GET /api/hotels**

Search and filter hotels (simple without pagination)

**Headers:** `Authorization: Bearer <token>`

**Query Parameters (all optional if none provided return all hotels):**

- `city` – Filter by city (case-insensitive)
- `country` – Filter by country (case-insensitive)
- `minPrice` – Minimum price per night
- `maxPrice` – Maximum price per night
- `minRating` – Minimum rating (0-5)

**Example:**

- `/api/hotels?city=Mumbai&minRating=4`
- `/api/hotels?country=India&minPrice=3000&maxPrice=8000`

### **Success Response** – `200 OK`

```jsx
{
  "success": true,
  "data": [
    {
      "id": "hotel_abc123",
      "name": "Grand Palace Hotel",
      "description": "Luxury 5-star hotel in the heart of the city",
      "city": "Mumbai",
      "country": "India",
      "amenities": ["wifi", "pool", "gym"],
      "rating": 4.5,
      "totalReviews": 42,
      "minPricePerNight": 5000
    },
    {
      "id": "hotel_def456",
      "name": "Sea View Resort",
      "description": "Beautiful beach resort",
      "city": "Mumbai",
      "country": "India",
      "amenities": ["wifi", "pool", "beach"],
      "rating": 4.2,
      "totalReviews": 28,
      "minPricePerNight": 7000
    }
  ],
  "error": null
}
```

**Field Calculations:**

- `minPricePerNight` = minimum price_per_night among all rooms in this hotel.
- Exclude hotel with no rooms.
- `rating` and `totalReviews` come directly from the hotels table.

### **Error Responses**

**401 Unauthorized**

```jsx
{
  "success": false,
  "data": null,
  "error": "UNAUTHORIZED"
}
```

## **7. POST /api/bookings** – *(Customer Only)*

Create a new booking (Booking creation should be done atomically to prevent race conditions)

**Headers:** `Authorization: Bearer <token>`

### **Request Body**

```jsx
{
  "roomId": "room_xyz789",
  "checkInDate": "2026-02-15",
  "checkOutDate": "2026-02-18",
  "guests": 2
}
```

### **Success Response** – `201 Created`

```jsx
{
  "success": true,
  "data": {
    "id": "booking_123abc",
    "userId": "usr_1a2b3c4d5e",
    "roomId": "room_xyz789",
    "hotelId": "hotel_abc123",
    "checkInDate": "2026-02-15",
    "checkOutDate": "2026-02-18",
    "guests": 2,
    "totalPrice": 15000,
    "status": "confirmed",
    "bookingDate": "2026-01-22T10:30:00Z"
  },
  "error": null
}
```

**Total Price Calculation:**

```jsx
nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
totalPrice = nights * pricePerNight
```

### **Error Responses**

**401 Unauthorized**

```jsx
{
  "success": false,
  "data": null,
  "error": "UNAUTHORIZED"
}
```

**403 Forbidden** – Owner trying to book their own hotel

```jsx
{
  "success": false,
  "data": null,
  "error": "FORBIDDEN"
}
```

**400 Bad Request** – Room not available (overlapping booking exists)

```jsx
{
  "success": false,
  "data": null,
  "error": "ROOM_NOT_AVAILABLE"
}
```

**400 Bad Request** – Past date booking

```jsx
{
  "success": false,
  "data": null,
  "error": "INVALID_DATES"
}
```

**400 Bad Request** – Guests capacity

```jsx
{
  "success": false,
  "data": null,
  "error": "INVALID_CAPACITY"
}
```

**400 Bad Request** – Invalid schema

```jsx
{
  "success": false,
  "data": null,
  "error": "INVALID_REQUEST"
}
```

**404 Not Found**

```jsx
{
  "success": false,
  "data": null,
  "error": "ROOM_NOT_FOUND"
}
```

## **8. GET /api/bookings - (Customer only)**

Get all bookings for current user

**Headers:** `Authorization: Bearer <token>`

**Query Parameters (optional):**

- `status` – Filter by status (confirmed/cancelled)

### **Success Response** – `200 OK`

json

```jsx
{
  "success": true,
  "data": [
    {
      "id": "booking_123abc",
      "roomId": "room_xyz789",
      "hotelId": "hotel_abc123",
      "hotelName": "Grand Palace Hotel",
      "roomNumber": "101",
      "roomType": "Deluxe",
      "checkInDate": "2026-02-15",
      "checkOutDate": "2026-02-18",
      "guests": 2,
      "totalPrice": 15000,
      "status": "confirmed",
      "bookingDate": "2026-01-22T10:30:00Z"
    }
  ],
  "error": null
}
```

### **Error Responses**

**401 Unauthorized**

```jsx
{
  "success": false,
  "data": null,
  "error": "UNAUTHORIZED"
}
```



## **9. POST /api/bookings/:bookingId/cancel** – *(Customer Only)*

Cancel a booking

**Headers:** `Authorization: Bearer <token>`

### **Success Response** – `200 OK`

```jsx
{
  "success": true,
  "data": {
    "id": "booking_123abc",
    "status": "cancelled",
    "cancelledAt": "2026-01-23T14:20:00Z"
  },
  "error": null
}
```

### **Error Responses**

**401 Unauthorized**

```jsx
{
  "success": false,
  "data": null,
  "error": "UNAUTHORIZED"
}
```

**403 Forbidden** – Not your booking

```jsx
{
  "success": false,
  "data": null,
  "error": "FORBIDDEN"
}
```

**400 Bad Request** – Already cancelled

```jsx
{
  "success": false,
  "data": null,
  "error": "ALREADY_CANCELLED"
}
```

**400 Bad Request** – Less than 24 hours before check-in

```jsx
{
  "success": false,
  "data": null,
  "error": "CANCELLATION_DEADLINE_PASSED"
}
```

**404 Not Found**

```jsx
{
  "success": false,
  "data": null,
  "error": "BOOKING_NOT_FOUND"
}
```