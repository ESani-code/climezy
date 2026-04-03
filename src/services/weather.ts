// // Maps Open-Meteo numeric codes → your existing condition strings
// export const weatherCodeMap: Record<number, string> = {
//   0: 'Sunny', 
//   1: 'Sunny', 
//   2: 'Partly Cloudy', 
//   3: 'Cloudy',
//   45: 'Foggy', 
//   48: 'Foggy',
//   51: 'Rainy', 
//   61: 'Rainy', 
//   63: 'Rainy', 
//   65: 'Rainy',
//   71: 'Snowy', 
//   73: 'Snowy', 
//   75: 'Snowy',
//   80: 'Rainy', 
//   81: 'Rainy', 
//   82: 'Rainy',
//   95: 'Stormy', 
//   96: 'Stormy', 
//   99: 'Stormy',
// }

// export const fetchWeather = async (lat: number, lon: number) => {
//   const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
  
//   const res = await fetch(url)
//   if (!res.ok) throw new Error('Failed to fetch weather')
//   return res.json()
// }











// Maps Open-Meteo numeric codes → condition strings
export const weatherCodeMap: Record<number, string> = {
  0:  'Sunny',
  1:  'Sunny',
  2:  'Partly Cloudy',
  3:  'Cloudy',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Rainy',
  61: 'Rainy',
  63: 'Rainy',
  65: 'Rainy',
  71: 'Snowy',
  73: 'Snowy',
  75: 'Snowy',
  80: 'Rainy',
  81: 'Rainy',
  82: 'Rainy',
  95: 'Stormy',
  96: 'Stormy',
  99: 'Stormy',
}

export const fetchWeather = async (lat: number, lon: number) => {
  const url = [
    'https://api.open-meteo.com/v1/forecast',
    `?latitude=${lat}&longitude=${lon}`,
    `&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m`,
    `&daily=temperature_2m_max,temperature_2m_min`,
    `&timezone=auto`,
  ].join('')

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch weather')
  return res.json()
}