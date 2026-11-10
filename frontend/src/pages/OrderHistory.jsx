import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/order-history", {
        method: "GET",
        credentials: "include"
      })
      const data = await response.json()
      if (data.success) {
        setOrders(data.data || [])
      } else {
        toast.error(data.message || "Failed to fetch orders")
      }
    } catch (err) {
      console.error("Order history error:", err)
      toast.error("Something went wrong connecting to the server.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return <div className='py-20 text-center text-slate-500 mt-16'>Loading order history...</div>
  }

  return (
    <div className='container mx-auto px-4 py-8 mt-16 max-w-4xl'>
      <h2 className='text-2xl font-bold mb-6 text-slate-800'>My Order History</h2>

      {orders.length === 0 ? (
        <div className='bg-white p-12 rounded-2xl shadow-sm border text-center'>
          <p className='text-slate-500 text-lg'>You have no order history yet.</p>
        </div>
      ) : (
        <div className='flex flex-col gap-6'>
          {orders.map((order) => {
            const dateStr = order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"
            const totalAmount = Number(order?.totalAmount ?? order?.amount ?? order?.total ?? 0)
            
            // Get products list and calculate total quantity for fallback pricing
            const productsList = order?.productDetails || order?.items || order?.products || []
            const totalQty = productsList.reduce((sum, i) => sum + Number(i?.quantity ?? i?.qty ?? 1), 0)

            return (
              <div key={order._id} className='bg-white border rounded-2xl shadow-sm p-6 flex flex-col gap-4'>
                
                {/* Order Top Header */}
                <div className='flex flex-wrap items-center justify-between border-b pb-4 text-sm'>
                  <div>
                    <span className='font-semibold text-slate-500'>Order ID: </span>
                    <span className='font-mono text-slate-800'>{order._id}</span>
                  </div>
                  <div className='flex items-center gap-4'>
                    <span className='text-slate-500'>Date: {dateStr}</span>
                    <span className='bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full text-xs uppercase'>
                      {order?.paymentStatus || order?.status || "Confirmed"}
                    </span>
                  </div>
                </div>

                {/* Order Items List */}
                <div className='flex flex-col gap-4'>
                  {productsList.map((item, index) => {
                    const quantity = Number(item?.quantity ?? item?.qty ?? 1)
                    
                    // Check every possible price field
                    let itemPrice = Number(
                      item?.sellingPrice ?? 
                      item?.price ?? 
                      item?.productPrice ??
                      item?.unitPrice ??
                      item?.amount ??
                      item?.productId?.sellingPrice ?? 
                      item?.productId?.price ?? 
                      item?.productId?.productPrice ??
                      0
                    )

                    // Fallback: Derive unit price from totalAmount if itemPrice is missing/zero
                    if (itemPrice === 0 && totalAmount > 0 && totalQty > 0) {
                      itemPrice = totalAmount / totalQty
                    }

                    const itemName = item?.productName || item?.name || item?.productId?.productName || item?.productId?.name || "Product"
                    const itemImage = item?.productImage?.[0] || item?.image || item?.productId?.productImage?.[0] || "https://via.placeholder.com/150"

                    return (
                      <div key={index} className='flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0'>
                        <div className='flex items-center gap-4'>
                          <div className='w-16 h-16 bg-slate-50 border rounded-xl p-1 flex items-center justify-center shrink-0'>
                            <img src={itemImage} alt={itemName} className='w-full h-full object-contain mix-blend-multiply' />
                          </div>
                          <div>
                            <h4 className='font-semibold text-slate-800 text-sm md:text-base'>{itemName}</h4>
                            <p className='text-xs text-slate-500 mt-0.5'>
                              Qty: {quantity} | <span className='text-slate-700 font-medium'>${itemPrice.toFixed(2)} each</span>
                            </p>
                          </div>
                        </div>
                        <div className='text-right font-bold text-red-600'>
                          ${(itemPrice * quantity).toFixed(2)}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Shipping & Total Footer */}
                <div className='border-t pt-4 flex flex-wrap items-center justify-between text-sm'>
                  <div>
                    <p className='font-semibold text-slate-700 mb-0.5'>Shipping Address:</p>
                    <p className='text-slate-500 text-xs'>
                      {order?.shippingAddress ? 
                        `${order.shippingAddress.name || order.shippingAddress.fullName || ''}, ${order.shippingAddress.street || order.shippingAddress.address || ''}, ${order.shippingAddress.city || ''} - ${order.shippingAddress.pincode || order.shippingAddress.zip || ''}` : 
                        "Standard Delivery"}
                    </p>
                  </div>
                  <div className='text-right mt-2 sm:mt-0'>
                    <span className='text-slate-500 text-xs block'>Total Paid</span>
                    <span className='text-xl font-extrabold text-red-600'>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderHistory