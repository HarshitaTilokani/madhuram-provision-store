import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import AnnouncementBar from '../components/layout/AnnouncementBar'
import ErrorBoundary from '../components/common/ErrorBoundary'

export default function MainLayout() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {/* key={pathname} resets the boundary on navigation, so no reload is needed */}
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
