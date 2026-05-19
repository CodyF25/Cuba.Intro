import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { HashRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import PageNotFound from './lib/PageNotFound'
import { AuthProvider, useAuth } from '@/lib/AuthContext'
import UserNotRegisteredError from '@/components/UserNotRegisteredError'
import Game from '@/pages/Game'
import PasswordPage from '@/pages/PasswordPage'
import AnalyticsDashboard from '@/pages/AnalyticsDashboard'

const SecretLink = () => {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname !== "/") return null

  return (
    <button
      onClick={() => navigate("/password")}
      style={{ position: "fixed", bottom: 16, right: 16, zIndex: 99999 }}
      className="font-mono text-[9px] text-white/10 hover:text-white/20 tracking-wider transition-colors bg-transparent border-none cursor-pointer"
    >
      Cuba Missile Crisis
    </button>
  )
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth()
  const location = useLocation()

  // Always allow the analytics page to load, regardless of auth state
  if (location.pathname === "/analytics") {
    return (
      <Routes>
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Routes>
    )
  }

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />
    } else if (authError.type === 'auth_required') {
      navigateToLogin()
      return null
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Game />} />
      <Route path="/password" element={<PasswordPage />} />
      <Route path="/analytics" element={<AnalyticsDashboard />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
          <SecretLink />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
