# 🎬 VideoTube Backend

A production-oriented REST API backend for a YouTube-like video sharing platform, built with **Node.js, Express.js, MongoDB, and Mongoose**.

This project started as a backend learning journey and evolved into a complete backend system covering authentication, video management, playlists, subscriptions, comments, likes, pagination, MongoDB aggregation, and dashboard analytics.

The goal of this project was not only to build APIs, but to understand how backend systems are designed, connected, secured, and optimized.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- User registration
- User login
- User logout
- JWT authentication
- Access token & refresh token workflow
- Protected routes
- Cookie-based authentication
- Password hashing with bcrypt
- Change password
- Refresh token validation
- Authorization using resource ownership

### 👤 User Management

- Get current user
- Update account information
- Update avatar
- Update cover image
- User-specific resource authorization

### 🎥 Video Management

- Upload videos
- Update video information
- Delete videos
- Get video by ID
- Get all published videos
- Increment video views
- Toggle publish status
- Get videos uploaded by a channel
- Video pagination
- Video sorting

### 📂 Playlist Management

- Create playlist
- Get user playlists
- Get playlist by ID
- Update playlist
- Delete playlist
- Add video to playlist
- Remove video from playlist
- Playlist pagination

### 🔔 Subscription System

- Subscribe to a channel
- Unsubscribe from a channel
- Get channel subscribers
- Get subscribed channels

### 💬 Comment System

- Add comment
- Update comment
- Delete comment
- Get video comments
- Comment pagination

### ❤️ Like System

- Like / unlike videos
- Like / unlike comments
- Get user's liked videos
- Paginated liked videos

### 📊 Dashboard

Channel analytics including:

- Total videos
- Total video views
- Total subscribers
- Total likes

### 🧠 MongoDB Aggregation

Hands-on implementation of:

- `$match`
- `$lookup`
- `$project`
- `$addFields`
- `$group`
- `$sum`
- `$size`
- `$unwind`
- `$replaceRoot`
- Aggregation-based pagination
- Data shaping and transformation

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication & Security

- JWT
- bcrypt
- Cookie Parser
- CORS
- Environment Variables

### File Management

- Multer
- Cloudinary
- Local file cleanup

### Development

- Postman
- Git
- GitHub
- VS Code

---

## 📚 Backend Concepts Practiced

This project helped me gain hands-on experience with:

- REST API architecture
- MVC-style backend structure
- Express routing
- Middleware
- Authentication & authorization
- JWT access/refresh token architecture
- Cookie-based authentication
- Password hashing
- Mongoose schemas and models
- Mongoose schema methods
- Pre-save middleware
- MongoDB CRUD operations
- MongoDB query operators
- MongoDB aggregation pipelines
- `$lookup` and document relationships
- Pagination
- Sorting
- Request validation
- Error handling
- Custom API errors
- Custom API response wrappers
- File upload lifecycle
- Cloudinary integration
- Resource ownership authorization

---

## 📄 API Overview

The API is organized into different resource modules.

```text
/api/v1
│
├── /users
├── /videos
├── /playlists
├── /subscriptions
├── /comments
├── /likes
└── /dashboard
```

### Authentication

```http
POST   /api/v1/users/register
POST   /api/v1/users/login
POST   /api/v1/users/logout
POST   /api/v1/users/refresh-token
PATCH  /api/v1/users/change-password
```

### Videos

```http
GET    /api/v1/videos
GET    /api/v1/videos/:videoId
POST   /api/v1/videos
PATCH  /api/v1/videos/:videoId
DELETE /api/v1/videos/:videoId
PATCH  /api/v1/videos/toggle/publish/:videoId
```

### Playlists

```http
POST   /api/v1/playlists
GET    /api/v1/playlists/user/:userId
GET    /api/v1/playlists/:playlistId
PATCH  /api/v1/playlists/:playlistId
DELETE /api/v1/playlists/:playlistId
POST   /api/v1/playlists/:playlistId/videos/:videoId
DELETE /api/v1/playlists/:playlistId/videos/:videoId
```

