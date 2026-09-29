import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { DadOnlyRoute } from '@/components/DadOnlyRoute'
import Layout from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthProvider } from '@/contexts/AuthContext'
import { LibraryProvider } from '@/contexts/LibraryContext'
import { ModeProvider } from '@/contexts/ModeContext'
import ChapterPage from '@/pages/ChapterPage'
import ConfirmEmailPage from '@/pages/ConfirmEmailPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import Index from '@/pages/Index'
import LoginPage from '@/pages/LoginPage'
import ManagementPage from '@/pages/ManagementPage'
import NotFound from '@/pages/NotFound'
import PosterPage from '@/pages/PosterPage'
import RewardsPage from '@/pages/RewardsPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import SignupPage from '@/pages/SignupPage'
import VerifyEmailPage from '@/pages/VerifyEmailPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModeProvider>
          <LibraryProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<SignupPage />} />
              <Route path="/verificar-email" element={<VerifyEmailPage />} />
              <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
              <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
              <Route path="/confirmar-email" element={<ConfirmEmailPage />} />

              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Index />} />
                <Route path="/capitulo/:id" element={<ChapterPage />} />
                <Route path="/poster/:id" element={<PosterPage />} />
                <Route path="/quadro/:id" element={<PosterPage />} />
                <Route path="/conquistas" element={<RewardsPage />} />
                <Route path="/recompensas" element={<RewardsPage />} />
                <Route
                  path="/gerenciar"
                  element={
                    <DadOnlyRoute>
                      <ManagementPage />
                    </DadOnlyRoute>
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LibraryProvider>
        </ModeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
