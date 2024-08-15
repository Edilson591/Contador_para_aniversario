const date = document.getElementById("eventTime");
const button = document.querySelector("button");
const hiddenButton = document.getElementById('clearButton');
const hiddenButtonVerificador = document.getElementById('dateVerificar');
const infoDay = document.getElementById("infoDay")
const detailsYear = document.getElementById("detailsYear")
const keyHideen = 'button--is-active';
const birtdayActiveTop = 'hero__logo__birthday--is-active';
const birtdayActiveBottun = 'hero__inputs__birthday--is-active';
const birthdayTop = document.querySelector("#birthdayTop");
const birthdaybutton = document.querySelector("#birthdayButton");

let intervalId;

loadEvents();

function handleDate(e) {
    e.preventDefault();

    if (intervalId) {
        clearInterval(intervalId);
    }

    if (date.value) {
        const [year, month, day] = date.value.split('-');
        const today = new Date();
        const currentYear = today.getFullYear(); 
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        if (year < 1900 || year > currentYear) {
            alert('Ano não válido');
            date.value = '';
            return;
        }

        if (currentYear === +year) {
            if (month > currentMonth || (+month === currentMonth && day > currentDay)) {
                alert('Mês ou Dia não válido');
                date.value = '';
                return;
            }
        }

        if (date.value === '') {
            alert('Insira uma data válida');
            return;
        }

        addEvent(date.value);
        startCountDate(date.value); 
        resetInterval();
    }
}

function addEvent(dateValue) {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    if (!storedEvents.includes(dateValue)) {
        storedEvents.push(dateValue);
        localStorage.setItem("events", JSON.stringify(storedEvents));
    }
}

function loadEvents() {
    const events = JSON.parse(localStorage.getItem("events")) || [];

    if (events.length > 0) {
        date.value = events.slice(-1); 
        startCountDate(events.slice(-1)); 
        hiddenButton.classList.remove(keyHideen);
        hiddenButtonVerificador.disabled = true;
    }
}

function gDate(dateValue) {
    const date = new Date(dateValue);
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), date.getMonth(), date.getDate() + 1);

    if (nextBirthday < today && today.toDateString() !== nextBirthday.toDateString()) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }


    const getSecundsBirthday = nextBirthday.getTime();
    const getSecundsToday = today.getTime();
    const getBirthday = getSecundsBirthday - getSecundsToday;

    const diasEmMs = 1000 * 60 * 60 * 24;
    const horasEmMs = 1000 * 60 * 60;
    const minutosEmMs = 1000 * 60;
    const segundoEmMs = 1000;

    const daysBirthday = Math.floor(getBirthday / diasEmMs);
    const horasBirthday = Math.floor((getBirthday % diasEmMs) / horasEmMs);
    const minutesBirthday = Math.floor((getBirthday % horasEmMs) / minutosEmMs);
    const segundosBirthday = Math.floor((getBirthday % minutosEmMs) / segundoEmMs);

    return [daysBirthday, horasBirthday, minutesBirthday, segundosBirthday];
}

function resetInterval() {
    if (hiddenButton.classList.contains(keyHideen)) {
        hiddenButton.classList.remove(keyHideen);
        hiddenButtonVerificador.disabled = true;
    } else {
        hiddenButton.classList.add(keyHideen);
        hiddenButtonVerificador.disabled = false;
    }
}

function countDate(dateValue) {
    const [days, hours, minutes, seconds] = gDate(dateValue);
    const getResultsTime = document.getElementById("results");
    const today = new Date();
    const dat = new Date(dateValue);
    const nextBirthday = new Date(today.getFullYear(), dat.getMonth(), dat.getDate() + 1);

    let age = today.getFullYear() - dat.getFullYear();


    
    if (nextBirthday < today && today.toDateString() !== nextBirthday.toDateString()) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
        detailsYear.innerHTML = `${age} anos e já completou`
    }else {
        age-=1
        detailsYear.innerHTML = `${age} anos e irá completar`
    }
    


    if ((days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) || today.toDateString() === nextBirthday.toDateString()) {
        clearInterval(intervalId);
        birthdayTop.classList.add(birtdayActiveTop);
        birthdaybutton.classList.add(birtdayActiveBottun);
        hiddenButton.classList.add(keyHideen);
    } else {
        getResultsTime.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        infoDay.innerHTML =  days >  1 ?  `${days} dias` : `${days} dia`;  
        birthdayTop.classList.remove(birtdayActiveTop);
        birthdaybutton.classList.remove(birtdayActiveBottun);
    }
}

function startCountDate(dateValue) {
    intervalId = setInterval(() => countDate(dateValue), 1000); 
    countDate(dateValue);
}

function deleteDate() {
    if (intervalId) {
        clearInterval(intervalId);
    }

    localStorage.removeItem("events");

    document.getElementById("eventTime").value = '';
    document.getElementById("results").innerHTML = '';
    hiddenButton.classList.add(keyHideen);
    hiddenButtonVerificador.classList.remove(keyHideen);
    hiddenButtonVerificador.disabled = false;
    infoDay.innerHTML =  0; 
    birthdayTop.classList.remove(birtdayActiveTop);
    birthdaybutton.classList.remove(birtdayActiveBottun);
}

function changeInput() {
    clearInterval(intervalId);

    
    localStorage.removeItem("events");

    document.getElementById("results").innerHTML = '';
    hiddenButton.classList.add(keyHideen);
    hiddenButtonVerificador.disabled = false;
    birthdayTop.classList.remove(birtdayActiveTop);
    birthdaybutton.classList.remove(birtdayActiveBottun);
}

button.addEventListener("click", handleDate);
date.addEventListener("input", changeInput);
hiddenButton.addEventListener("click", deleteDate);
