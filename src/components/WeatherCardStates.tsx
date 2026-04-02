import './styles/WeatherCardStates.css'
 
// ── Skeleton / Loading State ──────────────────────────────────────────────────
export const WeatherCardSkeleton = () => {
  return (
    <div className="weather-card-skeleton">
      <div className="wcs__overlay" />
 
      {/* Animated shimmer lines mirroring WeatherCard layout */}
      <div className="wcs__content">
 
        {/* Top row */}
        <div className="wcs__top">
          <div className="wcs__shimmer wcs__shimmer--label" />
          <div className="wcs__shimmer wcs__shimmer--timezone" />
        </div>
 
        {/* Middle row */}
        <div className="wcs__middle">
          <div className="wcs__temp-block">
            <div className="wcs__shimmer wcs__shimmer--temp" />
            <div className="wcs__shimmer wcs__shimmer--icon" />
          </div>
          <div className="wcs__shimmer wcs__shimmer--clock" />
        </div>
 
        {/* Pulse orb — visual interest while waiting */}
        <div className="wcs__pulse-orb" />
 
        {/* Bottom row */}
        <div className="wcs__bottom">
          <div className="wcs__condition-block">
            <div className="wcs__shimmer wcs__shimmer--condition" />
            <div className="wcs__shimmer wcs__shimmer--range" />
          </div>
          <div className="wcs__shimmer wcs__shimmer--location" />
        </div>
 
      </div>
    </div>
  )
}
 
// ── Error State ───────────────────────────────────────────────────────────────
interface WeatherCardErrorProps {
  city?: string
  country?: string
  onRetry?: () => void
}
 
export const WeatherCardError = ({
  city = 'Unknown',
  country = '',
  onRetry,
}: WeatherCardErrorProps) => {
  return (
    <div className="weather-card-error">
      <div className="wce__overlay" />
 
      <div className="wce__content">
 
        {/* Top row */}
        <div className="wce__top">
          <span className="wce__label">Today</span>
          <span className="wce__location">{city}{country ? `, ${country}` : ''}</span>
        </div>
 
        {/* Icon + message */}
        <div className="wce__body">
          <div className="wce__icon-wrap">
            <i className="bi bi-cloud-slash wce__icon" />
            <div className="wce__icon-ring" />
          </div>
          <p className="wce__message">Weather data unavailable</p>
          <p className="wce__sub">Could not reach the forecast service</p>
        </div>
 
        {/* Retry */}
        {onRetry && (
          <div className="wce__bottom">
            <button className="wce__retry-btn" onClick={onRetry}>
              <i className="bi bi-arrow-clockwise" />
              <span>Retry</span>
            </button>
          </div>
        )}
 
      </div>
    </div>
  )
}