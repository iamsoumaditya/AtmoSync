const cityInput = document.querySelector('.city-input')
const searchBtn =document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryTxt =document.querySelector('.country-txt')
const tempTxt =document.querySelector('.temp-txt')
const conditionTxt =document.querySelector('.condition-txt')
const humidityValueTxt =document.querySelector('.humidity-value-txt')
const windValueTxt =document.querySelector('.wind-value-txt')
const weatherSummaryimg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')


const updateForecastsItemsContainer =document.querySelector('.forecast-items-container')

// MAINTAINENCE

// Show the modal when the page loads
window.onload = function() {
    document.getElementById('maintenance-modal').style.display = 'flex';
 };
 
 document.getElementById('close-button').onclick = function() {
    document.getElementById('maintenance-modal').style.display = 'none';
 };
 // END MAINTAINENCE


const apikey ='OPEN_WEATHER_API_KEY'

searchBtn.addEventListener('click',()=> {
    if(cityInput.value.trim() != ''){
        updateweatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur
    }
    
})
cityInput.addEventListener('keydown', (event)=>{
    if(event.key == 'Enter' &&
        cityInput.value.trim() != ''
    ){
        updateweatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur
    }
})
async function getFetchData(endpoint, city){
    const apiurl= `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`

    const response = await fetch(apiurl)
    return response.json()
}

function getWeatherIcon(id){
    if(id<=232)return 'thunderstorm.svg'
    if(id<=321)return 'drizzle.svg'
    if(id<=531)return 'rain.svg'
    if(id<=622)return 'snow.svg'
    if(id<=781)return 'atmosphere.svg'
    if(id<=800)return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',  // 'short' for abbreviated weekday (e.g., 'Mon')
        day: '2-digit',    // '2-digit' for day (e.g., '10')
        month: 'short'     // 'short' for abbreviated month (e.g., 'Jan')
    };
    return currentDate.toLocaleDateString('en-GB', options);  // Using 'en-GB' as locale
}


async function updateweatherInfo(city){
    const weatherData = await getFetchData('weather',city)
    if(weatherData.cod !=200){
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)

   const{
    name:country,
    main:{temp,humidity},
    weather: [{id, main}],
    wind: {speed}
   }=weatherData

   countryTxt.textContent = country
   tempTxt.textContent = Math.round(temp) +' °C'
   conditionTxt.textContent = main
   humidityValueTxt.textContent = humidity + ' %'
   windValueTxt.textContent = speed + ' M/s'

   currentDateTxt.textContent = getCurrentDate()

   weatherSummaryimg.src = `assets/weather/${getWeatherIcon(id)}`

await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(city){
    const forecastsdata = await getFetchData('forecast',city)

    const timeTaken = '12:00:00'
    const todayDate =new Date().toISOString().split('T')[0]
updateForecastsItemsContainer.innerHTML = ''
    forecastsdata.list.forEach(forecastweather =>{
        if(forecastweather.dt_txt.includes(timeTaken)&& ! forecastweather.dt_txt.includes(todayDate))
        updateForecastsItems(forecastweather)
    })
}

function updateForecastsItems(weatherData){
    const{
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    }=weatherData


    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    dateTaken.setHours(0, 0, 0, 0);

    if (dateTaken.getTime() === todayDate.getTime()) {
        return; // Skip today's date
    }

    const dateResult = dateTaken.toLocaleDateString('en-US',dateOption)
    



    const updateForecastsItems= `
    <div class="forecast-item">
        <h5 class="forecast-item-date regulat-txt">${dateResult}</h5>
        <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
        <h5 class="forecast-item-temp"> ${Math.round(temp)}°C</h5>
    </div>
    `
updateForecastsItemsContainer.insertAdjacentHTML('beforeend', updateForecastsItems)
}

function showDisplaySection(Scetion){
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(Section => Section.style.display = 'none')
    Scetion.style.display = 'flex'
}
