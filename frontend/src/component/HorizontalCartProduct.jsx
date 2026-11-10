import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'

const HorizontalCartProduct = ({ category, heading }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const elementRef = useRef(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/api/category-wise-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      })
      const result = await response.json()
      if (result.success) {
        setData(result.data || [])
      }
    } catch (error) {
      console.error("Error fetching horizontal products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (category) fetchData()
  }, [category])

  const scrollRight = () => {
    if (elementRef.current) elementRef.current.scrollLeft += 300
  }

  const scrollLeft = () => {
    if (elementRef.current) elementRef.current.scrollLeft -= 300
  }

  if (loading) return <div className='py-4 text-center text-slate-400'>Loading {heading}...</div>
  if (data.length === 0) return null

  return (
    <div className='container mx-auto px-4 my-6'>
      <h2 className='text-xl font-bold text-slate-800 mb-4'>{heading}</h2>
      <div className='relative flex items-center group'>
        {/* Scroll Left Button */}
        <button 
          onClick={scrollLeft} 
          className='absolute left-[-15px] bg-white shadow-md border border-slate-200 rounded-full p-2.5 z-10 hover:bg-slate-50 transition-all text-slate-700 cursor-pointer hidden md:flex items-center justify-center'
        >
          <FaAngleLeft size={18} />
        </button>

        {/* Product Items Container */}
        <div 
          ref={elementRef} 
          className='flex items-center gap-4 overflow-x-scroll scrollbar-none scroll-smooth transition-all py-2 px-1 w-full'
        >
          {data.map((product) => {
            const sellingPrice = Number(product?.sellingPrice ?? product?.price ?? 0)
            const imageUrl = product?.productImage?.[0] || "https://via.placeholder.com/150"
            return (
              <Link 
                to={`/product/${product?._id}`} 
                key={product?._id} 
                className='min-w-[210px] max-w-[210px] bg-white p-3 rounded-2xl shadow-sm border flex-shrink-0 flex flex-col justify-between group/card hover:shadow-md transition-all'
              >
                <div className='h-36 bg-slate-100 p-2 rounded-xl flex items-center justify-center mb-2 overflow-hidden'>
                  <img src={imageUrl} alt={product?.productName} className='object-contain h-full w-full group-hover/card:scale-105 transition-transform' />
                </div>
                <h3 className='font-semibold text-slate-800 text-sm line-clamp-1'>{product?.productName}</h3>
                <p className='text-red-600 font-bold text-sm mt-1'>${sellingPrice.toFixed(2)}</p>
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

export default HorizontalCartProduct