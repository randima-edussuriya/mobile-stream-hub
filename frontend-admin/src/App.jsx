import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import './App.css'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import StaffManagement from './pages/StaffManagement'
import { createContext } from 'react'
import { PrivateRoute, RoleRoute } from './routes/authRoutes'
import CustomerManagement from './pages/CustomerManagement'
import CategoryManagement from './pages/CategoryManagement'
import ItemManagement from './pages/ItemManagement'
import OrderManagement from './pages/OrderManagement'
import DeliveryManagement from './pages/DeliveryManagement'
import ReorderManagement from './pages/ReorderManagement'
import DayOffManagement from './pages/DayOffManagement'
import LoyaltyProgramManagement from './pages/LoyaltyProgramManagement'
import FeedbackRatingManagement from './pages/FeedbackRatingManagement'
import CustomerSupportManagement from './pages/CustomerSupportManagement'
import ReportsManagement from './pages/ReportsManagement'

function App() {
  const [toggle, setToggle] = useState(false);
  const Toggle = () => {
    setToggle(pre => !pre)
  }

  const { currentUser } = createContext(AudioContext);

  const Layout = () => {
    return (
      <div className='container-fluid bg-dark min-vh-100'>
        <div className='row'>
          {!toggle && <div className='col-4 col-md-3 col-lg-2 bg-primary-subtle'>
            <Sidebar />
          </div>}
          <div className={toggle ? 'col' : 'col-8 col-md-9 col-lg-10'}>
            <Navbar Toggle={Toggle} />
            <Outlet />
          </div>
        </div>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
      errorElement: <div className='text-danger'>Not Found: Invalid URL</div>,
    },
    {
      path: '/',
      element: (
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      ),
      children: [
        {
          path: '/home',
          element: <Home />
        },
        {
          path: '/staff-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <StaffManagement />
            </RoleRoute>
          )
        },
        {
          path: '/customer-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <CustomerManagement />
            </RoleRoute>
          )
        },
        {
          path: '/category-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <CategoryManagement />
            </RoleRoute>
          )
        },
        {
          path: '/item-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <ItemManagement />
            </RoleRoute>
          )
        },
        {
          path: '/order-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <OrderManagement />
            </RoleRoute>
          )
        },
        {
          path: '/delivery-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <DeliveryManagement />
            </RoleRoute>
          )
        },
        {
          path: '/repair-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <ReorderManagement />
            </RoleRoute>
          )
        },
        {
          path: '/reorder-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <ReorderManagement />
            </RoleRoute>
          )
        },
        {
          path: '/day-off-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <DayOffManagement />
            </RoleRoute>
          )
        },
        {
          path: '/loyalty-program-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <LoyaltyProgramManagement />
            </RoleRoute>
          )
        },
        {
          path: '/feedback-rating-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <FeedbackRatingManagement />
            </RoleRoute>
          )
        },
        {
          path: '/customer-support-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <CustomerSupportManagement />
            </RoleRoute>
          )
        },
        {
          path: '/reports-management',
          element: (
            <RoleRoute allowedRoles={['admin']}>
              <ReportsManagement />
            </RoleRoute>
          )
        },
        {
          path: '/unathorized',
          element: <div className='text-bg-danger ps-1'>Access Denied !</div>
        }
      ]
    },

  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App