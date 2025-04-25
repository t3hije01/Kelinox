async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) return;
  
    try {
      // Haetaan koordinaatit Open Meteo -geokoodaus API:sta
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
      const geoData = await geoRes.json();
  
      if (!geoData.results || geoData.results.length === 0) {
        document.getElementById('weatherOutput').innerText = 'City not found.';
        return;
      }
  
      const { latitude, longitude, name, country } = geoData.results[0];
  
      
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const weatherData = await weatherRes.json();
  
      const { temperature, windspeed, weathercode } = weatherData.current_weather;
      const icon = getWeatherIcon(weathercode);
      const advice = getClothingAdvice(temperature, weathercode);
  
      document.getElementById('weatherOutput').innerHTML = `
        <p><strong>${name}, ${country}</strong></p>
        <div class="weather-icon">${icon}</div>
        <p>${temperature}°C, wind: ${windspeed} km/h</p>
        <p><em>${advice}</em></p>
      `;
    } catch (error) {
      console.error(error);
      document.getElementById('weatherOutput').innerText = 'Error fetching data.';
    }
  }
  
  function getClothingAdvice(temp, weathercode) {
    const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82];
    if (rainCodes.includes(weathercode)) return "Take an umbrella and wear waterproof clothing.";
    if (temp < 0) return "Wear a winter coat, gloves, and hat.";
    if (temp < 10) return "Wear a warm jacket.";
    if (temp < 20) return "Light jacket or hoodie recommended.";
    return "T-shirt and shorts should be fine.";
  }
  
  function getWeatherIcon(code) {
    const icons = {
      0: "☀️",     
      1: "🌤",     
      2: "⛅️",    
      3: "☁️",     
      45: "🌫",    
      48: "🌫",    
      51: "🌦",    
      61: "🌧",    
      71: "🌨",    
      80: "🌦",    
      95: "⛈",    
    };
    return icons[code] || "❓";
  }
  