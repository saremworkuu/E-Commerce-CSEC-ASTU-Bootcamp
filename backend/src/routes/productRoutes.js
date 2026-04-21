// routes/productRoutes.js
import express from "express";
import Product from "../models/product.js";
import { Protect } from "../middleware/auth.js";

const router = express.Router();

// ==================== PUBLIC ROUTES (Anyone can access) ====================

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

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

// Create new product (Admin only)
router.post("/", Protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { name, category, price, description, imageUrl, stock, featured } = req.body;

    // Basic validation
    if (!name || !category || price === undefined || !description || !imageUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = new Product({
      name,
      category,
      price: Number(price),
      description,
      imageUrl,
      stock: Number(stock) || 10,
      featured: featured || false,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.error("Create product error:", error);
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