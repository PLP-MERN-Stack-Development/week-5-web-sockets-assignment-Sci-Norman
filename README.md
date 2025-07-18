

# MERN Stack Blog Application

A full-stack blog application built with MongoDB, Express.js, React.js, and Node.js (MERN stack) featuring user authentication, CRUD operations, image uploads, search functionality, and more.

## 🚀 Features

- **User Authentication**: Registration, login, and protected routes
- **Blog Management**: Create, read, update, and delete blog posts
- **Categories**: Organize posts by categories
- **Comments**: Add comments to blog posts
- **Image Uploads**: Upload featured images for posts
- **Search & Filter**: Search posts by title, content, or tags
- **Pagination**: Navigate through posts with pagination
- **Responsive Design**: Works on all device sizes
- **Real-time Updates**: Optimistic UI updates

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Document Mapper)
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
mern-blog/
├── server/                 # Backend application
│   ├── config/            # Database configuration
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── uploads/          # Uploaded images
│   ├── server.js         # Main server file
│   └── .env              # Environment variables
├── client/               # Frontend application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── App.jsx       # Main app component
│   ├── index.html        # HTML template
│   └── vite.config.js    # Vite configuration
└── README.md
```

## � Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-blog
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern-blog
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

5. **Start MongoDB**
   - If using local MongoDB: Make sure MongoDB is running
   - If using MongoDB Atlas: Update the `MONGODB_URI` in the `.env` file

6. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/health

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Posts
- `GET /api/posts` - Get all posts (with pagination, search, filtering)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/comments` - Add comment to post (protected)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Upload
- `POST /api/upload` - Upload image (protected)
- `DELETE /api/upload/:filename` - Delete uploaded image (protected)

## 🔧 Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-blog
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### Client (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Usage

1. **Register a new account** or **login** with existing credentials
2. **Create a new post** by clicking "Create Post" in the navigation
3. **Browse posts** on the home page with search and filtering
4. **View individual posts** by clicking on them
5. **Add comments** to posts
6. **Edit or delete** your own posts
7. **Upload images** for post featured images

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred platform (Heroku, AWS, etc.)
3. Ensure MongoDB connection is properly configured

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your preferred platform (Netlify, Vercel, etc.)
3. Update the API URL in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the MERN stack community
- Thanks to all contributors and open-source libraries
