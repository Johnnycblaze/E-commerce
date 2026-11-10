import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MdModeEdit } from 'react-icons/md'

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllUsers = async () => {
    try {
      setLoading(true)
      // Corrected URL matching backend router mount point: /api/all-users
      const response = await fetch("http://localhost:8000/api/all-users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      const data = await response.json()
      if (data.success) {
        setAllUsers(data.data || [])
      } else {
        toast.error(data.message || "Failed to load users")
      }
    } catch (error) {
      console.error("Fetch Users Error:", error)
      toast.error("Failed to connect to backend server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])

  if (loading) return <div className='py-12 text-center text-slate-500'>Loading users...</div>

  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm border'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-bold text-slate-800'>All Users Management</h2>
        <span className='text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-semibold'>Total: {allUsers.length}</span>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='border-b text-xs uppercase text-slate-400'>
              <th className='py-3 px-4'>Sr.</th>
              <th className='py-3 px-4'>Name</th>
              <th className='py-3 px-4'>Email</th>
              <th className='py-3 px-4'>Role</th>
              <th className='py-3 px-4'>Action</th>
            </tr>
          </thead>
          <tbody className='text-sm text-slate-600'>
            {allUsers.length === 0 ? (
              <tr>
                <td colSpan='5' className='text-center py-8 text-slate-400'>No users found in database.</td>
              </tr>
            ) : (
              allUsers.map((user, index) => (
                <tr key={user._id} className='border-b hover:bg-slate-50'>
                  <td className='py-3 px-4'>{index + 1}</td>
                  <td className='py-3 px-4 font-medium text-slate-800'>{user.name}</td>
                  <td className='py-3 px-4'>{user.email}</td>
                  <td className='py-3 px-4'>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                      {user.role || 'GENERAL'}
                    </span>
                  </td>
                  <td className='py-3 px-4'>
                    <button className='p-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer'>
                      <MdModeEdit size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllUsers