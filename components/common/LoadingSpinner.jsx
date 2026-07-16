const LoadingSpinner = ({ size = 'md', className = '' }) => (
  <div className={`spinner spinner-${size} ${className}`} role="status" aria-label="Loading">
    <span className="visually-hidden">Loading...</span>
  </div>
)

export default LoadingSpinner