### Comments

```http
POST   /api/v1/comments/:videoId
GET    /api/v1/comments/:videoId
PATCH  /api/v1/comments/:commentId
DELETE /api/v1/comments/:commentId
```

### Likes

```http
POST   /api/v1/likes/toggle/v/:videoId
POST   /api/v1/likes/toggle/c/:commentId
GET    /api/v1/likes/videos
```

### Subscriptions

```http
POST   /api/v1/subscriptions/toggle/:channelId
GET    /api/v1/subscriptions/:channelId/subscribers
GET    /api/v1/subscriptions/:subscriberId/channels
```

---

## 📌 Pagination

Pagination is implemented on endpoints where large datasets can occur.

Example:

```http
GET /api/v1/videos?page=1&limit=10
```

The API returns both the requested data and pagination metadata:

```json
{
  "videos": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalVideos": 100,
    "totalPages": 10
  }
}
```

Pagination uses:

- Page validation
- Limit validation
- Maximum limit protection
- Sorting
- `$skip`
- `$limit`

---

## 🧩 Aggregation Example

The project uses MongoDB aggregation pipelines whenever data needs to be joined or transformed.

For example, retrieving a user's liked videos:

```text
Like
  ↓
$match current user
  ↓
$sort
  ↓
$skip / $limit
  ↓
$lookup Videos
  ↓
$unwind
  ↓
$replaceRoot
  ↓
Clean video response
```

This helped me understand when to use **Mongoose `populate()`** versus **MongoDB aggregation pipelines**.

---

## 📂 Project Structure

```text
src/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── db/
├── constants/
├── app.js
└── index.js
```

---

## 🔄 Authentication Flow

```text
User Login
    ↓
Validate Credentials
    ↓
Generate Access Token
    ↓
Generate Refresh Token
    ↓
Store Refresh Token
    ↓
Set HTTP Cookies
    ↓
Protected Request
    ↓
Authentication Middleware
    ↓
Verify Access Token
    ↓
Attach User to Request
```

When the access token expires:

```text
Refresh Token
    ↓
Verify Refresh Token
    ↓
Generate New Access Token
    ↓
Generate New Refresh Token
    ↓
Update Stored Refresh Token
```

---

## ⚙️ Environment Variables


Example:

```env
PORT = 8000

MONGODB_URL = 

CORS_ORIGIN = 

ACCESS_TOKEN_SECRET = 
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET = 
REFRESH_TOKEN_EXPIRY = 

CLOUDINARY_CLOUD_NAME =
CLOUDINARY_CLOUD_API =
CLOUDINARY_CLOUD_API_SECRET =
```

---

## 🧪 API Testing

All endpoints were manually tested using **Postman**, including:

- Authentication flows
- Protected routes
- CRUD operations
- File uploads
- Pagination
- Likes
- Comments
- Subscriptions
- Playlists
- Dashboard statistics

---

## 🧠 What I Learned

The biggest takeaway from this project was learning how individual backend concepts connect together to form a complete system.

Instead of only learning syntax, I focused on understanding:

> **How does this work?**

and more importantly:

> **Why is it designed this way?**

Some of the most valuable concepts I practiced were:

- Access token vs refresh token
- Authentication vs authorization
- Resource ownership
- Pagination
- MongoDB relationships
- `populate()` vs aggregation
- Aggregation data transformation
- Efficient database queries
- API error handling
- File upload lifecycle

---

## 🚧 Future Improvements

Possible improvements for future versions:

- Watch history
- Email verification
- Forgot/reset password
- Role-based authorization
- API rate limiting
- Request logging
- Redis caching
- Automated testing
- Dockerization
- API documentation with Swagger/OpenAPI
- Deployment and monitoring

---

## 🎯 Project Goal

The goal of VideoTube was to move beyond basic CRUD APIs and build a backend that demonstrates practical backend engineering concepts used in real-world applications.

This project represents my transition from **learning backend concepts individually** to **connecting those concepts into a complete REST API system**.

---

⭐ If you find this project useful, feel free to explore the code and give the repository a star.
