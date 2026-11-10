import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '', phone: '', address: '', city: '', state: '', postalCode: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:8000/api/view-cart-product", { 
      method: "GET",
      credentials: "include" 
    })
      .then(res => res.json())
      .then(data => { 
        if (data.success) {
          setCartItems(data.data || []) 
        }
      })
      .catch(err => console.error("Error fetching cart for checkout:", err))
      .finally(() => setLoading(false))
  }, [])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
  }

  // Calculations
  const totalQty = cartItems.reduce((sum, item) => sum + Number(item?.quantity || 1), 0)
  
  const subTotal = cartItems.reduce((sum, item) => {
    const product = item?.productId || {}
    return sum + (Number(product?.sellingPrice ?? product?.price ?? 0) * Number(item?.quantity || 1))
  }, 0)

  const shippingFee = subTotal > 0 && subTotal < 500 ? 15.00 : 0.00
  const grandTotal = subTotal + shippingFee

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    try {
      // Lightweight payload for order request
      const lightweightCartItems = cartItems.map(item => ({
        productId: item?.productId?._id || item?.productId,
        quantity: item?.quantity || 1,
        price: Number(item?.productId?.sellingPrice ?? item?.productId?.price ?? 0)
      }))

      const response = await fetch("http://localhost:8000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          cartItems: lightweightCartItems, 
          shippingAddress, 
          subTotal,
          shippingFee,
          totalAmount: grandTotal 
        })
      })
      const result = await response.json()
      if (result.success) {
        toast.success("Order placed successfully!")
        window.dispatchEvent(new Event('cartUpdated'))
        navigate('/order-history')
      } else {
        toast.error(result.message || "Failed to place order")
      }
    } catch (err) {
      console.error("Checkout network error:", err)
      toast.error("Network error during checkout.")
    }
  }

  if (loading) return <div className='py-20 text-center text-slate-500 mt-16'>Loading checkout...</div>

  return (
    <div className='container mx-auto px-4 py-8 mt-16'>
      <h2 className='text-2xl font-bold mb-6 text-slate-800'>Checkout & Shipping</h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        
        {/* Shipping Form */}
        <form onSubmit={handlePlaceOrder} className='bg-white p-6 rounded-2xl shadow-sm border flex flex-col gap-4'>
          <h3 className='font-bold text-lg border-b pb-2 text-slate-800'>Shipping Address</h3>
          <input type='text' name='fullName' placeholder='Full Name' value={shippingAddress.fullName} onChange={handleOnChange} required className='border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-red-600' />
          <input type='tel' name='phone' placeholder='Phone Number' value={shippingAddress.phone} onChange={handleOnChange} required className='border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-red-600' />
          <input type='text' name='address' placeholder='Street Address' value={shippingAddress.address} onChange={handleOnChange} required className='border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-red-600' />
          <div className='grid grid-cols-2 gap-4'>
            <input type='text' name='city' placeholder='City' value={shippingAddress.city} onChange={handleOnChange} required className='border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-red-600' />
            <input type='text' name='state' placeholder='State' value={shippingAddress.state} onChange={handleOnChange} required className='border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-red-600' />
          </div>
          <input type='text' name='postalCode' placeholder='Postal Code' value={shippingAddress.postalCode} onChange={handleOnChange} required className='border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-red-600' />
          <button type='submit' className='w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-full font-semibold mt-4 shadow-md transition-all cursor-pointer'>
            Place Order (${grandTotal.toFixed(2)})
          </button>
        </form>

        {/* Detailed Order Breakdown Card */}
        <div className='bg-white p-6 rounded-2xl shadow-sm border h-max flex flex-col gap-4'>
          <h3 className='font-bold text-lg border-b pb-2 text-slate-800'>Order Details</h3>
          
          <div className='flex flex-col gap-3 max-h-60 overflow-y-auto pr-1'>
            {cartItems.map(item => {
              const product = item?.productId || {}
              const unitPrice = Number(product?.sellingPrice ?? product?.price ?? 0)
              const itemTotal = unitPrice * Number(item?.quantity || 1)
              return (
                <div key={item._id} className='flex justify-between items-center text-sm border-b border-slate-100 pb-3'>
                  <div className='flex items-center gap-3'>
                    <img src={product?.productImage?.[0] || "https://via.placeholder.com/150"} alt='' className='w-12 h-12 object-contain bg-slate-100 rounded-lg p-1 border' />
                    <div>
                      <p className='font-semibold text-slate-800 line-clamp-1'>{product?.productName}</p>
                      <p className='text-xs text-slate-500'>Qty: {item.quantity} × ${unitPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className='font-bold text-slate-800'>${itemTotal.toFixed(2)}</span>
                </div>
              )
            })}
          </div>

          <div className='flex justify-between text-sm text-slate-600 border-t pt-3'>
            <span>Total Quantity:</span>
            <span className='font-semibold text-slate-800'>{totalQty} Pcs</span>
          </div>

          <div className='flex justify-between text-sm text-slate-600'>
            <span>Subtotal Amount:</span>
            <span className='font-semibold text-slate-800'>${subTotal.toFixed(2)}</span>
          </div>

          <div className='flex justify-between text-sm text-slate-600'>
            <span>Shipping Fee:</span>
            <span className='font-semibold text-slate-800'>
              {shippingFee === 0 ? <span className='text-green-600 font-bold'>FREE</span> : `$${shippingFee.toFixed(2)}`}
            </span>
          </div>

          <div className='flex justify-between font-bold text-lg border-t pt-3 text-slate-800'>
            <span>Grand Total:</span>
            <span className='text-red-600'>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Checkout