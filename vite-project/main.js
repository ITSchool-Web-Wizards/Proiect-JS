import './style.css'; 
const cityInput = document.querySelector(".city-input"); 
const locationButton = document.querySelector(".location-btn"); 
const searchButton = document.querySelector(".search-btn"); 
const weatherCardsDiv = document.querySelector(".weather-cards"); 
const currentWeatherDiv = document.querySelector(".current-weather"); 
const API_KEY = "9ffdcec4d8b145225eb46b1aef039723"; 

const createWeatherCard = (cityName, weatherItem, index) => { 
    if (index === 0) { 
        return `
            <div class="details">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4>Temperatură : ${Math.round(weatherItem.main.temp - 273.15)}°C </h4>
                <h4>Vânt: ${Math.round(weatherItem.wind.speed * 3.6).toFixed(2)} km/h</h4>
                <h4>Umiditate: ${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>
        `;
    } else { 
        return ` 
            <li class="card"> 
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3> 
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png" alt="weather-icon"> 
                <h4>Temperatură : ${Math.round(weatherItem.main.temp - 273.15)}°C </h4> 
                <h4>Vânt: ${Math.round(weatherItem.wind.speed * 3.6).toFixed(2)} km/h</h4> 
                <h4>Umiditate: ${weatherItem.main.humidity}%</h4> 
            </li>
        `;
    } 
}; 

const getWeatherDetails = (cityName, lat, lon) => { 
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`; 
    fetch(WEATHER_API_URL) 
        .then(res => res.json()) 
        .then(data => { 
            // Ștergere datele meteo anterioare
            weatherCardsDiv.innerHTML = ""; 
            currentWeatherDiv.innerHTML = ""; 
            
            // Filtrare prognoza pentru fiecare zi
            const uniqueForecastDays = []; 
            const fiveDaysForecast = data.list.filter(forecast => { 
                const forecastDate = new Date(forecast.dt_txt).getDate(); 
                if (!uniqueForecastDays.includes(forecastDate)) { 
                    uniqueForecastDays.push(forecastDate); 
                    return true; 
                } 
                return false; 
            }); 
            
            // Afișați carduri meteo

            fiveDaysForecast.forEach((weatherItem, index) => { 
                if (index === 0) { 
                    currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index)); 
                } else { 
                    weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index)); 
                } 
            }); 
        }) 
        .catch(() => { 
            alert("A apărut o eroare la preluarea prognozei meteo"); 
        }); 
}; 

const getCityCoordinates = () => { 
    const cityName = cityInput.value.trim(); 
    if (!cityName) 
        return alert("Te rog sa introduci un oraș :D"); 
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`; 
    fetch(GEOCODING_API_URL) 
        .then(res => res.json()) 
        .then(data => { 
            if (!data.length) 
                return alert(`No coordinates found for ${cityName}`); 
            const { name, lat, lon } = data[0]; 
            getWeatherDetails(name, lat, lon); 
        }) 
        .catch(() => { 
            alert("A apărut o eroare la preluarea coordonatelor!"); 
        }); 
}; 

const getUserCoordinates = () => { 
    navigator.geolocation.getCurrentPosition( 
        position => { 
            const {latitude, longitude} = position.coords; 
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`; 

            //Reverseaza geocodin si preia nume oras din coordonate. 

            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => { 
                const { name} = data[0]; 
                getWeatherDetails(name, latitude, longitude); 
            }) 
            .catch(() => { 
                alert("A apărut o eroare la preluarea orașului!"); 
            }); 
        }, 
        error => { 
            if(error.code === error.PERMISSION_DENIED){ 
                alert("Cererea de acces a geolocatiei nu a fost acceptata. Te rog sa resetezi permisiunile si sa incerci din nou.") 
            } 
        } 
    ); 
} 

locationButton.addEventListener("click", getUserCoordinates); 
searchButton.addEventListener("click", getCityCoordinates);
