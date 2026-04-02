import Header from "./components/Header"
import WeatherCard from "./components/WeatherCard"
import { WeatherCardSkeleton, WeatherCardError } from "./components/WeatherCardStates"
import { useQuery } from "@tanstack/react-query"

import { fetchWeather, weatherCodeMap } from "./services/weather"
import './App.css'


const cities = [
  { city: 'Lagos',    country: 'Nigeria',   lat: 6.52,  lon: 3.38,   timezone: 'GMT +1' },
  { city: 'London',   country: 'England',   lat: 51.51, lon: -0.13,  timezone: 'GMT +0' },
  { city: 'New York', country: 'USA',       lat: 40.71, lon: -74.01, timezone: 'GMT -5' },
]


// Component that fetches and renders one card
const WeatherCardWrapper = ({ city, country, lat, lon, timezone }: typeof cities[0]) => {
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

  return (
    <>
      <Header />

      <div className="weather-cards">
        {cities.map((c) => (
          <WeatherCardWrapper key={`${c.lat}-${c.lon}`} {...c} />
        ))}
      </div>




    </>
    
  )
}

export default App