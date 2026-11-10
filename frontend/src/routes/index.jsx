import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassword from '../pages/ForgotPassword'
import SignUp from '../pages/SignUp'
import AdminPanel from '../pages/AdminPanel'
import AllUsers from '../pages/AllUsers'
import AllProducts from '../pages/AllProducts'
import UploadProduct from '../pages/UploadProduct' // 1. Import your UploadProduct component (adjust filename if yours is named differently)
import CategoryProduct from '../pages/CategoryProduct'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import OrderHistory from '../pages/OrderHistory'
import SearchProduct from '../pages/SearchProduct'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "product-category/:categoryName", element: <CategoryProduct /> },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "order-history", element: <OrderHistory /> },
      { path: "search", element: <SearchProduct /> },
      {
        path: "admin-panel",
        element: <AdminPanel />,
        children: [
          { path: "all-users", element: <AllUsers /> },
          { path: "all-products", element: <AllProducts /> },
          { path: "upload-product", element: <UploadProduct /> } // 2. Add upload-product child route here
        ]
      }
    ]
  }
])

export default router