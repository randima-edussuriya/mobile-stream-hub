import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import ComingSoon from './pages/ComingSoon'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import { Container } from 'react-bootstrap'
import Home from './pages/Home'

const Layout = () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <div className='flex-grow-1'>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

function App() {
  const router = createBrowserRouter([
    {
      path: '',
      element: <Layout />,
      errorElement: <div>Not Found: Invalid URL</div>,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'signup',
          element: <Signup />
        },
        {
          path: 'cart',
          element: <Cart />
        },
        {
          path: 'coming_soon',
          element: <ComingSoon />
        }
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App    