# Placement Prep AI

A comprehensive web application designed to help students prepare for placements with practice assessments, coding challenges, aptitude tests, and resume building tools.

## Features

- **User Authentication**: Secure login and signup with JWT-based authentication
- **Coding Challenges**: Practice coding problems with submission and evaluation
- **Aptitude Tests**: Practice aptitude assessments for placement preparation
- **Resume Builder**: Create and manage professional resumes
- **Dashboard**: Personalized dashboard to track progress and access all features
- **Secure Storage**: User data and submissions stored in MongoDB

## Tech Stack

### Backend
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.5.0
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Security**: bcryptjs for password hashing
- **File Upload**: Multer 2.1.1
- **PDF Processing**: pdfjs-dist 5.6.205
- **HTTP Client**: Axios 1.15.2
- **CORS**: Enabled for cross-origin requests
- **Environment**: dotenv for configuration

### Frontend
- **HTML5**: Semantic markup for all pages
- **CSS**: Responsive styling
- **JavaScript**: Vanilla JS for interactivity and API integration
- **Storage**: LocalStorage for session management

## Project Structure

```
placement-prep-ai/
├── backend/
│   ├── server.js                 # Main Express server
│   ├── package.json              # Backend dependencies
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User data model
│   │   └── Submission.js        # Submission tracking model
│   └── routes/
│       ├── auth.js              # Authentication endpoints
│       ├── coding.js            # Coding challenge endpoints
│       └── resume.js            # Resume management endpoints
├── frontend/
│   ├── index.html               # Entry point (redirects to login/dashboard)
│   ├── login.html               # User login page
│   ├── signup.html              # User registration page
│   ├── dashboard.html           # Main dashboard
│   ├── coding.html              # Coding challenges page
│   ├── assessment.html          # Assessment/tests page
│   ├── aptitude.html            # Aptitude test page
│   ├── resume.html              # Resume builder page
│   ├── script.js                # Frontend JavaScript
│   └── style.css                # Frontend styling
└── README.md                     # This file
```

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install

3. Start the server:
   ```bash
   npm start
   ```
   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Open `index.html` in a web browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js http-server
   npx http-server
   ```

3. Access the application at `http://localhost:8000`

1. **Sign Up**: Create a new account with email and password
2. **Login**: Log in with your credentials
3. **Dashboard**: View your profile and access different sections
4. **Coding Challenges**: Solve and submit coding problems
5. **Aptitude Tests**: Take aptitude assessments
6. **Resume Builder**: Create and manage your resume

## Security Features

- **Password Hashing**: Bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication for API endpoints
- **CORS Protection**: Controlled cross-origin requests
- **Input Validation**: Server-side validation of user inputs
- **Secure Headers**: Proper HTTP headers for security

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Future Enhancements

- Real-time code execution for coding challenges
- AI-powered resume feedback
- Video tutorials and learning materials
- Peer-to-peer discussion forums
- Mobile app support
- Interview preparation modules
- Company-specific question banks


For issues and questions, please open an issue in the repository or contact the development team.

---

**Happy learning and best of luck with your placements! 🚀**
