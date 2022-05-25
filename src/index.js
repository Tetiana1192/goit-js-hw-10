import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import fetchCountries from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchInputBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.searchInputBox.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));



  function onInputCountry(event) {
  const countryName = event.target.value.trim();

  if (countryName === '') {
    countriesListTemplate();
    countryInfoTemplate();
  } else {
    fetchCountries(countryName)
      .then(countrys => {
          if (countrys.length > 10) {
              Notify.info('Too many matches found. Please enter a more specific name');
              countriesListTemplate();
              countryInfoTemplate();
          } else if (countrys.length >= 2 && countrys.length <= 10) {
              countryInfoTemplate();
          refs.countryList.innerHTML = countryListMurkup(countrys);
        } else {
         countriesListTemplate();
          refs.countryInfo.innerHTML = countryInfoMurkup(countrys);
        }
          
      })
      .catch(error => {
        console.log(error);
        Notify.failure('Oops, there is no country with that name');
      });
  }
}  
    
    function countriesListTemplate() {
  refs.countryList.innerHTML = '';
}

function countryInfoTemplate() {
  refs.countryInfo.innerHTML = '';
}



    


function countryListMurkup(countryArray) {
    return countryArray
        .map(({ name, flags }) => {
            return `<li class="country-list__item"><img src="${flags.svg}" alt="${name.common}" width="300" class="country-list_img"><span class="country-list__name">${name.common}</span></li>`;
        })
        .join('');
}

function countryInfoMurkup(countryArray) {
    return countryArray
        .map(({ name, flags, capital, population, languages }) => {
            return `<div class="country-info__name"><img src="${flags.svg}" alt="${name.common
                }" class="country-info__img" />${name.official}</div>
        <p><span class="country-info__bold">Capital: </span>${capital}</p>
        <p><span class="country-info__bold">Population: </span>${population}</p>
        <p><span class="country-info__bold">Languages: </span>${Object.values(languages).join(
                    ', ',
                )}</p>`;
        })
        .join('');
}
