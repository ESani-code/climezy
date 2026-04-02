import { useState, useEffect, useRef } from "react"
import './styles/Header.css'


export interface CitySuggestion {
  id: number
  name: string
  country: string
  country_code: string
  admin1?: string       // state / region
  latitude: number
  longitude: number
  timezone: string
}


interface HeaderProps {
  onCitySelect: (suggestion: CitySuggestion) => void
}


const Header = ({ onCitySelect }: HeaderProps) => {
  const [query, setQuery]             = useState('')
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [isOpen, setIsOpen]           = useState(false)
  const [isLoading, setIsLoading]     = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
 
  const inputRef    = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
 
  // Fetch suggestions from Open-Meteo geocoding API
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }
 
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
        )
        const data = await res.json()
        const results: CitySuggestion[] = data.results ?? []
        setSuggestions(results)
        setIsOpen(results.length > 0)
        setHighlighted(-1)
      } catch {
        setSuggestions([])
        setIsOpen(false)
      } finally {
        setIsLoading(false)
      }
    }, 350)
 
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])
 
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current   && !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
 
  const handleSelect = (city: CitySuggestion) => {
    setQuery(`${city.name}, ${city.country}`)
    setIsOpen(false)
    setSuggestions([])
    onCitySelect?.(city)
    inputRef.current?.blur()
  }
 
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      handleSelect(suggestions[highlighted])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }
 
  return (
    <header className="top-nav">
      <div className="top-nav__inner">
 
        <div className="logo">
          <i className="bi bi-cloud-lightning-rain"></i>
          <span>Climezy</span>
        </div>
 
        {/* Search + dropdown wrapper */}
        <div className="nav-search-wrap">
          <div className={`nav-search ${isOpen ? 'nav-search--open' : ''}`}>
            <form action="" onSubmit={e => e.preventDefault()}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search city or location..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                autoComplete="off"
              />
              {isLoading
                ? <i className="bi bi-arrow-repeat nav-search__spinner" />
                : <i
                    className="bi bi-search"
                    style={{ cursor: 'pointer', color: 'var(--color-text-dim)' }}
                    onClick={() => inputRef.current?.focus()}
                  />
              }
            </form>
          </div>
 
          {isOpen && suggestions.length > 0 && (
            <div className="nav-search__dropdown" ref={dropdownRef}>
              {suggestions.map((city, index) => (
                <div
                  key={city.id}
                  className={`nav-search__suggestion ${highlighted === index ? 'nav-search__suggestion--active' : ''}`}
                  onMouseDown={() => handleSelect(city)}
                  onMouseEnter={() => setHighlighted(index)}
                >
                  <i className="bi bi-geo-alt nav-search__suggestion-icon" />
                  <div className="nav-search__suggestion-text">
                    <span className="nav-search__suggestion-city">{city.name}</span>
                    <span className="nav-search__suggestion-meta">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                  <span className="nav-search__suggestion-code">{city.country_code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
 
        <div className="sign-in-up-btn">
          <button className="btn btn-secondary"><span>Sign Up</span></button>
          <button className="btn btn-primary"><span>Sign In</span></button>
        </div>
 
      </div>
    </header>
  )
}
 
export default Header