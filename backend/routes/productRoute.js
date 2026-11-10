const express = require("express");
const router = express.Router();
const { 
  UploadProductController, 
  getProductController, 
  updateProductController,
  categoryWiseProductController,
  categoryProductController, 
  getProductDetailsController, 
  searchProductController
} = require("../controller/productController");

const authToken = require("../middleware/authToken"); 

// Product Routes
router.post("/upload-product", authToken, UploadProductController);
router.get("/all-products", getProductController);
router.put("/update-product", authToken, updateProductController);

router.get("/get-category-product", categoryProductController);
router.post("/get-category-product", categoryProductController);

router.get("/category-product", categoryProductController);
router.post("/category-product", categoryProductController);

// Support both GET and POST for category-wise filtering
router.post("/category-wise-product", categoryWiseProductController);
router.get("/category-wise-product", categoryWiseProductController);

router.post("/product-details", getProductDetailsController);
router.post("/product/product-details", getProductDetailsController);
router.get('/search', searchProductController);

module.exports = router;
