const apiKey = "i0SKXjvkkjWYoDDNvoaQwCgsmU8ZDtq7"; // Replace with your real API key

async function getWeather() {
  const city = document.getElementById("city").value;
  const url = `https://api.tomorrow.io/v4/weather/realtime?location=${encodeURIComponent(city)}&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const weather = data.data.values;
    const result = `
      <h2>📍 ${city}</h2>
      <p>🌡️ Temperature: ${weather.temperature}°F</p>
      <p>💧 Humidity: ${weather.humidity}%</p>
      <p>💨 Wind Speed: ${weather.windSpeed} m/P/H</p>
    `;
    document.getElementById("weather-result").innerHTML = result;
  } catch (err) {
    console.error(err);
    document.getElementById("weather-result").innerHTML = "<p>Error retrieving weather data.</p>";
  }
}
