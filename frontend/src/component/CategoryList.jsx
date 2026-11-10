import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'

const CategoryList = () => {
  const [categoryList, setCategoryList] = useState([])
  const [loading, setLoading] = useState(false)
  const categoryContainerRef = useRef(null)

  const fetchCategoryProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/api/get-category-product", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (data.success) {
        setCategoryList(data.data || [])
      } else {
        toast.error(data.message || "Failed to load categories")
      }
    } catch (error) {
      console.error("Error fetching category products:", error)
      toast.error("Network error while loading categories.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryProduct()
  }, [])

  const scrollLeft = () => {
    if (categoryContainerRef.current) {
      categoryContainerRef.current.scrollLeft -= 350
    }
  }

  const scrollRight = () => {
    if (categoryContainerRef.current) {
      categoryContainerRef.current.scrollLeft += 350
    }
  }

  return (
    <div className='container mx-auto px-4 my-3'>
      <div className='bg-white shadow-sm border border-slate-100 rounded-2xl py-3 px-4 relative flex items-center'>
        
        {/* Scroll Left Arrow Button */}
        <button 
          onClick={scrollLeft} 
          className='absolute left-2 bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 p-2 rounded-full z-20 transition-all cursor-pointer hidden md:flex items-center justify-center hover:scale-105'
          aria-label="Scroll left"
        >
          <FaAngleLeft size={16} />
        </button>

        {/* Categories Scrollable Container */}
        <div 
          ref={categoryContainerRef}
          className='flex items-center gap-6 md:gap-8 overflow-x-auto scrollbar-none scroll-smooth py-1 px-4 w-full justify-start md:justify-around'
        >
          {loading ? (
            <div className='flex items-center justify-center w-full py-2'>
              <p className='text-slate-400 text-sm animate-pulse'>Loading categories...</p>
            </div>
          ) : categoryList.length === 0 ? (
            <div className='flex items-center justify-center w-full py-2'>
              <p className='text-slate-400 text-sm'>No categories found.</p>
            </div>
          ) : (
            categoryList.map((product, index) => {
              const imageUrl = product?.productImage?.[0] || product?.image?.[0] || "https://via.placeholder.com/100"
              const categoryName = product?.category || "category"

              return (
                <Link 
                  to={`/product-category/${categoryName}`} 
                  key={index}
                  className='cursor-pointer flex flex-col items-center gap-2 group flex-shrink-0'
                >
                  <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-2.5 bg-slate-50 flex items-center justify-center shadow-inner border border-slate-200 group-hover:border-red-600 transition-all duration-300'>
                    <img 
                      src={imageUrl} 
                      alt={categoryName} 
                      className='h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300' 
                    />
                  </div>
                  <p className='text-xs md:text-sm font-semibold text-slate-700 capitalize text-center max-w-[90px] truncate group-hover:text-red-600 transition-colors'>
                    {categoryName?.replace(/-/g, ' ')}
                  </p>
                </Link>
              )
            })
          )}
        </div>

        {/* Scroll Right Arrow Button */}
        <button 
          onClick={scrollRight} 
          className='absolute right-2 bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 p-2 rounded-full z-20 transition-all cursor-pointer hidden md:flex items-center justify-center hover:scale-105'
          aria-label="Scroll right"
        >
          <FaAngleRight size={16} />
        </button>

      </div>
    </div>
  )
}

export default CategoryList