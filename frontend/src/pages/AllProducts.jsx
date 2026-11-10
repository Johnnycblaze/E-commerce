import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { MdModeEdit } from 'react-icons/md'

const AllProducts = () => {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllProducts = async () => {
    try {
      setLoading(true)
      // Corrected URL matching backend router mount point: /api/all-products
      const response = await fetch("http://localhost:8000/api/all-products", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (data.success) {
        setAllProducts(data.data || [])
      } else {
        toast.error(data.message || "Failed to load products")
      }
    } catch (error) {
      console.error("Fetch Products Error:", error)
      toast.error("Failed to connect to backend server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllProducts()
  }, [])

  if (loading) return <div className='py-12 text-center text-slate-500'>Loading products...</div>

  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm border'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-bold text-slate-800'>All Products Management</h2>
        <Link to={'/admin-panel/upload-product'} className='bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-full font-semibold transition-all'>
          Upload Product
        </Link>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
        {allProducts.map((product) => {
          const sellingPrice = Number(product?.sellingPrice ?? product?.price ?? 0)
          const imageUrl = product?.productImage?.[0] || "https://via.placeholder.com/150"

          return (
            <div key={product._id} className='bg-slate-50 p-3 rounded-xl border flex flex-col justify-between'>
              <div>
                <div className='h-36 bg-white p-2 rounded-lg flex items-center justify-center mb-2'>
                  <img src={imageUrl} alt={product?.productName} className='object-contain h-full w-full mix-blend-multiply' />
                </div>
                <h3 className='font-semibold text-sm text-slate-800 line-clamp-1'>{product?.productName}</h3>
                <p className='text-red-600 font-bold text-sm mt-1'>${sellingPrice.toFixed(2)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AllProducts