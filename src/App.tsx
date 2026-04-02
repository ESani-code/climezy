import Header, {type CitySuggestion } from "./components/Header"
import WeatherCard from "./components/WeatherCard"
import { WeatherCardSkeleton, WeatherCardError } from "./components/WeatherCardStates"
import { useQuery } from "@tanstack/react-query"

import { useState, useEffect } from "react"
import { fetchWeather, weatherCodeMap } from "./services/weather"
import './App.css'

interface CityEntry {
  city: string
  country: string
  lat: number
  lon: number
  timezone: string
}


const DEFAULT_CITIES: CityEntry[] = [
  { city: 'Lagos',    country: 'Nigeria',   lat: 6.52,  lon: 3.38,   timezone: 'GMT +1' },
  { city: 'London',   country: 'England',   lat: 51.51, lon: -0.13,  timezone: 'GMT +0' },
  { city: 'New York', country: 'USA',       lat: 40.71, lon: -74.01, timezone: 'GMT -5' },
]


const STORAGE_KEY = 'climezy_cities'
 
// Load from localStorage, fall back to defaults
const loadCities = (): CityEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as CityEntry[]
  } catch { /* ignore parse errors */ }
  return DEFAULT_CITIES
}
 
// Save to localStorage
const saveCities = (cities: CityEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities))
}
 
// ── WeatherCardWrapper ───────────────────────────────────────────
interface WrapperProps extends CityEntry {
  onRemove: () => void
}


// Component that fetches and renders one card
const WeatherCardWrapper = ({ city, country, lat, lon, timezone, onRemove }: WrapperProps) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => fetchWeather(lat, lon),
    staleTime: 1000 * 10, // cache for 10 seconds
    retry: 2,
  })

  if (isLoading) return <WeatherCardSkeleton />
  if (isError)   return <WeatherCardError city={city} country={country} onRetry={() => refetch()} />

  const temp      = Math.round(data.current.temperature_2m)
  const high      = Math.round(data.daily.temperature_2m_max[0])
  const low       = Math.round(data.daily.temperature_2m_min[0])
  const condition = weatherCodeMap[data.current.weathercode] ?? 'Cloudy'
  const localTime = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: data.timezone,
  })

  return (
    <div className="weather-card-wrapper">
      <WeatherCard
        city={city}
        country={country}
        temperature={temp}
        condition={condition}
        high={high}
        low={low}
        timezone={timezone}
        localTime={localTime}
      />
      <button className="weather-card-remove" onClick={onRemove} title="Remove city">
        <i className="bi bi-x" />
      </button>
    </div>
  )
}





const App = () => {

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ['weather', 'lagos'],
  //   queryFn: () => fetch('https://api.open-meteo.com/v1/forecast?...').then(r => r.json()),
  //   staleTime: 1000 * 30 , // refetch every 30 seconds
  // })

// console.log(data)
// console.log(isLoading)
// console.log(error)





  const [cities, setCities] = useState<CityEntry[]>(loadCities)
 
  // Persist to localStorage whenever cities changes
  useEffect(() => {
    saveCities(cities)
  }, [cities])
 
  // Called when user selects a city from the Header search dropdown
  const handleCitySelect = (suggestion: CitySuggestion) => {
    const already = cities.some(
      c => c.lat === suggestion.latitude && c.lon === suggestion.longitude
    )
    if (already) return
 
    const newCity: CityEntry = {
      city:     suggestion.name,
      country:  suggestion.country,
      lat:      suggestion.latitude,
      lon:      suggestion.longitude,
      timezone: suggestion.timezone,
    }
    setCities(prev => [...prev, newCity])
  }
 
  const handleRemove = (index: number) => {
    setCities(prev => prev.filter((_, i) => i !== index))
  }
  return (
    <>
      <Header onCitySelect={handleCitySelect} />

      <div className="weather-cards">
        {cities.map((c, i) => (
          <WeatherCardWrapper key={`${c.lat}-${c.lon}`} {...c} onRemove={() => handleRemove(i)} />
        ))}
      </div>




    </>
    
  )
}

export default App