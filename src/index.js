import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
inputEl: document.getElementById('search-box'),
countryList: document.querySelector('.country-list'),
countryInfo: document.querySelector('.country-info'),
}

refs.inputEl.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY))

function searchCountries(event) {
    clearCountryList();
    
    const inputValue = event.target.value.trim();
    
    if (!inputValue) {
        return
    };
    fetchCountries(inputValue)
        .then((datas) => {
            if (!datas) {
                return
            } else if (datas.length > 10) {
                Notify.info("Too many matches found. Please enter a more specific name.",
                    {
                        timeout: 4000,
                        position: 'center-top',
                        width: '400px',
                        fontSize: '20px'
                    },
                );
                return
            } else if (datas.length <= 10 && datas.length >= 2) {
                const list = datas.reduce((markup, data) =>  createMarkupForList(data) + markup, '');
                return updateCountryList(list);
            } else if (datas.length === 1) {
                const card = datas.reduce((markup, data) =>   createMarkupForCard(data) + markup, '');
                return updateCountryCard(card);
            }
        })
        .catch(err => console.log(err))

};

function updateCountryList(markup) {
    refs.countryList.innerHTML = markup;
}

function updateCountryCard(markup) {
    refs.countryInfo.innerHTML = markup;
}


function createMarkupForList({name, flags}) {
    return `
    <li class="country-item">
    <img src=${flags.svg} class="country-img"/>
    <h2 class="country-title">${name.common}</h2>
    </li>
    `
}

function createMarkupForCard({ name, flags, capital, population, languages}) {
    return `
    <div class="country-info-container">
    <img src=${flags.svg} class="country-img"/>
    <h2 class="country-info-title">${name.official}</h2>
    </div>
    <div class="country-info-tamb">
    <p class="country-info-capital">Сapital: <span>${capital}</span></p>
    <p class="country-info-population">Population: <span>${population}</span></p>
    <p class="country-info-languages">Languages: <span>${Object.values(languages).join(', ')}</span></p>
    <div>
    `
}

function clearCountryList() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}
