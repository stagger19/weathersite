const apiKey = '2029f624de53541daba5041f4e86663e'; // Replace this with your OpenWeatherMap API key

async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
  const [geo] = await geoRes.json();
  const { lat, lon } = geo;

  const res = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
  const data = await res.json();

  // Current Weather
  const current = data.current;
  document.getElementById('currentWeather').innerHTML = `
    <h2>Now in ${city}</h2>
    <div class="card">
      🌡️ ${current.temp}°C - ${current.weather[0].description}<br/>
      💧 Humidity: ${current.humidity}%<br/>
      💨 Wind: ${current.wind_speed} m/s
    </div>
  `;

  // Forecast
  const forecastHTML = data.daily.slice(0, 7).map(day => {
    const date = new Date(day.dt * 1000).toDateString();
    return `
      <div class="card">
        <strong>${date}</strong><br/>
        🌡️ ${day.temp.day}°C<br/>
        🌙 Night: ${day.temp.night}°C<br/>
        🌧️ ${day.weather[0].description}
      </div>
    `;
  }).join('');
  document.getElementById('forecast').innerHTML = `<h2>7-Day Forecast</h2>${forecastHTML}`;

  // Alerts
  const alerts = data.alerts || [];
  document.getElementById('alerts').innerHTML = alerts.length
    ? `<h2>⚠️ Alerts</h2>` + alerts.map(a => `
        <div class="card">
          <strong>${a.event}</strong><br/>
          ${a.description}
        </div>
      `).join('')
    : '';
}

async function getHistory() {
  const city = document.getElementById('cityInput').value;
  const dateInput = document.getElementById('historyDate').value;
  const dt = Math.floor(new Date(dateInput).getTime() / 1000);

  const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
  const [geo] = await geoRes.json();
  const { lat, lon } = geo;

  const histRes = await fetch(`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&units=metric&appid=${apiKey}`);
  const data = await histRes.json();

  const current = data.data[0]; // First hour of data
  document.getElementById('historyWeather').innerHTML = `
    <div class="card">
      Weather on ${new Date(dt * 1000).toDateString()} in ${city}<br/>
      🌡️ Temp: ${current.temp}°C<br/>
      💧 Humidity: ${current.humidity}%<br/>
      💨 Wind: ${current.wind_speed} m/s
    </div>
  `;
}

// Set today's date max for history
document.getElementById("historyDate").max = new Date().toISOString().split("T")[0];
