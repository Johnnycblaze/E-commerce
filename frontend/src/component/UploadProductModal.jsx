import React, { useState, useRef } from 'react'
import { MdClose, MdCloudUpload } from 'react-icons/md'
import { toast } from 'react-toastify'

const productCategory = [
  { id: 1, label: "Airpods", value: "airpods" },
  { id: 2, label: "Earphones", value: "earphones" },
  { id: 3, label: "Trimmers", value: "trimmers" },
  { id: 4, label: "Television", value: "television" },
  { id: 5, label: "Speakers", value: "speakers" },
  { id: 6, label: "Camera", value: "cameras" },
  { id: 7, label: "Refrigerator", value: "refrigerators" },
  { id: 8, label: "Mobiles", value: "mobiles" },
  { id: 9, label: "Mouse", value: "mouses" },
]

const UploadProductModal = ({ onClose, fetchData }) => {
  const fileInputRef = useRef()
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    price: "",
    sellingPrice: "",
    description: "",
  })

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle local image upload via FileReader
  const handleUploadProductImage = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, reader.result],
      }))
      setUploadingImage(false)
      toast.success("Image added successfully")
    }
    reader.onerror = () => {
      setUploadingImage(false)
      toast.error("Failed to read image file")
    }
  }

  const handleRemoveImage = (index) => {
    const newImages = [...data.productImage]
    newImages.splice(index, 1)
    setData((prev) => ({
      ...prev,
      productImage: newImages,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:8000/api/product/upload-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // <-- Crucial: sends authentication token cookie
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.message || "Product uploaded successfully!")
        onClose() 
        fetchData() 
      } else {
        toast.error(result.message || "Failed to upload product.")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Network error while uploading product.")
    }
  }

  return (
    <div className='fixed inset-0 bg-slate-700 bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100'>
        <div className='flex items-center justify-between mb-4 pb-3 border-b border-slate-100'>
          <h2 className='text-lg font-bold text-slate-800'>Upload Product</h2>
          <button 
            type="button"
            onClick={onClose} 
            className='text-slate-400 hover:text-slate-700 transition-colors'
          >
            <MdClose size={24} />
          </button>
        </div>

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          {/* Product Name */}
          <div>
            <label className='block text-xs font-semibold text-slate-700 mb-1'>Product Name :</label>
            <input 
              type='text' 
              placeholder='Enter product name'
              name='productName'
              value={data.productName}
              onChange={handleOnChange}
              className='w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-red-600 transition-colors'
              required
            />
          </div>

          {/* Brand Name */}
          <div>
            <label className='block text-xs font-semibold text-slate-700 mb-1'>Brand Name :</label>
            <input 
              type='text' 
              placeholder='Enter brand name'
              name='brandName'
              value={data.brandName}
              onChange={handleOnChange}
              className='w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-red-600 transition-colors'
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className='block text-xs font-semibold text-slate-700 mb-1'>Category :</label>
            <select 
              name='category'
              value={data.category}
              onChange={handleOnChange}
              className='w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-red-600 transition-colors'
              required
            >
              <option value={""}>Select Category</option>
              {productCategory.map((el) => (
                <option value={el.value} key={el.id}>{el.label}</option>
              ))}
            </select>
          </div>

          {/* Product Images Upload & Preview */}
          <div>
            <label className='block text-xs font-semibold text-slate-700 mb-1'>Product Images :</label>
            <div className='p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-4 flex-wrap'>
              <div 
                onClick={() => fileInputRef.current.click()}
                className='h-24 w-24 bg-slate-200 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-300 transition-colors border border-dashed border-slate-400'
              >
                {uploadingImage ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></span>
                ) : (
                  <MdCloudUpload size={24} className="text-slate-500"/>
                )}
                <p className='text-[10px] text-slate-600 font-medium'>Upload</p>
                <input 
                  type='file' 
                  ref={fileInputRef}
                  className='hidden' 
                  onChange={handleUploadProductImage} 
                  accept='image/*'
                />
              </div>
              
              {data.productImage?.map((imgUrl, index) => (
                <div key={index} className='h-24 w-24 relative group border rounded-lg border-slate-200 overflow-hidden bg-white'>
                  <img src={imgUrl} alt={`product ${index}`} className='h-full w-full object-contain' />
                  <button 
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className='absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <MdClose size={12}/>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Price & Selling Price Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-semibold text-slate-700 mb-1'>Price ($) :</label>
              <input 
                type='number' 
                placeholder='Enter price'
                name='price'
                value={data.price}
                onChange={handleOnChange}
                className='w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-red-600 transition-colors'
                required
              />
            </div>
            <div>
              <label className='block text-xs font-semibold text-slate-700 mb-1'>Selling Price ($) :</label>
              <input 
                type='number' 
                placeholder='Enter selling price'
                name='sellingPrice'
                value={data.sellingPrice}
                onChange={handleOnChange}
                className='w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-red-600 transition-colors'
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className='block text-xs font-semibold text-slate-700 mb-1'>Description :</label>
            <textarea 
              placeholder='Enter product description'
              name='description'
              value={data.description}
              onChange={handleOnChange}
              rows={3}
              className='w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none resize-none focus:border-red-600 transition-colors'
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type='submit'
            className='mt-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-sm w-full shadow-md transition-all'
          >
            Upload Product
          </button>
        </form>
      </div>
    </div>
  )
}

export default UploadProductModal