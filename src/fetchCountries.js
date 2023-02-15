import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function fetchCountries(query) {
    const URL = `https://restcountries.com/v3.1/name/${query}?fields=name,capital,population,flags,languages`;

    return fetch(URL)
        .then((response) => {
        if (!response.ok) {
            throw new Error(
                Notify.failure('Oops, there is no country with that name',{
                        timeout: 2000,
                        position: 'center-top',
                        width: '400px',
                        fontSize: '20px'
                })
            )
        }
            return response.json();
    });  
};