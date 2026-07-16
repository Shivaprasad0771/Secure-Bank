const Skeleton = ({ width = '100%', height = '16px', className = '' }) => (
  <div className={`skeleton ${className}`} style={{ width, height }} />
)

export const SkeletonCard = () => (
  <div className="card skeleton-card">
    <Skeleton height="12px" width="40%" />
    <Skeleton height="28px" width="60%" className="mt-2" />
    <Skeleton height="12px" width="80%" className="mt-2" />
  </div>
)

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="skeleton-table">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton-row">
        <Skeleton height="14px" />
      </div>
    ))}
  </div>
)

export default Skeleton
