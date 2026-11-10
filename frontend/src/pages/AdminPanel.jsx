import React from 'react'
import { FaRegUserCircle, FaUsers, FaBoxOpen } from "react-icons/fa"
import { Link, Outlet } from 'react-router-dom'

const AdminPanel = () => {
  return (
    <div className='min-h-[calc(100vh-64px)] flex flex-col md:flex-row mt-16'>
      {/* Sidebar */}
      <aside className='bg-white w-full md:w-64 border-r border-slate-200 p-4 flex flex-col justify-between shadow-sm'>
        <div>
          <div className='h-36 flex flex-col items-center justify-center gap-2 border-b pb-4'>
            <div className='text-5xl text-slate-600'>
              <FaRegUserCircle />
            </div>
            <p className='font-bold text-slate-800'>Tessy Shopping Hub</p>
            <span className='text-xs bg-red-50 text-red-600 px-3 py-0.5 rounded-full font-semibold'>Admin Control</span>
          </div>

          <nav className='grid gap-2 mt-4'>
            <Link 
              to={"all-users"} 
              className='flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-slate-700 font-medium text-sm transition-all'
            >
              <FaUsers className='text-lg' /> All Users
            </Link>
            <Link 
              to={"all-products"} 
              className='flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-slate-700 font-medium text-sm transition-all'
            >
              <FaBoxOpen className='text-lg' /> All Products
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className='w-full p-4 md:p-8 bg-slate-50 overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminPanel