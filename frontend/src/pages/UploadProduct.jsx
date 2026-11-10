import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

const UploadProduct = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  })

  const [allCategory, setAllCategory] = useState([])

  // Fetch existing categories on component mount
  const fetchCategoryProduct = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/get-category-product")
      const result = await response.json()
      if (result.success) {
        setAllCategory(result.data || [])
      }
    } catch (err) {
      console.error("Error fetching categories", err)
    }
  }

  useEffect(() => {
    fetchCategoryProduct()
  }, [])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUploadImage = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, reader.result]
      }))
      toast.success("Image added successfully")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:8000/api/upload-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      })
      const result = await response.json()

      if (result.success) {
        toast.success(result.message || "Product uploaded successfully!")
        setData({
          productName: "",
          brandName: "",
          category: "",
          productImage: [],
          description: "",
          price: "",
          sellingPrice: ""
        })
        window.dispatchEvent(new Event('cartUpdated'))
      } else {
        toast.error(result.message || "Failed to upload product")
      }
    } catch (err) {
      toast.error("Something went wrong connecting to the server.")
    }
  }

  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm border max-w-2xl mx-auto'>
      <h2 className='text-xl font-bold mb-6 text-slate-800'>Upload Product</h2>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-1'>Product Name</label>
          <input 
            type='text' 
            name='productName' 
            value={data.productName} 
            onChange={handleOnChange} 
            placeholder='Enter product name' 
            required 
            className='w-full border p-2.5 rounded-xl text-sm outline-none focus:border-red-600'
          />
        </div>

        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-1'>Brand Name</label>
          <input 
            type='text' 
            name='brandName' 
            value={data.brandName} 
            onChange={handleOnChange} 
            placeholder='Enter brand name' 
            required 
            className='w-full border p-2.5 rounded-xl text-sm outline-none focus:border-red-600'
          />
        </div>

        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-1'>Category</label>
          <select
            name='category'
            value={data.category}
            onChange={handleOnChange}
            required
            className='w-full border p-2.5 rounded-xl text-sm outline-none focus:border-red-600 bg-white'
          >
            <option value="">Select Category</option>
            {allCategory.map((el, index) => (
              <option key={index} value={el.category}>
                {el.category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-1'>Product Image</label>
          <label htmlFor='uploadImageInput' className='cursor-pointer border-2 border-dashed border-slate-200 h-32 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors'>
            <FaCloudUploadAlt size={30} className='text-slate-400' />
            <span className='text-xs text-slate-500 font-medium mt-1'>Upload Product Image</span>
            <input type='file' id='uploadImageInput' onChange={handleUploadImage} className='hidden' />
          </label>
          {data.productImage.length > 0 && (
            <div className='flex gap-2 mt-2 flex-wrap'>
              {data.productImage.map((img, index) => (
                <div key={index} className='w-16 h-16 border rounded-lg p-1 relative bg-slate-50'>
                  <img src={img} alt='uploaded' className='w-full h-full object-contain' />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-1'>Price ($)</label>
            <input 
              type='number' 
              name='price' 
              value={data.price} 
              onChange={handleOnChange} 
              placeholder='0.00' 
              required 
              className='w-full border p-2.5 rounded-xl text-sm outline-none focus:border-red-600'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-1'>Selling Price ($)</label>
            <input 
              type='number' 
              name='sellingPrice' 
              value={data.sellingPrice} 
              onChange={handleOnChange} 
              placeholder='0.00' 
              required 
              className='w-full border p-2.5 rounded-xl text-sm outline-none focus:border-red-600'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-1'>Description</label>
          <textarea 
            name='description' 
            value={data.description} 
            onChange={handleOnChange} 
            placeholder='Enter product description' 
            rows={3} 
            className='w-full border p-2.5 rounded-xl text-sm outline-none focus:border-red-600'
          ></textarea>
        </div>

        <button type='submit' className='bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md mt-2 cursor-pointer'>
          Upload Product
        </button>
      </form>
    </div>
  )
}

export default UploadProduct