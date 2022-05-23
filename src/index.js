
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
    event.preventDefault();
    
    const onInputCountry = event.target.value.trim();

    if (onInputCountry.length === 1) {
        return Notify.info('Too many matches found. Please enter a more specific name.');
    }

    if (onInputCountry.length > 10) {
        return Notify.failure('Oops, there is no country with that name.');
    }

    fetchCountries(event.target.value)
        .then(value => {
            console.log(value);
            if (!value) {
                return Notify.info('Please enter any character');
            }
            parseValue(value);
        })
        .catch(error => {
            alert(error);
        });
}
function parseValue(result) {
    refs.countryInfo.innerHTML = ' ';
    refs.countryList.innerHTML = ' ';

    if (result.length === 1) {
        refs.countryInfo.innerHTML = countryInfoTemplate(result);
    } else {
        refs.countryList.innerHTML = countriesListTemplate(result);
    }
}

function countriesListTemplate(countryArray) {
    return countryArray
        .map(({ name, flags }) => {
            return `<li class="country-list__item"><img src="${flags.svg}" alt="${name.common}" width="300" class="country-list_img"><span class="country-list__name">${name.common}</span></li>`;
        })
        .join('');
}

function countryInfoTemplate(countryArray) {
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