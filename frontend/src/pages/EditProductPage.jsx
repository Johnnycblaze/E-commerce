import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdClose, MdCloudUpload } from 'react-icons/md';

// Product Categories List built directly into the file
const productCategory = [
  { id: 1, label: "Airpods", value: "airpods" },
  { id: 2, label: "Earphones", value: "earphones" },
  { id: 3, label: "Trimmers", value: "trimmers" },
  { id: 4, label: "Television", value: "television" },
  { id: 5, label: "Speakers", value: "speakers" },
  { id: 6, label: "Electronics", value: "electronics" },
];

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    price: "",
    sellingPrice: "",
    description: "",
  });

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/product/all-products`, {
            method: "GET",
            credentials: "include"
        });
        const result = await response.json();

        if (result.success) {
          const currentProduct = result.data.find(item => item._id === productId);
          if (currentProduct) {
            setData(currentProduct);
          } else {
            toast.error("Product not found.");
            navigate('/admin-panel/all-products');
          }
        } else {
          toast.error("Could not load products.");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle local image upload via FileReader
  const handleUploadProductImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, reader.result],
      }));
      setUploadingImage(false);
      toast.success("Image added successfully");
    };
    reader.onerror = () => {
      setUploadingImage(false);
      toast.error("Failed to read image file");
    };
  };

  const handleRemoveImage = (index) => {
    const newImages = [...data.productImage];
    newImages.splice(index, 1);
    setData((prev) => ({
      ...prev,
      productImage: newImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/product/update-product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          _id: productId,
          ...data
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Product updated successfully!");
        navigate('/admin-panel/all-products');
      } else {
        toast.error(result.message || "Failed to update product.");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Network error while updating product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto p-4 max-w-3xl'>
      <div className='bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
        <div className='flex items-center justify-between mb-6 pb-4 border-b border-slate-100'>
          <h2 className='text-xl font-bold text-slate-800'>Edit Product</h2>
          <button 
            onClick={() => navigate('/admin-panel/all-products')} 
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
              rows={4}
              className='w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none resize-none focus:border-red-600 transition-colors'
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type='submit'
            disabled={loading}
            className={`mt-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-sm w-full shadow-md transition-all ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving Changes...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;