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

function App() {
  const [toggle, setToggle] = useState(true);
  const Toggle = () => {
    setToggle(pre => !pre)
  }

  const { currentUser } = createContext(AudioContext);

  const Layout = () => {
    return (
      <div className='container-fluid bg-dark min-vh-100'>
        <div className='row'>
          {toggle && <div className='col-4 col-md-3 col-lg-2 bg-primary-subtle'>
            <Sidebar />
          </div>}
          <div className='col'>
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