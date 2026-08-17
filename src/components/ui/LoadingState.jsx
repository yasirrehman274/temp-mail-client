function LoadingState({ variant = 'list' }) {
  if (variant === 'address') {
    return (
      <div className="skeleton-address" aria-busy="true" aria-label="Loading email address">
        <div className="skeleton skeleton-block" />
        <div className="skeleton skeleton-btn" />
      </div>
    )
  }

  if (variant === 'detail') {
    return (
      <div className="skeleton-detail" aria-busy="true" aria-label="Loading email">
        <div className="skeleton skeleton-block" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-block" />
      </div>
    )
  }

  return (
    <ul className="skeleton-list" aria-busy="true" aria-label="Loading inbox">
      {[0, 1, 2].map((item) => (
        <li className="skeleton-row" key={item}>
          <div className="skeleton skeleton-avatar" />
          <div className="skeleton-lines">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default LoadingState
