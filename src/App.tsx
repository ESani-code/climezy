import Header from "./components/Header"
import WeatherCard from "./components/WeatherCard"
import './App.css'

const App = () => {
  return (
    <>
      <Header />

      <div className="weather-cards">
        <WeatherCard
          city="Lagos"
          country="Nigeria"
          temperature={28}
          condition="Sunny"
          high={30}
          low={26}
          timezone="GMT +1"
          localTime="19:19"
          backgroundImage="/images/lagos-skyline.jpg"
        />
        <WeatherCard
          city="Lagos"
          country="Nigeria"
          temperature={28}
          condition="Sunny"
          high={30}
          low={26}
          timezone="GMT +1"
          localTime="19:19"
          backgroundImage="/images/lagos-skyline.jpg"
        />
        <WeatherCard
          city="Lagos"
          country="Nigeria"
          temperature={28}
          condition="Sunny"
          high={30}
          low={26}
          timezone="GMT +1"
          localTime="19:19"
          backgroundImage="/images/lagos-skyline.jpg"
        />
        <WeatherCard
          city="Lagos"
          country="Nigeria"
          temperature={28}
          condition="Sunny"
          high={30}
          low={26}
          timezone="GMT +1"
          localTime="19:19"
          backgroundImage="/images/lagos-skyline.jpg"
        />
      </div>



      
    </>
    
  )
}

export default App