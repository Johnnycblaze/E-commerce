import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const CategoryProduct = () => {
  const { categoryName } = useParams()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true)
      // Matches the backend route /api/category-wise-product
      const response = await fetch("http://localhost:8000/api/category-wise-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: categoryName }),
      })
      const result = await response.json()
      if (result.success) {
        setData(result.data || [])
      } else {
        toast.error(result.message || "Failed to load products")
      }
    } catch (error) {
      console.error("Error loading products:", error)
      toast.error("Error loading products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (categoryName) {
      fetchCategoryWiseProduct()
    }
  }, [categoryName])

  const handleAddToCart = async (e, productId) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const response = await fetch("http://localhost:8000/api/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      })
      const result = await response.json()
      if (result.success) {
        toast.success(result.message)
        window.dispatchEvent(new Event('cartUpdated'))
      } else {
        toast.error(result.message || "Please login first")
      }
    } catch (err) {
      toast.error("Could not add to cart.")
    }
  }

  if (loading) {
    return <div className='py-20 text-center text-slate-500 mt-16'>Loading products...</div>
  }

  return (
    <div className='container mx-auto px-4 py-8 mt-16'>
      <h2 className='text-2xl font-bold capitalize mb-6 text-slate-800'>
        Category : {categoryName?.replace(/-/g, ' ')}
      </h2>

      {data.length === 0 ? (
        <div className='bg-white p-12 rounded-2xl shadow-sm border text-center flex flex-col items-center gap-4'>
          <p className='text-slate-500 text-lg'>No products found in this category.</p>
          <Link to={"/"} className='bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all'>
            Return Home
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {data.map((product) => {
            const name = product?.productName || "Product Name"
            const sellingPrice = Number(product?.sellingPrice ?? product?.price ?? 0)
            const originalPrice = Number(product?.price ?? product?.sellingPrice ?? 0)
            const imageUrl = product?.productImage?.[0] || "https://via.placeholder.com/150"

            return (
              <Link 
                to={`/product/${product?._id}`} 
                key={product?._id} 
                className='bg-white p-4 rounded-2xl shadow-sm border flex flex-col justify-between group hover:shadow-md transition-all'
              >
                <div>
                  <div className='bg-slate-100 h-48 p-4 rounded-xl flex items-center justify-center mb-3 overflow-hidden border border-slate-50'>
                    <img 
                      src={imageUrl} 
                      alt={name} 
                      className='object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply' 
                    />
                  </div>
                  <h3 className='font-semibold text-slate-800 line-clamp-1'>{name}</h3>
                  <p className='text-xs text-slate-500 uppercase mt-0.5'>{product?.brandName || ''}</p>
                </div>

                <div className='flex items-center justify-between mt-4 pt-3 border-t border-slate-100'>
                  <div>
                    {originalPrice > sellingPrice && (
                      <span className='text-xs text-slate-400 line-through mr-1'>${originalPrice.toFixed(2)}</span>
                    )}
                    <span className='text-red-600 font-bold text-base'>${sellingPrice.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={(e) => handleAddToCart(e, product?._id)} 
                    className='bg-red-600 hover:bg-red-700 text-white text-xs px-3.5 py-2 rounded-full font-semibold shadow-sm transition-all'
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CategoryProduct