
//Selección de Elementos del DOM
const result = document.querySelector('.result');
const form = document.querySelector('.get-weather');
const nameCity = document.querySelector('#city');
const nameCountry = document.querySelector('#country');

// Manejo del Envío del Formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (nameCity.value === '' || nameCountry.value === '') {
        showError('Ambos campos son obligatorios...');
        return;
    }

    callAPI(nameCity.value, nameCountry.value);
    //console.log(nameCity.value);
    //console.log(nameCountry.value);
})

//Llamada a la API de OpenWeatherMap
function callAPI(city, country){
    const apiId = '41d1d7f5c2475b3a16167b30bc4f265c';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}`;

    fetch(url) //Realiza una solicitud HTTP a la API
        .then(data => {
            return data.json(); //Si la respuesta es exitosa, convierte la respuesta en formato JSON
        })
        .then(dataJSON => {
            if (dataJSON.cod === '404') { //Si la ciudad no se encuentra muestra un error
                showError('Ciudad no encontrada...');
            } else {
                clearHTML();
                showWeather(dataJSON); //Si la ciudad es válida, limpia cualquier contenido anterior y luego muestra los datos del clima 
            }
            //console.log(dataJSON);
        })
        .catch(error => {
            console.log(error);
        })
}

// Mostrar el Clima
function showWeather(data){
    const {name, main:{temp, temp_min, temp_max}, weather:[arr]} = data;

    const degrees = kelvinToCentigrade(temp);
    const min = kelvinToCentigrade(temp_min);
    const max = kelvinToCentigrade(temp_max);

    const content = document.createElement('div');
    content.innerHTML = `
        <h5>Clima en ${name}</h5>
        <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="icon">
        <h2>${degrees}°C</h2>
        <p>Max: ${max}°C</p>
        <p>Min: ${min}°C</p>
    `;

    result.appendChild(content);

    /* console.log(name);
    console.log(temp);
    console.log(temp_max);
    console.log(temp_min);
    console.log(arr.icon); */
}

// Mostrar Error, como que los campos no estén llenos o que la ciudad no exista
function showError(message){
    //console.log(message);
    const alert = document.createElement('p');
    alert.classList.add('alert-message');
    alert.innerHTML = message;

    form.appendChild(alert);
    setTimeout(() => { //Después de 3 segundos, el mensaje de error desaparece
        alert.remove();
    }, 3000);
}

//Conversión de Temperatura
function kelvinToCentigrade(temp){
    return parseInt(temp - 273.15); //Convierte el resultado en un número entero
}

//Limpiar HTML Anterior
function clearHTML(){
    result.innerHTML = ''; //Antes de mostrar nuevos resultados, se limpia el contenedor de cualquier contenido previo
}