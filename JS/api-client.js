// JAVASCRIPT

// Data from randomPersonData.js

// REGIONS


 function region() {
     const regions = randomPersonData.filter(item => item.region);
     const test = regions.sort((a,b) => a< b ? -1 : 1);
     test.map(makeH1);
    function makeH1 (item) {
    let newLi = document.createElement("li");
    let newH1 = document.createElement("h1");
    let List = document.getElementById("btn-output").getElementsByTagName("ul")[0];
    List.appendChild(newLi);
    newLi.appendChild(newH1);
    newH1.innerHTML = item.region;
     }
};


// Clear List


const parent1 = document.getElementById("btn-output");
const parent2 = document.getElementById("btn");

const removeList = function () {
    while (parent2.firstChild) {
        parent2.removeChild(parent2.firstChild);
    }

};


// Eventlisteners

// Selector
const btn = document.querySelector("#reset");
const btn1 = document.querySelector("#landen");
// Eventlisterner Click
btn.addEventListener("click", removeList);
btn1.addEventListener("click", region);


// ----------------------------------------------------------------

// REGIONS MOST PEOPLE

const getCountriesWithAmountOfPeople = personData => {
    // A large part of this function could be a big reduce call.

    let countries = {};
    // Count amount of people per country
    // Unpack immediately
    personData.forEach(({ region }) => {
        if (region in countries) {
            countries[region]++;
        } else {
            countries[region] = 1;
        }
    });

    // So now we have an object with keys country and values amount of people.
    // Convert into array of objects with country name and amount of people, so we can sort.
    countries = Object.entries(countries);
    countries = countries.map(country => ({
        country: country[0],
        inhabitants: country[1],
    }));

    // Sort by most populous
    countries.sort((country1, country2) =>
        sort_helper(country1.inhabitants < country2.inhabitants)
    );
    return countries;
};

// Unpack immediately
const generateCountryAndInhabitantsHTML = ({ country, inhabitants }) => {
    const li = document.createElement("li");
    li.innerHTML = `${country} - ${inhabitants}`;
    return li;
};

const displayCountriesSortedByPeople = () =>
    getCountriesWithAmountOfPeople(randomPersonData)
        .map(generateCountryAndInhabitantsHTML)
        .forEach(addToResultList);

document
    .querySelector("#landen2")
    .addEventListener("click", displayCountriesSortedByPeople);

    // ----------------------------------------------------------------

    // AVERAGE 

// Using globals here, not that nice.
// We could fix this with a curried function. https://javascript.info/currying-partials

const calculateAverageAgeForCountry = country => {
    const peopleFromCountry = randomPersonData.filter(
        person => person.region === country
    );

    const amountOfPeople = peopleFromCountry.length;

    if (amountOfPeople === 0) {
        // Don't want to divide by 0.
        return 0;
    }

    const totalAge = peopleFromCountry.reduce(
        (sum, current) => sum + current.age,
        0
    );

    return Math.round(totalAge / amountOfPeople);
};

const displayAverageAgeForCountry = () => {
    emptyResultList();

    const country = event.target.value;
    const average_age = calculateAverageAgeForCountry(country);
    const li = document.createElement("li");
    li.innerHTML = `The average age for ${country} is ${average_age}`;
    addToResultList(li);
};

const getCountryButtonHTML = country => {
    const button = document.createElement("input");
    button.type = "button";
    button.value = country;
    button.addEventListener("click", displayAverageAgeForCountry);
    return button;
};

const displayAverageAgeButtons = () =>
    getCountries(randomPersonData)
        .map(getCountryButtonHTML)
        .forEach(addToButtonList);

document
    .querySelector(".average_age")
    // .addEventListener("click", displayAverageAgeButtons);


// ----------------------------------------------------------------

    // CreditCard




const isAdult = person => person.age > 17;

const convertExpirationDate = person => {
    // expiration: ["1", "21"]
    const expiration = person.credit_card.expiration.split("/");
    // parseInt("20" + "21")
    const expirationYear = parseInt("20" + expiration[1]);
    const expirationMonth = parseInt(expiration[0]) - 1; // Jan = 0, Dec = 11
    const expirationDay = 1; // Default
    person.credit_card.expiration_date = new Date(
        expirationYear,
        expirationMonth,
        expirationDay
    );
    return person;
};

// Take out the expiration_date immediately.
const cardExpiresInOneYear = ({ credit_card }) => {
    // Thanks Stack Overflow https://stackoverflow.com/a/29052008
    const oneYearFromNow = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
    );
    const now = new Date();
    return (
        credit_card.expiration_date > now &&
        credit_card.expiration_date < oneYearFromNow
    );
};

const sortByExpirationDate = (person1, person2) => {
    return sort_helper(
        person1.credit_card.expiration_date > person2.credit_card.expiration_date
    );
};

const getCreditCardsThatWillExpire = () => {
    const adults = randomPersonData.filter(isAdult);
    const adultsWithNiceExpirationDatesOnCCs = adults.map(convertExpirationDate);
    const adultsWithExpiredCards = adultsWithNiceExpirationDatesOnCCs.filter(
        cardExpiresInOneYear
    );
    // // Earlier dates at the top.
    const sortedAdultsWithExpiredCards = adultsWithExpiredCards.sort(
        sortByExpirationDate
    );
    return sortedAdultsWithExpiredCards;
};

const generateCCHTML = card => {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.innerHTML = `${card.name} ${card.surname}`;

    const phone = document.createElement("span");
    phone.innerHTML = `Phone: ${card.phone}`;

    const card_details = document.createElement("span");
    card_details.innerHTML = `Card: ${card.credit_card.number}`;

    const expires = document.createElement("span");
    expires.innerHTML = `Expires: ${card.credit_card.expiration}`;

    li.appendChild(name);
    li.appendChild(phone);
    li.appendChild(card_details);
    li.appendChild(expires);

    return li;
};

const displayOldCreditcardList = () =>
    getCreditCardsThatWillExpire().map(generateCCHTML).forEach(addToResultList);

document
    .querySelector("#Creditcard")
    .addEventListener("click", displayOldCreditcardList);