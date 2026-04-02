import './styles/WeatherCard.css'

export interface WeatherCardProps {
  city: string
  country: string
  temperature: number
  condition: string
  high: number
  low: number
  timezone: string       // e.g. "GMT +1"
  localTime: string      // e.g. "19:19"
  backgroundImage?: string  // optional city skyline or weather bg
  weatherIcon?: string   // Bootstrap icon class e.g. "bi-sun"
  unit?: 'C' | 'F'
}

const conditionIconMap: Record<string, string> = {
  Sunny: 'bi-sun',
  Cloudy: 'bi-cloud',
  'Partly Cloudy': 'bi-cloud-sun',
  Hazy: 'bi-cloud-haze2',
  Humid: 'bi-droplet',
  Foggy: 'bi-cloud-fog2',
  Clear: 'bi-moon-stars',
  Windy: 'bi-wind',
  Overcast: 'bi-clouds',
  Rainy: 'bi-cloud-rain',
  Stormy: 'bi-cloud-lightning-rain',
  Snowy: 'bi-snow',
}

const WeatherCard = ({
  city = 'Lagos',
  country = 'Nigeria',
  temperature = 28,
  condition = 'Sunny',
  high = 30,
  low = 26,
  timezone = 'GMT +1',
  localTime = '19:19',
  backgroundImage,
  weatherIcon,
//   unit = 'C',
}: WeatherCardProps) => {
  const icon = weatherIcon ?? conditionIconMap[condition] ?? 'bi-cloud'

  return (
    <div
      className="weather-card"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {/* Frosted glass overlay */}
      <div className="weather-card__overlay" />

      {/* Content */}
      <div className="weather-card__content">

        {/* Top row */}
        <div className="weather-card__top">
          <span className="weather-card__label">Today</span>
          <span className="weather-card__timezone">{timezone}</span>
        </div>

        {/* Middle: temp + icon on left, clock on right */}
        <div className="weather-card__middle">
          <div className="weather-card__temp-block">
            <span className="weather-card__temp">
              {temperature}°
            </span>
            <i className={`bi ${icon} weather-card__icon`} />
          </div>
          <div className="weather-card__clock">{localTime}</div>
        </div>

        {/* Bottom row */}
        <div className="weather-card__bottom">
          <div className="weather-card__condition-block">
            <span className="weather-card__condition">{condition}</span>
            <span className="weather-card__range">
              High {high}° &nbsp;·&nbsp; Low {low}°
            </span>
          </div>
          <div className="weather-card__location">
            {city}, {country}
          </div>
        </div>

      </div>
    </div>
  )
}

export default WeatherCard
