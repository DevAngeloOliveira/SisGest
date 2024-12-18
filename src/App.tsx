import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSpinner } from './components/LoadingSpinner'
import { AppProvider } from './providers/AppProvider'
import { InitializationWrapper } from './components/InitializationWrapper'
import { router } from './routes'
import { ToastContainer } from 'react-toastify'
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt'

export function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <InitializationWrapper>
          <AppProvider>
            <RouterProvider router={router} />
            <ToastContainer />
            <PWAUpdatePrompt />
          </AppProvider>
        </InitializationWrapper>
      </Suspense>
    </ErrorBoundary>
  )
}
