# Patient Feedback Form - Backend

This is the backend component for the Patient Feedback Form application. It provides RESTful API endpoints to handle patient feedback data, including encryption for sensitive information and validation for data integrity.

## Technologies Used

- **Node.js:** Backend runtime environment.
- **Express.js:** Web framework.
- **MySQL:** Relational database management system.
- **crypto:** For data encryption.
- **express-validator:** For data validation.
- **dotenv:** For environment variable management.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** Version 14.x or later.
- **npm:** Version 6.x or later.
- **MySQL Server:** Version 5.7 or later.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/52147/AugMend-Health-Backend.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd AugMend-Health-Backend
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Environment Configuration:**

   Create a `.env` file in the root directory with the following variables:

   ```plaintext
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=vr_feedback
   JWT_SECRET=your_jwt_secret
   ENCRYPTION_KEY=your_32_byte_hex_key
   ENCRYPTION_IV=your_16_byte_hex_iv
   ```

   **Note:**
   - Replace `your_db_user` and `your_db_password` with your MySQL credentials.
   - Generate a 32-byte encryption key and 16-byte IV using Node.js:

   ```js
   const crypto = require('crypto');

   // Generate a 32-byte encryption key
   const encryptionKey = crypto.randomBytes(32).toString('hex');
   console.log(`Encryption Key: ${encryptionKey}`);

   // Generate a 16-byte initialization vector (IV)
   const encryptionIv = crypto.randomBytes(16).toString('hex');
   console.log(`Encryption IV: ${encryptionIv}`);
   ```

## Database Setup

1. **Create Database:**

   Log into MySQL and create the required database:

   ```sql
   CREATE DATABASE vr_feedback;
   ```

2. **Create `feedback` Table:**

   Run the following SQL commands to create the `feedback` table:

   ```sql
   USE vr_feedback;

   CREATE TABLE feedback (
       id INT AUTO_INCREMENT PRIMARY KEY,
       patientName VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL,
       age INT NOT NULL,
       maritalStatus ENUM('Single', 'Married', 'Widowed', 'Other') NOT NULL,
       otherMaritalStatus VARCHAR(100) DEFAULT NULL,
       seenTherapist ENUM('Yes', 'No') NOT NULL,
       takingMedications ENUM('Yes', 'No') NOT NULL,
       medications TEXT DEFAULT NULL,
       therapySatisfaction INT NOT NULL,
       experienceFeedback TEXT NOT NULL,
       engagementFeedback INT NOT NULL,
       additionalComments TEXT DEFAULT NULL
   );
   ```

## Running the Application

1. **Start the Development Server:**

   ```bash
   npm start
   ```

2. **Access the API:**

   The API will be available at `http://localhost:3000/api`.

## RESTful API Endpoints

### `/api/feedback`

- **`POST` Create Feedback:**

  Create a new feedback entry.

  ```http
  POST /api/feedback
  Content-Type: application/json

  {
      "patientName": "John Doe",
      "email": "john.doe@example.com",
      "age": 35,
      "maritalStatus": "Single",
      "seenTherapist": "Yes",
      "takingMedications": "No",
      "therapySatisfaction": 4,
      "experienceFeedback": "Great session!",
      "engagementFeedback": 5,
      "additionalComments": "Thank you."
  }
  ```

- **`GET` Retrieve All Feedback:**

  Retrieve all feedback entries.

  ```http
  GET /api/feedback
  ```

## Project Structure

```
patient-feedback-form-backend
│
├── routes
│   └── feedback.js       # Feedback API routes
│
├── utils
│   └── encryption.js     # Utility functions for encryption
│
├── db.js                 # Database connection
├── server.js             # Application entry point
├── .env                  # Environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Key Features

- **Encryption:**
  - Encrypts sensitive data like patient names and emails before storing them in the database.

- **Validation:**
  - Validates all input data using `express-validator`.

