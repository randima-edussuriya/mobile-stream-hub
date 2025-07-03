import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/'
import ComingSoon from './pages/ComingSoon'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import Test from './pages/Test'

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <div>Not Found: Invalid URL</div>,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/signup',
          element: <Signup />
        },
        {
          path: '/cart',
          element: <Cart />
        },
        {
          path: '/coming_soon',
          element: <ComingSoon />
        }
      ]
    },
    {
      path: "/test",
      element: <Test />
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App    