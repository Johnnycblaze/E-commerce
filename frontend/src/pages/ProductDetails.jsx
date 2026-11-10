import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ProductDetails = () => {
  const { id } = useParams()
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  })
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState("")
  const navigate = useNavigate()

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      // Corrected URL matching backend route: /api/product-details
      const response = await fetch("http://localhost:8000/api/product-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id }),
      })
      const result = await response.json()
      if (result.success) {
        setData(result.data)
        setActiveImage(result.data?.productImage?.[0] || "")
      } else {
        toast.error(result.message || "Failed to load product details")
      }
    } catch (error) {
      console.error("Error fetching product details:", error)
      toast.error("Network error while loading product.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProductDetails()
    }
  }, [id])

  const handleAddToCart = async (e, productId) => {
    e.preventDefault()
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
    return <div className='py-20 text-center text-slate-500 mt-16'>Loading product details...</div>
  }

  const sellingPrice = Number(data?.sellingPrice ?? data?.price ?? 0)
  const originalPrice = Number(data?.price ?? data?.sellingPrice ?? 0)

  return (
    <div className='container mx-auto px-4 py-8 mt-16'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-10 rounded-2xl shadow-sm border'>
        
        {/* Product Images Section */}
        <div className='flex flex-col-reverse md:flex-row gap-4'>
          {/* Thumbnails */}
          <div className='flex md:flex-col gap-3 overflow-x-auto'>
            {data?.productImage?.map((imgUrl, index) => (
              imgUrl ? (
                <div 
                  key={index} 
                  className={`w-20 h-20 bg-slate-100 rounded-xl p-1 cursor-pointer border-2 ${activeImage === imgUrl ? 'border-red-600' : 'border-transparent'}`}
                  onClick={() => setActiveImage(imgUrl)}
                >
                  <img src={imgUrl} alt='' className='w-full h-full object-contain mix-blend-multiply' />
                </div>
              ) : null
            ))}
          </div>

          {/* Main Active Image */}
          <div className='flex-1 h-96 bg-slate-100 rounded-2xl p-4 flex items-center justify-center border'>
            {activeImage ? (
              <img src={activeImage} alt={data?.productName} className='max-h-full max-w-full object-contain mix-blend-multiply' />
            ) : (
              <div className='text-slate-400'>No image available</div>
            )}
          </div>
        </div>

        {/* Product Details Info */}
        <div className='flex flex-col gap-4'>
          <span className='bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase w-max'>
            {data?.brandName || data?.category || "Product"}
          </span>
          <h1 className='text-2xl md:text-3xl font-bold text-slate-800'>{data?.productName}</h1>
          <p className='text-slate-500 text-sm capitalize'>Category: {data?.category}</p>

          <div className='flex items-center gap-3 my-2'>
            <span className='text-2xl md:text-3xl font-bold text-red-600'>${sellingPrice.toFixed(2)}</span>
            {originalPrice > sellingPrice && (
              <span className='text-slate-400 line-through text-lg'>${originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div className='flex items-center gap-4 mt-4'>
            <button 
              onClick={(e) => handleAddToCart(e, data?._id)}
              className='flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-full font-semibold shadow-md transition-all cursor-pointer'
            >
              Add to Cart
            </button>
            <button 
              onClick={(e) => {
                handleAddToCart(e, data?._id)
                navigate('/cart')
              }}
              className='flex-1 border-2 border-red-600 text-red-600 hover:bg-red-50 py-3.5 rounded-full font-semibold transition-all cursor-pointer'
            >
              Buy Now
            </button>
          </div>

          <div className='mt-6 border-t pt-4'>
            <h3 className='font-bold text-slate-800 mb-2'>Description :</h3>
            <p className='text-slate-600 text-sm leading-relaxed whitespace-pre-line'>
              {data?.description || "No description provided for this product."}
            </p>
          </div>

          <div className='mt-4 bg-slate-50 p-4 rounded-xl text-xs text-slate-500'>
            🛡️ Free delivery & 7-day easy return policy available.
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductDetails