import { useState, useMemo, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchWeather, weatherCodeMap } from '../services/weather'
import useLocalStorage from '../services/useLocalStorage.ts'   

import './styles/WeatherTable.css'

// ── Types ────────────────────────────────────────────────────────

interface CityEntry {
  id: number
  city: string
  country: string
  lat: number
  lon: number
  timezone: string
  favourite: boolean
}

interface LiveWeatherData {
  temp: number
  condition: string
  humidity: number
  wind: string
  localTime: string
}

interface CitySuggestion {
  id: number
  name: string
  country: string
  country_code: string
  admin1?: string
  latitude: number
  longitude: number
  timezone: string
}

type SortKey = 'id' | 'city' | 'country' | 'temp' | 'condition' | 'humidity' | 'localTime'
type SortDir = 'asc' | 'desc'
type TabView = 'all' | 'favourites'

// ── Initial cities ───────────────────────────────────────────────

const INITIAL_CITIES: CityEntry[] = [
  { id: 1,  city: 'Lagos',        country: 'Nigeria',     lat: 6.52,   lon: 3.38,    timezone: 'Africa/Lagos',      favourite: true  },
  { id: 2,  city: 'Beijing',      country: 'China',       lat: 39.91,  lon: 116.39,  timezone: 'Asia/Shanghai',     favourite: false },
  { id: 3,  city: 'Buenos Aires', country: 'Argentina',   lat: -34.61, lon: -58.37,  timezone: 'America/Argentina/Buenos_Aires', favourite: true  },
  { id: 4,  city: 'Delhi',        country: 'India',       lat: 28.66,  lon: 77.23,   timezone: 'Asia/Kolkata',      favourite: true  },
  { id: 5,  city: 'Manila',       country: 'Philippines', lat: 14.60,  lon: 120.98,  timezone: 'Asia/Manila',       favourite: false },
  { id: 6,  city: 'Shanghai',     country: 'China',       lat: 31.17,  lon: 121.47,  timezone: 'Asia/Shanghai',     favourite: true  },
  { id: 7,  city: 'Tokyo',        country: 'Japan',       lat: 35.69,  lon: 139.69,  timezone: 'Asia/Tokyo',        favourite: true  },
  { id: 8,  city: 'Istanbul',     country: 'Turkey',      lat: 41.01,  lon: 28.96,   timezone: 'Europe/Istanbul',   favourite: false },
  { id: 9,  city: 'Bangkok',      country: 'Thailand',    lat: 13.75,  lon: 100.52,  timezone: 'Asia/Bangkok',      favourite: false },
  { id: 10, city: 'Barcelona',    country: 'Spain',       lat: 41.39,  lon: 2.15,    timezone: 'Europe/Madrid',     favourite: true  },
  { id: 11, city: 'Berlin',       country: 'Germany',     lat: 52.52,  lon: 13.40,   timezone: 'Europe/Berlin',     favourite: true  },
  { id: 12, city: 'Cairo',        country: 'Egypt',       lat: 30.06,  lon: 31.25,   timezone: 'Africa/Cairo',      favourite: true  },
  { id: 13, city: 'Mexico City',  country: 'Mexico',      lat: 19.43,  lon: -99.13,  timezone: 'America/Mexico_City', favourite: false },
  { id: 14, city: 'Moscow',       country: 'Russia',      lat: 55.75,  lon: 37.62,   timezone: 'Europe/Moscow',     favourite: false },
  { id: 15, city: 'Nairobi',      country: 'Kenya',       lat: -1.28,  lon: 36.82,   timezone: 'Africa/Nairobi',    favourite: true  },
]

// Condition accent colours
const conditionAccent: Record<string, string> = {
  'Sunny':        'var(--color-sunny)',
  'Clear':        'var(--color-sunny)',
  'Partly Cloudy':'var(--color-cloudy)',
  'Cloudy':       'var(--color-cloudy)',
  'Overcast':     'var(--color-cloudy)',
  'Hazy':         'var(--color-cloudy)',
  'Foggy':        'var(--color-cloudy)',
  'Humid':        'var(--color-rainy)',
  'Rainy':        'var(--color-rainy)',
  'Windy':        'var(--color-rainy)',
  'Stormy':       'var(--color-rainy)',
  'Snowy':        '#e0f2fe',
}

const conditionIcons: Record<string, string> = {
  'Sunny':        '☀️',
  'Clear':        '☀️',
  'Partly Cloudy':'🌤️',
  'Cloudy':       '☁️',
  'Overcast':     '☁️',
  'Hazy':         '🌫️',
  'Foggy':        '🌫️',
  'Humid':        '💧',
  'Rainy':        '🌧️',
  'Windy':        '💨',
  'Stormy':       '⛈️',
  'Snowy':        '❄️',
}

// ── Add City Search ──────────────────────────────────────────────

interface AddCitySearchProps {
  onSelect: (suggestion: CitySuggestion) => void
  onCancel: () => void
}

const AddCitySearch = ({ onSelect, onCancel }: AddCitySearchProps) => {
  const [query, setQuery]             = useState('')
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [isLoading, setIsLoading]     = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const inputRef    = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (query.trim().length < 2) { setSuggestions([]); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res  = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`)
        const data = await res.json()
        setSuggestions(data.results ?? [])
        setHighlighted(-1)
      } catch { setSuggestions([]) }
      finally  { setIsLoading(false) }
    }, 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setHighlighted(h => Math.min(h + 1, suggestions.length - 1)) }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setHighlighted(h => Math.max(h - 1, -1)) }
    if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); onSelect(suggestions[highlighted]) }
    if (e.key === 'Escape')     onCancel()
  }

  return (
    <div className="wt__add-search">
      <div className="wt__add-search__input-row">
        <div className="wt__add-search__input-wrap">
          {isLoading
            ? <i className="bi bi-arrow-repeat wt__add-search__spinner" />
            : <i className="bi bi-search wt__add-search__search-icon" />
          }
          <input
            ref={inputRef}
            className="wt__add-search__input"
            type="text"
            placeholder="Search for a city or location..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {query && (
            <button className="wt__add-search__clear" onClick={() => setQuery('')}>
              <i className="bi bi-x" />
            </button>
          )}
        </div>
        <button className="btn btn-secondary wt__add-search__cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="wt__add-search__dropdown">
          {suggestions.map((s, i) => (
            <div
              key={s.id}
              className={`wt__add-search__suggestion ${highlighted === i ? 'wt__add-search__suggestion--active' : ''}`}
              onMouseDown={() => onSelect(s)}
              onMouseEnter={() => setHighlighted(i)}
            >
              <i className="bi bi-geo-alt wt__add-search__geo-icon" />
              <div className="wt__add-search__suggestion-text">
                <span className="wt__add-search__suggestion-name">{s.name}</span>
                <span className="wt__add-search__suggestion-meta">
                  {[s.admin1, s.country].filter(Boolean).join(', ')}
                </span>
              </div>
              <span className="wt__add-search__suggestion-code">{s.country_code}</span>
            </div>
          ))}
        </div>
      )}

      {query.length >= 2 && !isLoading && suggestions.length === 0 && (
        <div className="wt__add-search__no-results">
          <i className="bi bi-search" /> No locations found for "{query}"
        </div>
      )}
    </div>
  )
}

// ── Single live row ──────────────────────────────────────────────

interface WeatherRowProps {
  entry: CityEntry
  index: number
  isSelected: boolean
  onToggleSelect: () => void
  onToggleFavourite: () => void
  sortedData: LiveWeatherData | null
}

const useWeatherRow = (lat: number, lon: number) => {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => fetchWeather(lat, lon),
    staleTime: 1000 * 60 * 10,
    retry: 2,
  })
}

const WeatherRow = ({ entry, index, isSelected, onToggleSelect, onToggleFavourite }: WeatherRowProps) => {
  const { data, isLoading, isError } = useWeatherRow(entry.lat, entry.lon)

  let live: LiveWeatherData | null = null
  if (data) {
    const condition = weatherCodeMap[data.current.weathercode] ?? 'Cloudy'
    const windSpeed = Math.round(data.current.windspeed_10m)
    const localTime = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit', timeZone: data.timezone ?? entry.timezone,
    })
    live = {
      temp:      Math.round(data.current.temperature_2m),
      condition,
      humidity:  data.current.relative_humidity_2m ?? 0,
      wind:      `${windSpeed} mph`,
      localTime,
    }
  }

  const accent = live ? (conditionAccent[live.condition] ?? 'var(--color-text-secondary)') : 'var(--color-surface-border)'

  return (
    <tr
      className={`wt__row ${isSelected ? 'wt__row--selected' : ''} ${isLoading ? 'wt__row--loading' : ''}`}
      style={{ animationDelay: `${index * 25}ms` }}
      onClick={onToggleSelect}
    >
      {/* Checkbox */}
      <td className="wt__td wt__td--check" onClick={e => e.stopPropagation()}>
        <input type="checkbox" className="wt__checkbox" checked={isSelected} onChange={onToggleSelect} />
      </td>

      {/* # */}
      <td className="wt__td wt__td--dim">{entry.id}</td>

      {/* City */}
      <td className="wt__td wt__td--city">{entry.city}</td>

      {/* Country */}
      <td className="wt__td wt__td--dim">{entry.country}</td>

      {/* Temp */}
      <td className="wt__td wt__td--temp">
        {isLoading ? <span className="wt__cell-shimmer wt__cell-shimmer--sm" /> :
         isError   ? <span className="wt__cell-error">—</span> :
                     `${live!.temp}°C`}
      </td>

      {/* Condition */}
      <td className="wt__td">
        {isLoading ? <span className="wt__cell-shimmer wt__cell-shimmer--md" /> :
         isError   ? <span className="wt__cell-error">Unavailable</span> :
          <span className="wt__condition-pill" style={{ color: accent, borderColor: `${accent}40`, backgroundColor: `${accent}14` }}>
            {conditionIcons[live!.condition]}{live!.condition}
          </span>
        }
      </td>

      {/* Humidity */}
      <td className="wt__td wt__hide-on-mobile">
        {isLoading ? <span className="wt__cell-shimmer wt__cell-shimmer--sm" /> :
         isError   ? <span className="wt__cell-error">—</span> :
          <div className="wt__humidity-wrap">
            <span>{live!.humidity}%</span>
            <i className="bi bi-droplet-fill"></i>
            {/* <div className="wt__humidity-bar">
              <div className="wt__humidity-fill" style={{ width: `${live!.humidity}%` }} />
            </div> */}
          </div>
        }
      </td>

      {/* Wind */}
      <td className="wt__td wt__td--dim wt__hide-on-mobile">
        {isLoading ? <span className="wt__cell-shimmer wt__cell-shimmer--md" /> :
         isError   ? <span className="wt__cell-error">—</span> :
          <span className="wt__td--wind"><i className="bi bi-wind wt__wind-icon" />{live!.wind}</span>
        }
      </td>

      {/* Local time */}
      <td className="wt__td wt__td--time wt__hide-on-mobile">
        {isLoading ? <span className="wt__cell-shimmer wt__cell-shimmer--sm" /> :
         isError   ? <span className="wt__cell-error">—</span> :
                     live!.localTime}
      </td>

      {/* Favourite */}
      <td className="wt__td wt__td--centre" onClick={e => e.stopPropagation()}>
        <button
          className={`wt__star ${entry.favourite ? 'wt__star--filled' : ''}`}
          onClick={onToggleFavourite}
          title={entry.favourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          <i className={`bi ${entry.favourite ? 'bi-star-fill' : 'bi-star'}`} />
        </button>
      </td>
    </tr>
  )
}

// ── WeatherTable ─────────────────────────────────────────────────

const WeatherTable = () => {
    // Automatically saves cities (including their favourite status) to storage
  const [cities, setCities] = useLocalStorage<CityEntry[]>('wt_cities', INITIAL_CITIES)
  
  // Optional: Save the table state so the user returns to the exact view they left
  const [tab, setTab] = useLocalStorage<TabView>('wt_tab', 'all')
  const [sortKey, setSortKey] = useLocalStorage<SortKey>('wt_sort_key', 'id')
  const [sortDir, setSortDir] = useLocalStorage<SortDir>('wt_sort_dir', 'asc')
  
  // Keep selected and showAdd as normal useState (usually you don't want to save selection state across reloads)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [showAdd, setShowAdd]   = useState(false)

  // ── Sorting ──────────────────────────────────────────────────
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return <i className="bi bi-chevron-expand wt__sort-icon wt__sort-icon--inactive" />
    return sortDir === 'asc'
      ? <i className="bi bi-chevron-up wt__sort-icon wt__sort-icon--active" />
      : <i className="bi bi-chevron-down wt__sort-icon wt__sort-icon--active" />
  }

  // ── Filtered + sorted entries (city meta only, no live data needed here) ──
  const visibleCities = useMemo(() => {
    const base = tab === 'favourites' ? cities.filter(c => c.favourite) : cities
    return [...base].sort((a, b) => {
      const av = a[sortKey as keyof CityEntry]
      const bv = b[sortKey as keyof CityEntry]
      if (av === undefined || bv === undefined) return 0
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [cities, tab, sortKey, sortDir])

  // ── Selection ────────────────────────────────────────────────
  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const nextSelected = new Set(prev)
      if (nextSelected.has(id)) {
        nextSelected.delete(id)
      } else {
        nextSelected.add(id)
      }
      return nextSelected
    })
  }

  const toggleSelectAll = () => {
    const ids = visibleCities.map(c => c.id)
    const allOn = ids.every(id => selected.has(id))
    setSelected(prev => {
      const n = new Set(prev)
      if (allOn) {
        ids.forEach(id => n.delete(id))
      } else {
        ids.forEach(id => n.add(id))
      }
      return n
    })
  }

  // ── Add city from geocoding suggestion ───────────────────────
  const handleCitySelect = (s: CitySuggestion) => {
    const already = cities.some(c => c.lat === s.latitude && c.lon === s.longitude)
    if (!already) {
      const nextId = cities.length > 0 ? Math.max(...cities.map(c => c.id)) + 1 : 1
      setCities(prev => [...prev, {
        id:        nextId,
        city:      s.name,
        country:   s.country,
        lat:       s.latitude,
        lon:       s.longitude,
        timezone:  s.timezone,
        favourite: false,
      }])
    }
    setShowAdd(false)
  }

  // ── Remove selected ──────────────────────────────────────────
const handleRemove = () => {
    if (selected.size === 0) return
    
    setCities(prev => {
      // 1. Filter out the selected cities
      const remainingCities = prev.filter(c => !selected.has(c.id))
      
      // 2. Re-index the remaining cities sequentially
      return remainingCities.map((city, index) => ({
        ...city,
        id: index + 1 // Reassigns IDs to 1, 2, 3, 4...
      }))
    })
    
    // Clear the selection state
    setSelected(new Set())
  }
  // ── Toggle favourite ─────────────────────────────────────────
  const toggleFavourite = (id: number) => {
    setCities(prev => prev.map(c => c.id === id ? { ...c, favourite: !c.favourite } : c))
  }

  const allVisibleSelected = visibleCities.length > 0 && visibleCities.every(c => selected.has(c.id))
  const favouriteCount     = cities.filter(c => c.favourite).length

  return (
    <section className="wt__section">

      <h2 className="wt__heading">Weather Forecast</h2>

      {/* Toolbar */}
      <div className="wt__toolbar">
        <div className="wt__tabs">
          <button className={`wt__tab ${tab === 'all' ? 'wt__tab--active' : ''}`} onClick={() => setTab('all')}>
            All
          </button>
          <button className={`wt__tab ${tab === 'favourites' ? 'wt__tab--active' : ''}`} onClick={() => setTab('favourites')}>
            Favourites
            {favouriteCount > 0 && <span className="wt__tab-badge">{favouriteCount}</span>}
          </button>
        </div>

        <div className="wt__actions">
          <button className="btn btn-secondary wt__action-btn" onClick={() => setShowAdd(v => !v)}>
            <i className={`bi ${showAdd ? 'bi-x-circle' : 'bi-plus-circle'}`} />
            <span>{showAdd ? 'Close' : 'Add'}</span>
          </button>
          <button
            className={`btn btn-secondary wt__action-btn wt__action-btn--remove ${selected.size > 0 ? 'wt__action-btn--remove-active' : ''}`}
            onClick={handleRemove}
            disabled={selected.size === 0}
          >
            <i className="bi bi-dash-circle" />
            <span>Remove{selected.size > 0 ? ` (${selected.size})` : ''}</span>
          </button>
        </div>
      </div>

      {/* Add city search panel */}
      {showAdd && (
        <AddCitySearch
          onSelect={handleCitySelect}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {/* Table */}
      <div className="wt__container">
        <table className="wt__table">
          <thead>
            <tr>
              <th className="wt__th wt__th--check">
                <input type="checkbox" className="wt__checkbox" checked={allVisibleSelected} onChange={toggleSelectAll} />
              </th>
              <th className="wt__th wt__th--sortable" onClick={() => handleSort('id')}># {sortIcon('id')}</th>
              <th className="wt__th wt__th--sortable" onClick={() => handleSort('city')}>City {sortIcon('city')}</th>
              <th className="wt__th wt__th--sortable" onClick={() => handleSort('country')}>Country {sortIcon('country')}</th>
              <th className="wt__th wt__th--sortable" onClick={() => handleSort('temp')}>Temp. {sortIcon('temp')}</th>
              <th className="wt__th wt__th--sortable" onClick={() => handleSort('condition')}>Condition {sortIcon('condition')}</th>
              <th className="wt__th wt__th--sortable wt__hide-on-mobile" onClick={() => handleSort('humidity')}>Humidity {sortIcon('humidity')}</th>
              <th className="wt__th wt__hide-on-mobile">Wind</th>
              <th className="wt__th wt__th--sortable wt__hide-on-mobile" onClick={() => handleSort('localTime')}>Local Time {sortIcon('localTime')}</th>
              <th className="wt__th wt__th--centre">Favourite</th>
            </tr>
          </thead>
          <tbody>
            {visibleCities.length === 0 ? (
              <tr>
                <td colSpan={10} className="wt__empty">
                  <i className="bi bi-star wt__empty-icon" />
                  <span>No favourites yet — click a ☆ to add one</span>
                </td>
              </tr>
            ) : (
              visibleCities.map((city, idx) => (
                <WeatherRow
                  key={`${city.lat}-${city.lon}`}
                  entry={city}
                  index={idx}
                  isSelected={selected.has(city.id)}
                  onToggleSelect={() => toggleSelect(city.id)}
                  onToggleFavourite={() => toggleFavourite(city.id)}
                  sortedData={null}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer
      <div className="wt__footer">
        <span>{visibleCities.length} {visibleCities.length === 1 ? 'city' : 'cities'}</span>
        {selected.size > 0 && <span className="wt__footer-selected">{selected.size} selected</span>}
      </div> */}

    </section>
  )
}

export default WeatherTable