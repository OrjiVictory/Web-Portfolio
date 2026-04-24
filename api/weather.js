export default async function handler(req, res) {
  // Allow requests from your own site only
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Atlanta,US&units=imperial&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.message });
    }

    const data = await response.json();

    // Return only what the frontend needs
    res.status(200).json({
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind_speed: Math.round(data.wind.speed),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      city: data.name,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
}
