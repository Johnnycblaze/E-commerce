import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MdDelete } from 'react-icons/md'

const Cart = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchCartData = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/api/view-cart-product", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      const result = await response.json()
      if (result.success) {
        setData(result.data || [])
      } else {
        setData([])
      }
    } catch (error) {
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCartData()
  }, [])

  const updateQuantity = async (id, qty) => {
    if (qty < 1) return
    try {
      const response = await fetch("http://localhost:8000/api/update-cart-qty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ _id: id, quantity: qty })
      })
      const result = await response.json()
      if (result.success) {
        fetchCartData()
        window.dispatchEvent(new Event('cartUpdated'))
      }
    } catch (err) {
      toast.error("Failed to update quantity")
    }
  }

  const deleteCartItem = async (id) => {
    try {
      const response = await fetch("http://localhost:8000/api/delete-cart-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ _id: id })
      })
      const result = await response.json()
      if (result.success) {
        toast.success("Item removed from cart")
        fetchCartData()
        window.dispatchEvent(new Event('cartUpdated'))
      }
    } catch (err) {
      toast.error("Failed to delete item")
    }
  }

  const totalQty = data.reduce((sum, item) => sum + Number(item?.quantity || 1), 0)
  
  const subTotal = data.reduce((sum, item) => {
    const product = item?.productId || {}
    const price = Number(product?.sellingPrice ?? product?.price ?? 0)
    return sum + (price * Number(item?.quantity || 1))
  }, 0)

  const shippingFee = subTotal > 0 && subTotal < 500 ? 15.00 : 0.00
  const grandTotal = subTotal + shippingFee

  if (loading) return <div className='py-20 text-center text-slate-500 mt-16'>Loading shopping cart...</div>

  return (
    <div className='container mx-auto px-4 py-8 mt-16'>
      <h2 className='text-2xl font-bold mb-6 text-slate-800'>Shopping Cart</h2>

      {data.length === 0 ? (
        <div className='bg-white p-12 rounded-2xl shadow-sm border text-center flex flex-col items-center gap-4'>
          <p className='text-slate-500 text-lg'>Your cart is empty or you need to login.</p>
          <div className='flex gap-4'>
            <Link to={"/login"} className='bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all'>
              Login Now
            </Link>
            <Link to={"/"} className='border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-full text-sm font-semibold transition-all'>
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          
          <div className='lg:col-span-2 flex flex-col gap-4'>
            {data.map((item) => {
              const product = item?.productId || {}
              const price = Number(product?.sellingPrice ?? product?.price ?? 0)
              const quantity = Number(item?.quantity || 1)
              const itemTotal = price * quantity
              const imageUrl = product?.productImage?.[0] || "https://via.placeholder.com/150"

              return (
                <div key={item._id} className='bg-white p-4 rounded-2xl shadow-sm border flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-4'>
                    <div className='w-20 h-20 bg-slate-100 rounded-xl p-2 flex items-center justify-center border border-slate-100 flex-shrink-0'>
                      <img src={imageUrl} alt={product?.productName} className='h-full w-full object-contain mix-blend-multiply' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-slate-800 line-clamp-1 text-sm md:text-base'>{product?.productName || "Product"}</h3>
                      <p className='text-xs text-slate-500 capitalize mt-0.5'>{product?.category || ""}</p>
                      <p className='text-red-600 font-bold text-sm md:text-base mt-1'>
                        {quantity} × ${price.toFixed(2)} = <span className='text-slate-900'>${itemTotal.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='flex items-center border border-slate-300 rounded-lg px-2 py-1 gap-3 bg-slate-50'>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className='text-slate-600 hover:text-red-600 font-bold px-1 cursor-pointer'>-</button>
                      <span className='font-semibold text-sm text-slate-800 w-4 text-center'>{quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className='text-slate-600 hover:text-red-600 font-bold px-1 cursor-pointer'>+</button>
                    </div>

                    <button onClick={() => deleteCartItem(item._id)} className='text-slate-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer' title="Delete Item">
                      <MdDelete size={22} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className='bg-white p-6 rounded-2xl shadow-sm border h-max flex flex-col gap-4'>
            <h3 className='font-bold text-lg border-b pb-3 text-slate-800'>Order Summary</h3>
            
            <div className='flex justify-between text-sm text-slate-600'>
              <span>Total Items (Quantity):</span>
              <span className='font-semibold text-slate-800'>{totalQty} Pcs</span>
            </div>

            <div className='flex justify-between text-sm text-slate-600'>
              <span>Subtotal:</span>
              <span className='font-semibold text-slate-800'>${subTotal.toFixed(2)}</span>
            </div>

            <div className='flex justify-between text-sm text-slate-600'>
              <span>Shipping Fee:</span>
              <span className='font-semibold text-slate-800'>
                {shippingFee === 0 ? <span className='text-green-600 font-bold'>FREE</span> : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className='flex justify-between font-bold text-lg border-t pt-4 text-slate-800'>
              <span>Total Amount:</span>
              <span className='text-red-600'>${grandTotal.toFixed(2)}</span>
            </div>

            <button onClick={() => navigate('/checkout')} className='w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-full font-semibold shadow-md transition-all cursor-pointer mt-2 text-center'>
              Proceed to Checkout (${grandTotal.toFixed(2)})
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

export default Cart