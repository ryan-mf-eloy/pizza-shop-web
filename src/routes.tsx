import { createBrowserRouter } from 'react-router-dom'

import AppLayout from './pages/_layouts/app'
import AuthLayout from './pages/_layouts/auth'
import Dashboard from './pages/app/dashboard'
import SignIn from './pages/auth/sign-in'
import SignUp from './pages/auth/sign-up'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    /**
     * Authenticated routes
     */
    children: [{ path: '/app', element: <Dashboard /> }],
  },
  {
    path: '/',
    element: <AuthLayout />,
    /**
     * Auth routes
     */
    children: [
      { path: '/sign-in', element: <SignIn /> },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
    ],
  },
])