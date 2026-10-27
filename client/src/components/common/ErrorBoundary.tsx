import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

/**
 * Catches render errors in a page so the header/footer stay alive
 * instead of the whole screen going white. It is re-mounted on every
 * route change (see MainLayout), so going back never needs a reload.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Page crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6">This page could not be displayed. Please try again.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-5 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold"
          >
            Try again
          </button>
          <Link to="/" className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }
}
