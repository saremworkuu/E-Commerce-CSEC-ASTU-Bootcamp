// routes/productRoutes.js
import express from "express";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from "../models/product.js";
import { Protect } from "../middleware/auth.js";

const router = express.Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only (jpeg, jpg, png, webp)!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// ==================== PUBLIC ROUTES (Anyone can access) ====================

// Get all products
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const query = Product.find().sort({ createdAt: -1 });
    
    if (limit > 0) {
      query.limit(limit);
    }
    
    const products = await query;
    res.json(products);

  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    // Check if ID is a valid MongoDB ObjectId first
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    let product;

    if (isObjectId) {
      product = await Product.findById(req.params.id);
    } 
    // If not found by _id or not an ObjectId, try to find by numeric 'id' field
    if (!product && !isNaN(req.params.id)) {
      product = await Product.findOne({ id: Number(req.params.id) });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== ADMIN ONLY ROUTES ====================

// Create new product with URL-based image (Admin only)
router.post("/", Protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { name, category, price, description, imageUrl, stock, featured } = req.body;

    // Basic validation
    if (!name || !category || price === undefined || !description) {
      return res.status(400).json({ message: "Missing required fields (name, category, price, description)" });
    }

    // For URL-based product creation (no file upload)
    let finalImageUrl = imageUrl || '/uploads/placeholder-product.jpg';
    let usedImageSource = imageUrl ? 'url' : 'default';

    const product = new Product({
      name,
      category,
      price: Number(price),
      description,
      imageUrl: finalImageUrl,
      stock: Number(stock) || 10,
      featured: featured || false,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
      imageSource: usedImageSource
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ 
      message: "Failed to create product", 
      error: error.message 
    });
  }
});

// Create new product with image upload (Admin only)
router.post("/with-image", Protect, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { name, category, price, description, stock, featured } = req.body;

    // Basic validation
    if (!name || !category || price === undefined || !description) {
      return res.status(400).json({ message: "Missing required fields (name, category, price, description)" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required for this endpoint" });
    }

    // Use uploaded image
    const finalImageUrl = `/uploads/${req.file.filename}`;

    const product = new Product({
      name,
      category,
      price: Number(price),
      description,
      imageUrl: finalImageUrl,
      stock: Number(stock) || 10,
      featured: featured || false,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully with uploaded image",
      product,
      imageSource: 'upload'
    });
  } catch (error) {
    console.error("Create product with image error:", error);
    res.status(500).json({ 
      message: "Failed to create product", 
      error: error.message 
    });
  }
});

// Update product (Admin only)
router.put("/:id", Protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ 
      message: "Failed to update product", 
      error: error.message 
    });
  }
});

// Delete product (Admin only)
router.delete("/:id", Protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;