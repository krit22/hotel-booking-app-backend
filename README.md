This a backend for hotel booking.

Schemas:

1. User Schema:
    id
    name
    email
    password
    role:(customer/user)
    phone

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