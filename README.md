# NameIntel API 🎯

A modern RESTful API service that enriches person names with demographic intelligence. By integrating with free, public APIs, this service extracts and structures gender, age, and nationality information into a clean, queryable database.

---

## 🌟 Features

- **Multi-API Integration**: Seamlessly combines data from three trusted external sources
  - Genderize.io → Gender prediction & confidence
  - Agify.io → Estimated age  
  - Nationalize.io → Likely nationality/country

- **Intelligent Data Processing**: Automatically classifies and structures raw API responses
  - Age groups: Child (0-12), Teenager (13-19), Adult (20-59), Senior (60+)
  - Probability scoring for all predictions
  - Country selection based on highest probability

- **Idempotent Operations**: Submit the same name twice, get the same result—no duplicates
- **RESTful Design**: Standard HTTP methods with consistent JSON response structure
- **Database Persistence**: MongoDB storage with UUID v7 identifiers
- **Production Ready**: Error handling, input validation, CORS support

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **HTTP Client**: Axios
- **Environment**: dotenv for configuration
- **Monitoring**: Morgan HTTP logger
- **Development**: Nodemon for hot-reload
- **ID Generation**: UUIDv7

---

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- MongoDB instance (local or cloud)
- npm or yarn

### Setup

1. **Clone and Install**
   ```bash
   git clone <repo-url>
   cd "NameIntel API"
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/nameintel
   NODE_ENV=development
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Server runs on `http://localhost:3000`

---

## 🚀 API Endpoints

### 1. Create Profile
**POST** `/api/profiles`

Create a new profile by submitting a name. The API automatically enriches it with demographic data.

**Request:**
```json
{
  "name": "Emma"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
    "name": "emma",
    "gender": "female",
    "gender_probability": 0.99,
    "sample_size": 5234,
    "age": 32,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.85,
    "created_at": "2026-04-17T12:00:00Z"
  }
}
```

**Idempotency (200 - Name already exists):**
```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": { "..." }
}
```

**Error Cases:**
- `400`: Missing or empty name
- `422`: Invalid data type
- `502`: External API returned invalid/null data

---

### 2. Get Single Profile
**GET** `/api/profiles/{id}`

Retrieve a specific profile by UUID.

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
    "name": "emma",
    "gender": "female",
    "gender_probability": 0.99,
    "sample_size": 5234,
    "age": 32,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.85,
    "created_at": "2026-04-17T12:00:00Z"
  }
}
```

**Error Cases:**
- `404`: Profile not found

---

### 3. List & Filter Profiles
**GET** `/api/profiles`

Retrieve all profiles with optional filtering. Query parameters are case-insensitive and optional.

**Query Parameters:**
- `gender`: Filter by gender (male/female)
- `age_group`: Filter by age group (child/teenager/adult/senior)
- `country_id`: Filter by country code (US/UK/NG/DRC, etc.)

**Examples:**
```
GET /api/profiles
GET /api/profiles?gender=male&country_id=ng
GET /api/profiles?age_group=adult
```

**Response (200):**
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "id-1",
      "name": "emmanuel",
      "gender": "male",
      "age": 28,
      "age_group": "adult",
      "country_id": "NG"
    },
    {
      "id": "id-2",
      "name": "sarah",
      "gender": "female",
      "age": 31,
      "age_group": "adult",
      "country_id": "US"
    }
  ]
}
```

---

### 4. Delete Profile
**DELETE** `/api/profiles/{id}`

Remove a profile from the database.

**Success Response (204):**
No content returned.

**Error Cases:**
- `404`: Profile not found

---

## 💡 Usage Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Create a profile
async function createProfile(name) {
  const response = await axios.post(`${API_URL}/profiles`, { name });
  console.log(response.data);
}

// Get all male profiles from Nigeria
async function getProfiles() {
  const response = await axios.get(`${API_URL}/profiles`, {
    params: {
      gender: 'male',
      country_id: 'NG'
    }
  });
  console.log(response.data);
}

createProfile('John').catch(console.error);
```

### cURL
```bash
# Create profile
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'

# Get all profiles
curl http://localhost:3000/api/profiles?gender=female

# Get single profile
curl http://localhost:3000/api/profiles/b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12

# Delete profile
curl -X DELETE http://localhost:3000/api/profiles/b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12
```

---

## 📂 Project Structure

```
NameIntel API/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── profile.controller.js # Business logic
│   ├── models/
│   │   └── profile.model.js      # Schema definition
│   ├── routes/
│   │   └── profile.routes.js     # Route handlers
│   ├── services/
│   │   ├── gender.service.js     # Genderize.io wrapper
│   │   ├── age.service.js        # Agify.io wrapper
│   │   └── nationality.service.js# Nationalize.io wrapper
│   └── utils/
│       ├── classifyAge.js        # Age group logic
│       ├── genderFormat.js       # Format gender data
│       ├── generateUUID.js       # UUID v7 generation
│       └── selectCountry.js      # Country selection
├── app.js                        # Express setup
├── server.js                     # Entry point
├── package.json
└── README.md
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/nameintel
```

---

## 🔍 Error Handling

All error responses follow this structure:
```json
{
  "status": "error",
  "message": "Descriptive error message"
}
```

**Common Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | Success (OK) |
| 201 | Created |
| 204 | No Content (delete) |
| 400 | Bad Request |
| 422 | Invalid Type |
| 404 | Not Found |
| 500 | Server Error |
| 502 | Bad Gateway (External API Error) |

---

## 📋 Response Format

All responses maintain consistency:

**Success:**
```json
{
  "status": "success",
  "data": { /* payload */ }
}
```

**With Count:**
```json
{
  "status": "success",
  "count": 5,
  "data": [ /* array */ ]
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Human-readable message"
}
```

---

## 🚦 Getting Started Checklist

- [ ] Install dependencies: `npm install`
- [ ] Set up environment variables in `.env`
- [ ] Start MongoDB
- [ ] Run `npm run dev`
- [ ] Test endpoints with curl or Postman
- [ ] Check server logs in terminal

---

## 📝 Notes

- All names are stored in lowercase for consistency
- Timestamps are in **UTC ISO 8601** format
- IDs are **UUID v7** for better performance than v4
- External APIs are free and require no authentication
- CORS is enabled for all origins

---

## 🤝 Contributing

Pull requests welcome! Please ensure:
- Code follows project conventions
- All endpoints work as documented
- Error handling is consistent
- Meaningful commit messages

---

## 📄 License

ISC

---

**Built with ❤️ for name intelligence.**
