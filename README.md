# 🛍 LuxeCart E-commerce

LuxeCart is a modern full-stack e-commerce platform built with React + TypeScript and Node.js (Express) + MongoDB.  
It provides a seamless shopping experience with AI assistance, secure authentication, and a powerful admin dashboard.

---

## 🚀 Live Demo

🌐 Frontend (Vercel):  
👉 https://e-commerce-csec-astu-bootcamp.onrender.com/

---

## 🧠 Key Features

### 👤 User Features
- Browse products (Home, Shop)
- View product details
- Add to cart (Login required)
- Secure authentication (JWT)
- Forgot password with email support
- Order tracking via email updates
- Integrated payment using Chapa
- Wishlist functionality
- Product search and filtering

### 🤖 AI Assistant (RAG Integration)
- Ask questions about:
  - Products
  - Website usage
  - General help
- Smart responses using AI-powered retrieval system
- Real-time chat support

### 🛠 Admin Dashboard
- Manage users (suspend/activate accounts)
- Manage products (CRUD operations)
- Manage orders:
  - Pending
  - Shipped
  - Completed
- View user messages / feedback
- Send automatic email updates
- Cart management (admin can view/delete user cart items)
- User analytics and statistics

### 📧 Email System (Nodemailer)
- Login notifications
- Password reset emails
- Order status updates (e.g., shipped)
- Email verification
- Admin notifications

### 🛒 Shopping Features
- Shopping cart with quantity management
- Product wishlist
- Order management
- Payment integration with Chapa
- Mobile-responsive design
- Dark mode support

---

## 🧱 Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Mongoose** - ODM
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

### Other Integrations
- **Chapa Payment Gateway** - Payment processing
- **AI (RAG System)** - Intelligent assistant
- **Gmail SMTP** - Email delivery

---

## 📁 Project Structure

```
project/
│
├── frontend/                 # React + TypeScript (User & Admin UI)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   ├── lib/            # Utilities
│   │   └── types/          # TypeScript types
│   ├── public/
│   └── package.json
│
├── backend/                  # Express + MongoDB API
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Server entry point
│   └── package.json
│
└── README.md                # This file
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/saremworkuu/E-Commerce-CSEC-ASTU-Bootcamp.git
cd E-Commerce-CSEC-ASTU-Bootcamp
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

### Create .env file inside backend/

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

CHAPA_SECRET_KEY=your_chapa_secret_key

FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

### Run backend

```bash
npm run dev
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
```

### Create .env file inside frontend/

```env
VITE_API_URL=http://localhost:5000
```

### Run frontend

```bash
npm run dev
```

---

## 🔐 Authentication Flow

- JWT-based authentication with secure token storage
- Protected routes (cart, checkout, admin dashboard)
- Email verification for new users
- Password reset functionality
- Role-based access control (user/admin)

### Admin Credentials
- **Email**: `saremworkuu@gmail.com`
- **Password**: `admin123`

---

## 💳 Payment Integration

- **Chapa payment gateway** integration
- Secure transaction handling
- Order confirmation after payment
- Payment status tracking
- Email receipts

---

## 📬 Email Notifications

- **Login confirmation** - Welcome emails
- **Password reset** - Secure reset links
- **Order status updates** - Pending → Shipped → Delivered
- **Email verification** - Account activation
- **Admin notifications** - System alerts

---

## 🖼 Screenshots

### 🏠 Home Page
![Home](./screenshots/home.png)

### 🛒 Cart Page
![Cart](./screenshots/cart.png)

### 👤 Profile Page
![Profile](./screenshots/profile.png)

### 🛍 Shop Page
![Shop](./screenshots/shop.png)

### 🛠 Admin Dashboard
![Admin](./screenshots/admin.png)

---

## 🤝 Team Members

- **Feysel** - Frontend Development
- **Hayat** - Backend Development  
- **Meaza** - UI/UX Design
- **Sarendem** - Full-Stack Development & Project Lead

---

## 📌 Usage Flow

1. **User visits homepage** - Browse featured products
2. **Browse products** - Shop page with filtering
3. **Login/Register** - Secure authentication
4. **Add to cart** - Manage shopping cart
5. **Checkout** - Payment processing
6. **Receive confirmation** - Email notifications
7. **Track orders** - Order status updates

### Admin Workflow
1. **Login to admin panel** - Using admin credentials
2. **Manage products** - Add/edit/delete products
3. **Manage users** - View/suspend user accounts
4. **Process orders** - Update order status
5. **View analytics** - Dashboard statistics

---

## 🔄 Git Workflow (Team)

```bash
# Create feature branch
git checkout -b feature-name

# Make changes and commit
git add .
git commit -m "your descriptive message"

# Push to remote
git push origin feature-name

# Create pull request for review
```

---

## 🛠 Development Guidelines

### Code Quality
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add comments for complex logic

### Environment Variables
- **Never commit .env files** to version control
- Use `.env.example` for sharing variable templates
- Always validate environment variables on startup

### Database
- Use Mongoose for MongoDB interactions
- Implement proper data validation
- Create indexes for performance optimization

---

## ⚠️ Important Notes

- **Security**: Never expose sensitive data in client-side code
- **Environment**: Use different configurations for development/production
- **Backup**: Regular database backups recommended
- **Testing**: Write unit tests for critical functionality
- **Performance**: Optimize images and implement lazy loading

### Before Deployment
- Update environment variables
- Test all payment flows
- Verify email configurations
- Check admin functionality
- Test user registration/login

---

## 🚀 Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Backend (Render/Heroku)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy and test API endpoints

---

## ⭐️ Future Improvements

- **Advanced Analytics** - User behavior tracking
- **AI Recommendation System** - Personalized suggestions
- **Multi-language Support** - Internationalization
- **Mobile App** - React Native application
- **Advanced Search** - Elasticsearch integration
- **Real-time Notifications** - WebSocket implementation

---

## 🐛 Troubleshooting

### Common Issues

**Login Issues**
- Check admin credentials: `saremworkuu@gmail.com` / `admin123`
- Verify JWT_SECRET is set in backend .env
- Check MongoDB connection

**Email Issues**
- Verify Gmail app password (not regular password)
- Check EMAIL_USER and EMAIL_PASS in .env
- Ensure SMTP is properly configured

**Payment Issues**
- Verify Chapa secret key
- Check payment callback URLs
- Test in sandbox mode first

**Database Issues**
- Ensure MongoDB URI is correct
- Check network connectivity
- Verify database permissions

---

## 📄 License

This project is for educational purposes. © 2024 LuxeCart Team

---

## ❤️ Acknowledgment

Built with teamwork and dedication by the LuxeCart team 🚀

**Special thanks to:**
- CSEC ASTU Bootcamp organizers
- Open source community
- Our mentors and supporters

---

## 📞 Support

For questions or support:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

---

**Happy Shopping! 🛍️**
