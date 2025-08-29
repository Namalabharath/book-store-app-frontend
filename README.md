# 📚 Book Store Application

A full-stack e-commerce book store application built with React.js frontend and Node.js backend, featuring user authentication, cart management, payment integration, and admin dashboard.

## 🚀 Features

### User Features
- **Authentication**: User registration and login with JWT tokens
- **Book Browsing**: Browse books with filtering and search capabilities
- **Shopping Cart**: Add/remove books, persistent cart across sessions
- **Order Management**: Place orders with COD or online payment
- **Order Tracking**: View order history and status

### Payment Integration
- **Razorpay Integration**: Secure online payment processing
- **Cash on Delivery**: COD option for users
- **Payment Verification**: Automatic payment status updates

### Admin Features
- **Admin Dashboard**: Comprehensive admin panel
- **Book Management**: Add, edit, delete books
- **Order Management**: View all orders and update order status
- **User Management**: View registered users
- **Statistics**: Sales and order analytics

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **SweetAlert2** - Beautiful alerts
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Razorpay SDK** - Payment processing
- **Multer** - File uploads
- **CORS** - Cross-origin requests

## 📁 Project Structure

```
book-store-app/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── books/          # Book management
│   │   ├── orders/         # Order processing
│   │   ├── payments/       # Payment handling
│   │   ├── users/          # User management
│   │   ├── middleware/     # Custom middleware
│   │   └── stats/          # Analytics
│   ├── public/uploads/     # File uploads
│   └── index.js           # Server entry point
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/         # Page components
    │   ├── redux/         # State management
    │   ├── context/       # React context
    │   ├── utils/         # Utility functions
    │   └── assets/        # Static assets
    └── public/            # Public assets
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Razorpay account (for payment integration)

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET_KEY=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the frontend directory:
   ```env
   VITE_API_KEY=your_firebase_api_key
   VITE_Auth_Domain=your_firebase_auth_domain
   VITE_PROJECT_ID=your_firebase_project_id
   VITE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_MESSAGING_SENDERID=your_firebase_messaging_sender_id
   VITE_APPID=your_firebase_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Application will run on `http://localhost:5173`

## 🔑 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/admin` - Admin login

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books/create-book` - Create book (Admin)
- `PUT /api/books/edit/:id` - Update book (Admin)
- `DELETE /api/books/:id` - Delete book (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/admin` - Get all orders (Admin)
- `PATCH /api/orders/:id/status` - Update order status (Admin)

### Payments
- `POST /api/payments/create-razorpay-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment

## 📱 Usage

### For Users
1. Register/Login to the application
2. Browse available books
3. Add books to cart
4. Proceed to checkout
5. Choose payment method (COD/Online)
6. Track order status

### For Admins
1. Login with admin credentials
2. Access admin dashboard
3. Manage books (Add/Edit/Delete)
4. View and manage orders
5. Update order statuses
6. View sales statistics

## 🔐 Security Features

- JWT token-based authentication
- Password hashing
- Admin route protection
- Input validation
- CORS configuration
- Environment variable protection

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend (Vercel/Railway/Heroku)
1. Configure environment variables
2. Update CORS settings for production URL
3. Deploy with your preferred service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Bharath** - Initial work

## 🆘 Support

For support, email [your-email@example.com] or create an issue on GitHub.

---

⭐ Star this repository if you found it helpful!
