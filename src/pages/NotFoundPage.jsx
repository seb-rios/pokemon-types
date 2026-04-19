import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <p className="not-found-page__code">404</p>
      <h1 className="not-found-page__title">Page not found</h1>
      <p className="not-found-page__desc">This route doesn't exist. Maybe a mistyped URL?</p>
      <Link to="/" className="not-found-page__home">Go home</Link>
    </div>
  )
}
