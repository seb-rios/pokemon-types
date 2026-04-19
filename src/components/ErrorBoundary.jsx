import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <p className="error-boundary__emoji">⚠️</p>
          <h2 className="error-boundary__title">Something went wrong</h2>
          <p className="error-boundary__desc">An unexpected error occurred.</p>
          <button className="error-boundary__btn" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
