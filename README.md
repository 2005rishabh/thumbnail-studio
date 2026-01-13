# 🎨 Thumbnail Studio

An AI-powered YouTube thumbnail generator that helps content creators design stunning, professional thumbnails in seconds using Google's Gemini AI.

![Thumbnail Studio](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19.1-blue)

## 🌟 Features

- **AI-Powered Generation**: Leverage Google's Gemini AI to create custom YouTube thumbnails
- **Multiple Styles**: Choose from various design styles and color schemes
- **Aspect Ratio Control**: Generate thumbnails in different aspect ratios
- **User Authentication**: Secure session-based authentication with MongoDB
- **Save & Manage**: Store and retrieve your generated thumbnails
- **Real-time Preview**: See your thumbnail in a YouTube-like interface
- **Cloud Storage**: Images stored securely using Cloudinary
- **Responsive Design**: Beautiful, modern UI built with TailwindCSS and Motion
- **Smooth Animations**: Enhanced UX with Lenis smooth scrolling and Motion animations

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19.1 with TypeScript
- **Build Tool**: Vite 7.1
- **Styling**: TailwindCSS 4.1
- **Routing**: React Router DOM 7.8
- **Animations**: Motion 12.23
- **Smooth Scrolling**: Lenis
- **HTTP Client**: Axios
- **UI Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5.2
- **Database**: MongoDB with Mongoose
- **AI Integration**: Google Generative AI (Gemini)
- **Authentication**: Express Session + JWT
- **Password Hashing**: Bcrypt
- **Image Storage**: Cloudinary
- **Session Store**: connect-mongo
- **CORS**: Enabled for cross-origin requests

## 📁 Project Structure

```
gemini-project/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (Home, Generate, etc.)
│   │   ├── sections/      # Landing page sections
│   │   ├── context/       # React context (AuthContext)
│   │   ├── data/          # Static data and constants
│   │   ├── config/        # Client configuration
│   │   └── App.tsx        # Main app component
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Backend Express application
│   ├── config/           # Database configuration
│   ├── controllers/      # Request handlers
│   │   ├── authControllers.ts
│   │   ├── thumbnailController.ts
│   │   └── userController.ts
│   ├── models/           # MongoDB models
│   │   ├── User.ts
│   │   └── Thumbnail.ts
│   ├── routes/           # API routes
│   │   ├── AuthRoutes.ts
│   │   ├── ThumnailRoutes.ts
│   │   └── UserRoutes.ts
│   ├── middlewares/      # Express middlewares
│   ├── server.ts         # Main server file
│   └── package.json
│
└── vercel.json           # Vercel deployment configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key
- Cloudinary account

### Environment Variables

Create `.env` files in both `client` and `server` directories:

#### Server `.env`
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Client `.env`
```env
VITE_API_URL=http://localhost:3000
```

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd gemini-project
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

4. **Start the development servers**

In the `server` directory:
```bash
npm run server
```

In the `client` directory:
```bash
npm run dev
```

The client will run on `http://localhost:5173` and the server on `http://localhost:3000`.

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /check-auth` - Check authentication status

### Thumbnail Routes (`/api/thumbnails`)
- `POST /generate` - Generate a new thumbnail
- `GET /` - Get all user thumbnails
- `GET /:id` - Get specific thumbnail
- `PUT /:id` - Update thumbnail
- `DELETE /:id` - Delete thumbnail

### User Routes (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

## 📱 Pages

- **Home (`/`)**: Landing page with features, pricing, and testimonials
- **Login (`/login`)**: User authentication
- **Generate (`/generate`)**: AI thumbnail generation interface
- **My Generations (`/my-generation`)**: View and manage saved thumbnails
- **Preview (`/preview`)**: Preview thumbnails in YouTube interface

## 🎨 Key Components

- **Navbar**: Global navigation with authentication state
- **Footer**: Footer with links and information
- **AspectRatioSelector**: Choose thumbnail dimensions
- **ColorSchemeSelector**: Pick color palettes
- **StyleSelector**: Select design styles
- **PreviewPanel**: Real-time thumbnail preview
- **TiltImage**: Interactive image with tilt effect
- **TestimonialCard**: User testimonial display

## 🚢 Deployment

This project is configured for deployment on Vercel.

```bash
# Deploy from root directory
vercel --prod
```

The `vercel.json` configuration handles routing for both client and server.

## 🔒 Security Features

- Session-based authentication with secure cookies
- Password hashing with bcrypt
- CORS protection
- Environment variable protection
- JWT token support
- Secure session storage in MongoDB

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Rishabh Singh**
- GitHub: [@2005rishabh](https://github.com/2005rishabh)

## 🙏 Acknowledgments

- Google Gemini AI for thumbnail generation
- Cloudinary for image hosting
- React and TypeScript communities
- TailwindCSS for the beautiful UI framework

---

Made with ❤️ by Rishabh Singh
