import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.scss';
import 'bootstrap';
const $ = require("jquery");
import { getCity, getTripStart, getTripEnd } from './js/countDown';
import {getGeoCity} from './js/geoNamesApi';
import {getImageURL} from './js/pixabayApi';
import {getWeatherForecast} from './js/weatherApi';
import {getCountryInfo} from './js/restCountriesApi';

import { showModal, displayTrip } from './js/model';

const trip = {};

/* Button handle functions */

const handleSearch = async (e) => {
  e.preventDefault();

  trip.city = getCity();
  trip.start = getTripStart();
  trip.end = getTripEnd();

  const geocity = await getGeoCity(trip.city);

  trip.latitude = geocity.latitude;
  trip.longitude = geocity.longitude;
  trip.countryCode = geocity.countryCode;

  trip.weatherForecast = await getWeatherForecast(geocity.latitude, geocity.longitude, );

  const countryInfo = await getCountryInfo(trip.countryCode);

  trip.country = countryInfo.name;
  trip.countryFlag = countryInfo.flag;

  trip.image = await getImageURL(trip.city, trip.country);

  console.log(trip);

  showModal(trip);
}

const handleSave = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:8080/save',
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trip: trip })
      });
    if (response.ok) {
      const jsonRes = await response.json();
      displayTrip(jsonRes);
      return jsonRes;
    }
  } catch (error) {
    console.log(error);
  }
}

const handleCancel = (e) => {
  e.preventDefault();
  $('#tripModal').modal('toggle');
  document.querySelector('.caption').style.display = 'block';
}

/* Add event listeners */

document.getElementById('button_search').addEventListener('click', handleSearch);

document.querySelector('.trip_save').addEventListener('click', handleSave)

document.querySelectorAll('.trip_cancel').forEach(element => {
  element.addEventListener('click', handleCancel);
});
