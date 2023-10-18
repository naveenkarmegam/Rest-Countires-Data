// in this page script file have button common element creating function
const create_element_groups = (tag_name, attributes = {}, content='') => {
    const _element = document.createElement(tag_name);
    _element.innerHTML = content;
    Object.entries(attributes).forEach(([attrName, attrValue]) => {
        _element.setAttribute(attrName,attrValue)
    })
    return _element;
}







const countires_list = fetch('https://restcountries.com/v3.1/all')
countires_list.then((response)=>response.json())
.then((data)=> display_countries(data))


const weather_api_key = '170247ca112d65f3dc37cbe88e997f1d'; // Replace with your OpenWeatherMap API key
const weather_api_url = 'https://api.openweathermap.org/data/2.5/weather';

const content = create_element_groups('div',{'class':'row','id':'row-container'})
function display_countries(data) {
    data.forEach((country) => {
        const countryCard = create_element_groups('div', {'class': 'col-sm-6 col-md-4 col-lg-4 col-xl-4','id':'col-container'}, getCountry(country));
        content.append(countryCard);
    });
}

const getCountry=country=>{
    // console.log(country);
    return`
    
    <div class="card h-100" >
        <div class="card-header">
            <h5 class="card-title  py-2">${country.name.common}</h5>
        </div>
        <div class="body-con px-3">
            <div class="img-con mb-4">
            <img src="${country.flags.png}" class="card-img-top" alt="country-flag-image">
            </div>
            <div class="card-body">
                <div class="card-text">
                    <span class="card-text">Capital: ${country.capital}</span><br>
                    <span class="card-text">Region: ${country.region}</span><br>
                    <span class="card-text">Country-Code: ${country.altSpellings[0]}</span><br>
                    <div class="m-4" id="button">
                        <button type="submit" class="btn btn-primary fetch-weather" data-country="${country.name.common}">Click for Weather</button>
                        <div class="span-3" id="${country.name.common}-weather"> </div>
                    </div>
                </div>
            </div>

        </div>
  </div>
    `
}
// Add an event listener for the "Fetch Weather" buttons
document.addEventListener('click',  (name)=> {
    if (name.target && name.target.classList.contains('fetch-weather')) {
        const countryName = name.target.getAttribute('data-country');
        fetchWeatherData(countryName);
    }
});

function fetchWeatherData(countryName) {
    const weatherApiUrl = `${weather_api_url}?q=${countryName}&appid=${weather_api_key}&units=metric`;

    fetch(weatherApiUrl)
        .then((response) => response.json())
        .then((data) => {
            // Process and display weather data
            weather_content(countryName, data);
    
        })
        .catch((error) => {
            weather_content(countryName, { error: "Temperature not updated" });
        });
}
function weather_content(countryName, weatherData) {
    const weatherDiv = document.getElementById(`${countryName}-weather`);

    if (weatherDiv) {
        if (weatherData && weatherData.main) {
            // Update the content of the weather div with the weather data
            weatherDiv.innerHTML = `
                Temperature: ${weatherData.main.temp}°C<br>
                Description: ${weatherData.weather[0].description}
            `;
        } else if (weatherData.error) {
            // Display the error message
            weatherDiv.textContent = weatherData.error;
        } else {
            // Handle other error cases
            weatherDiv.textContent = "An error occurred while fetching weather data.";
        }
    }
}




const heading = create_element_groups('h1',{'id':'title','class':'text-center'},'Rest Countires Data')
const row_div = create_element_groups('div',{'class':'heading'})
row_div.append(heading);
const boot_container = create_element_groups('div', { 'class': 'container'});
boot_container.append(row_div,content)

const main_container = create_element_groups('div',{'id':'main-container'})
main_container.append(boot_container);
document.body.append(main_container);


