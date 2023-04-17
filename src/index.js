import './css/styles.css';
import Notiflix from 'notiflix';
import { debounce } from 'lodash';
import { fetchCountries } from './fetchCountries';

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');
info.style.display = 'none';
list.style.display = 'none';

const DEBOUNCE_DELAY = 300;
// Clean the output

const clearOutput = element => {
  element.innerHTML = '';
};

// Rendering of DOM el
const renderCountriesList = countries => {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.',
      { position: 'center-top' }
    );
    return;
  } else if (countries.length >= 2 && countries.length <= 10) {
    list.style.display = 'block';
    info.style.display = 'none';
    clearOutput(info);
    const listMarkup = countries
      .map(country => {
        return `<li class="list-style">
        <img class="list-svg" src="${country.flags.svg}" alt="flag"/>
        <span>${country.name.official}</span>
        </li>`;
      })
      .join('');
    list.innerHTML = listMarkup;
  } else {
    info.style.display = 'block';
    list.style.display = 'none';
    clearOutput('list');
    const infoMarkup = countries
      .map(country => {
        return `<img class="info-svg" src="${
          country.flags.svg
        }" alt="flag" /><span>${country.name.official}</span>
        <p><b>Capital:</b> ${country.capital}</p>
        <p><b>Population:</b> ${country.population}</p>
        <p><b>Languages:</b> ${Object.values(country.languages)}</p>`;
      })
      .join('');
    info.innerHTML = infoMarkup;
  }
};
//Input handler Function
const inputHandler = e => {
  let inputValue = e.target.value.trim();

  if (!inputValue) {
    info.style.display = 'none';
    list.style.display = 'none';
    clearOutput(list);
    clearOutput(info);
    return;
  } else {
    fetchCountries(inputValue)
      .then(countries => renderCountriesList(countries))
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name', {
          position: 'center-top',
        });
        clearOutput(list);
        clearOutput(info);
        info.style.display = 'none';
        list.style.display = 'none';
      });
  }
};

input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
