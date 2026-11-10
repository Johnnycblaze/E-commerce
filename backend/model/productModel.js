const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  productName: String,
  brandName: String,
  category: String,
  productImage: [],
  price: Number,
  sellingPrice: Number,
  description: String,
}, {
  timestamps: true
})

const productModel = mongoose.model("product", productSchema)

module.exports = productModel