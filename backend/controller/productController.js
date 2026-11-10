const ProductModel = require("../model/productModel");

// ================= UPDATE PRODUCT CONTROLLER =================
const updateProductController = async (req, res) => {
  try {
    const { _id, ...resBody } = req.body;
    const { productId } = req.params;

    const targetId = _id || productId;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      targetId,
      resBody,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error updating product",
    });
  }
};

// ================= UPLOAD PRODUCT CONTROLLER =================
const UploadProductController = async (req, res) => {
  try {
    const newProduct = new ProductModel(req.body);
    const savedProduct = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product uploaded successfully!",
      data: savedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error uploading product",
    });
  }
};

// ================= GET ALL PRODUCTS CONTROLLER =================
const getProductController = async (req, res) => {
  try {
    const allProducts = await ProductModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: allProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching products",
    });
  }
};

// ================= GET CATEGORY-WISE PRODUCT (CASE-INSENSITIVE) =================
const categoryWiseProductController = async (req, res) => {
  try {
    const { category } = req.body || req.query;
    
    const query = category ? { category: { $regex: new RegExp("^" + category + "$", "i") } } : {};
    const products = await ProductModel.find(query);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching category-wise products",
    });
  }
};

// ================= GET CATEGORY PRODUCT (ONE PER CATEGORY) =================
const categoryProductController = async (req, res) => {
  try {
    const productCategory = await ProductModel.distinct("category");
    
    const productByCategory = [];
    for (const category of productCategory) {
      const product = await ProductModel.findOne({ category });
      if (product) {
        productByCategory.push(product);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Category products fetched successfully",
      data: productByCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching category products",
    });
  }
};

// ================= GET PRODUCT DETAILS CONTROLLER =================
const getProductDetailsController = async (req, res) => {
  try {
    const { productId } = req.body || req.params;
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product details fetched successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching product details",
    });
  }
};

// ================= SEARCH PRODUCT CONTROLLER =================
const searchProductController = async (req, res) => {
  try {
    const query = req.query.q;
    const regex = new RegExp(query, 'i', 'g');

    const products = await ProductModel.find({
      "$or": [
        { productName: regex },
        { category: regex }
      ]
    });

    return res.status(200).json({
      data: products,
      message: "Searched products list",
      error: false,
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};

module.exports = {
  UploadProductController,
  categoryProductController,
  categoryWiseProductController,
  getProductController,
  getProductDetailsController,
  updateProductController, 
  searchProductController
};