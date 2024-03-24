const cityInput = document.querySelector(".cityName");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const weatherCards = document.querySelector(".weather-cards");
const CurrentWeatherCard = document.querySelector(".current-weather");





const apiKey = 'cb402bf835f77b77fcfb459f65b81af2' //Api kalit OpenWeatherMap


const createWeatherCard = (cityName, weatherItem, index) => {  
    if (index === 0) {
        return `<div class="details">
                    <h3>Mamlakat (Viloyat) nomi:${cityName}</h3>
                    <h4>Sana:(${weatherItem.dt_txt.split(" ")[0]})</h4>
                    <h4>Harorat:${(weatherItem.main.temp - 273.15).toFixed(2)}°С</h4>
                    <h4>Shamol:${(weatherItem.wind.speed)} m/s</h4>
                    <h4>Namlik:${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`
        
    } else {
        
        return `<li class="card">
                        <h3>Sana:(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png">
                        <h4>Harorat:${(weatherItem.main.temp - 273.15).toFixed(2)}°С</h4>
                         <h4>Shamol:${(weatherItem.wind.speed)} m/s</h4>
                        <h4>Namlik:${weatherItem.main.humidity}%</h4>
                </li>`
    }
    }



const getWeatherDetails = (cityName, lat, lon) => {
    
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    fetch(weatherApiUrl).then((res) => res.json()).then((data) => {
       // Har kungi ob havo ma'lumoti
        const uniqueForecastDays = []
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        })

        
        //Oldingi ma'lumotini o'chirish
      
        cityInput.value = ""
        weatherCards.innerHTML = ""
        CurrentWeatherCard.innerHTML =" "
        
        
        
        


        //WeatherCard yaratib uni DOM ga qo'shish

        fiveDaysForecast.forEach((weatherItem, index) => {
            
            if (index === 0) {
                CurrentWeatherCard.insertAdjacentHTML("beforeend", createWeatherCard( cityName, weatherItem, index ))
            } else {
                weatherCards.insertAdjacentHTML("beforeend", createWeatherCard( cityName, weatherItem, index ))
            }
        })
    }).catch(() => {
        alert("Ob havo ma'lumoti olish davomida xatolik yuz berdi")
    })
}
const getCityCordinates = () => {
    const cityName = cityInput.value.trim(); // Foydalanuvchi kiritgan shahar nomini olish va qo'shimcha joyni olib tashlash
    if(!cityName) return //agar shahar nomi kiritilmasa takrorlash
    const geoCoding = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}
`
    // Kiritilgan shahar koordinatalaridan (kenglik, uzunlik , va shahar nomi) Api javob bergandan keyin olish
    fetch(geoCoding).then(res => res.json()).then(data => { 
        if (!data.length) return alert(`Siz qidirgan ${cityName}  kordinatasi topilmadi`)
        const { name, lat, lon } = data[0]
        getWeatherDetails(name, lat,lon)
    }).catch(() => {
        alert("Internet ulanmagan")
    })
    
}   



const getLocationCordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords
            const geoCodingURL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
            // Geo Api dan foydalanib turgan joyni aniqlash
            fetch(geoCodingURL).then(res => res.json()).then(data => {
                const { name } = data[0]
                getWeatherDetails(name, latitude, longitude)
            }).catch(() => {
                alert("Joylashuv aniqlash vaqtida xatolik yuz berdi")
            })
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Joylashuv aniqlanmadi.Joylashuvni aniqlashga ruxsat berib takror urinib ko'ring")
                    }
        }
        
    )
}
        searchButton.addEventListener("click", getCityCordinates),
        locationButton.addEventListener("click", getLocationCordinates) 
        cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCordinates())