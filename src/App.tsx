import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { NotificationProvider } from './providers/NotificationProvider'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './features/auth/contexts/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
