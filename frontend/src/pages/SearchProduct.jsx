import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const SearchProduct = () => {
  const query = new URLSearchParams(useLocation().search).get("q") || ""
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchSearchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(query)}`)
      const result = await response.json()
      if (result.success) {
        setData(result.data || [])
      } else {
        setData([])
      }
    } catch (err) {
      console.error("Search error:", err)
      toast.error("Failed to search products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      fetchSearchProduct()
    }
  }, [query])

  if (loading) return <div className='py-20 text-center text-slate-500 mt-16'>Searching products...</div>

  return (
    <div className='container mx-auto px-4 py-8 mt-16'>
      <h2 className='text-2xl font-bold mb-6 text-slate-800'>
        Search Results for <span className='text-red-600'>"{query}"</span> ({data.length})
      </h2>

      {data.length === 0 ? (
        <div className='bg-white p-12 rounded-2xl shadow-sm border text-center flex flex-col items-center gap-4'>
          <p className='text-slate-500 text-lg'>No products found matching your search.</p>
          <Link to={"/"} className='bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all'>
            Back to Home
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
          {data.map((product) => {
            const sellingPrice = Number(product?.sellingPrice ?? product?.price ?? 0)
            const imageUrl = product?.productImage?.[0] || "https://via.placeholder.com/150"

            return (
              <div key={product._id} className='bg-white p-4 rounded-2xl shadow-sm border flex flex-col justify-between hover:shadow-md transition-shadow'>
                <div>
                  <div className='h-40 bg-slate-50 p-2 rounded-xl flex items-center justify-center mb-3'>
                    <img src={imageUrl} alt={product?.productName} className='object-contain h-full w-full mix-blend-multiply' />
                  </div>
                  <h3 className='font-semibold text-sm md:text-base text-slate-800 line-clamp-1'>{product?.productName}</h3>
                  <p className='text-xs text-slate-500 capitalize mt-0.5'>{product?.category}</p>
                  <p className='text-red-600 font-bold text-base mt-2'>${sellingPrice.toFixed(2)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchProduct