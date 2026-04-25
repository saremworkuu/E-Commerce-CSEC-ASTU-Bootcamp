import express from 'express';
import cors from 'cors';
import "dotenv/config";
import swaggerUI from 'swagger-ui-express';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import wishlistRoutes from './routes/wishlistRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import debugRoutes from './routes/debug.js';
import connectDB from './config/db.js';
import dns from "node:dns";
import path from 'path';
import aichat from './routes/ai-chat.js';
import swaggerDocument from './swagger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dns.setServers(['1.1.1.1', '1.0.0.1', '8.8.8.8', '8.8.4.4']);
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Swagger docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get('/api-docs.json', (req, res) => res.json(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/chat', aichat);
app.use('/api/debug', debugRoutes);

app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});   
