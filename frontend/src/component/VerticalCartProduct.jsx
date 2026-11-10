import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'

const VerticalCartProduct = ({ category, heading }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const elementRef = useRef(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/api/category-wise-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      })
      const result = await response.json()
      if (result.success) {
        setData(result.data || [])
      } else {
        toast.error(result.message || "Failed to load products")
      }
    } catch (error) {
      console.error("Error fetching category-wise products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (category) {
      fetchData()
    }
  }, [category])

  const scrollLeft = () => {
    if (elementRef.current) {
      elementRef.current.scrollLeft -= 350
    }
  }

  const scrollRight = () => {
    if (elementRef.current) {
      elementRef.current.scrollLeft += 350
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto px-4 my-6'>
        <h2 className='text-xl font-bold text-slate-800 mb-4'>{heading}</h2>
        <div className='text-slate-400 text-sm animate-pulse py-4'>Loading {heading}...</div>
      </div>
    )
  }

  if (data.length === 0) return null

  return (
    <div className='container mx-auto px-4 my-6 relative'>
      <h2 className='text-xl font-bold text-slate-800 mb-4'>{heading}</h2>
      
      <div className='relative flex items-center group'>
        {/* Scroll Left Button */}
        <button 
          onClick={scrollLeft} 
          className='absolute left-[-15px] bg-white shadow-md border border-slate-200 rounded-full p-2.5 z-10 hover:bg-slate-50 transition-all text-slate-700 cursor-pointer hidden md:flex items-center justify-center'
        >
          <FaAngleLeft size={18} />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={elementRef}
          className='flex items-center gap-4 overflow-x-auto scrollbar-none scroll-smooth py-2 px-1 w-full'
        >
          {data.map((product) => {
            const sellingPrice = Number(product?.sellingPrice ?? product?.price ?? 0)
            const originalPrice = Number(product?.price ?? product?.sellingPrice ?? 0)
            const imageUrl = product?.productImage?.[0] || "https://via.placeholder.com/150"

            return (
              <Link 
                to={`/product/${product?._id}`} 
                key={product?._id} 
                className='min-w-[210px] max-w-[210px] bg-white p-3 rounded-2xl shadow-sm border flex-shrink-0 flex flex-col justify-between group/card hover:shadow-md transition-all'
              >
                <div>
                  <div className='h-40 bg-slate-100 p-2 rounded-xl flex items-center justify-center mb-2 overflow-hidden border border-slate-50'>
                    <img 
                      src={imageUrl} 
                      alt={product?.productName} 
                      className='object-contain h-full w-full group-hover/card:scale-105 transition-transform duration-300 mix-blend-multiply' 
                    />
                  </div>
                  <h3 className='font-semibold text-slate-800 text-sm line-clamp-1'>{product?.productName}</h3>
                  <p className='text-xs text-slate-500 uppercase tracking-wide mt-0.5 truncate'>{product?.brandName || ''}</p>
                </div>

                <div className='flex items-center justify-between mt-3 pt-2 border-t border-slate-100'>
                  <div>
                    {originalPrice > sellingPrice && (
                      <span className='text-xs text-slate-400 line-through mr-1'>${originalPrice.toFixed(2)}</span>
                    )}
                    <span className='text-red-600 font-bold text-sm'>${sellingPrice.toFixed(2)}</span>
                  </div>
                  <span className='bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded-full font-medium group-hover/card:bg-red-600 group-hover/card:text-white transition-colors'>
                    View
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Scroll Right Button */}
        <button 
          onClick={scrollRight} 
          className='absolute right-[-15px] bg-white shadow-md border border-slate-200 rounded-full p-2.5 z-10 hover:bg-slate-50 transition-all text-slate-700 cursor-pointer hidden md:flex items-center justify-center'
        >
          <FaAngleRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default VerticalCartProduct