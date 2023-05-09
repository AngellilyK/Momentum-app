import playList from './playList.js';

const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const body = document.body;
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const city = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error');
const weatherContainer = document.querySelector('.weather-container');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const btnChangeQuote = document.querySelector('.change-quote');
let userName = document.querySelector('.name');
const options = {weekday: 'long', month: 'long', day: 'numeric' };

const form = document.getElementsByTagName('form');
const checkForm = document.querySelectorAll('.form-check-input');
const inputsHidden = document.querySelectorAll('.input-hidden-block');
const inputChangeBg = document.querySelectorAll('.input-change-bg');
const inputTheme = document.querySelectorAll('.input-theme');


let isPlay = false;
let playNum = 0;
const playBtn = document.querySelector('.play');
const playNext = document.querySelector('.play-next');
const playPrev = document.querySelector('.play-prev');
const playListContainer = document.querySelector('.play-list');
const timeline = document.querySelector('.timeline');
const currentTimeSong = document.querySelector('.current');
const currentSongTitle = document.querySelector('.song-title')
const progressBar = document.querySelector(".progress");
const lengthSong = document.querySelector(".length");
const volumeSlider = document.querySelector(".volume-slider");
const volumeEl = document.querySelector(".volume");
const audio = new Audio();

let currentDate,
currentTime,
hours,
timeOfDay,
randomNum,
img,
randomQuote,
duration,
currentSong,
timeToSeek,
checkedBg;

let language ='en';
let currentBg = 'github';
let timeForApi = getTimeOfDay();

function showTime() {
    currentTime = new Date().toLocaleTimeString();
    if(language=='en'){
        currentDate = new Date().toLocaleDateString('en-EN',options);
    }else{
        currentDate = new Date().toLocaleDateString('ru-RU',options);
    }
    time.textContent=currentTime;
    date.textContent=currentDate;
    timeOfDay=getTimeOfDay();
    if(language=='ru'){
        switch(timeOfDay){
            case 'morning':
                greeting.textContent=`Доброе утро`;
                break;
            case 'afternoon':
                greeting.textContent=`Добрый день`;
                break;
            case 'evening':
                greeting.textContent=`Добрый вечер`;
                break;

            case 'night':
                greeting.textContent=`Доброй ночи`;
                break;
        }
        userName.placeholder="[Введите имя]"
    } else{
        greeting.textContent=`Good ${timeOfDay}`;
        userName.placeholder="[Enter name]"
    }
    setTimeout(showTime,1000);
}
showTime();

function getTimeOfDay(){
    hours = new Date().getHours();
    if(hours>=6 && hours<12){ return "morning"}
    if(hours>=12 && hours<18){ return "afternoon"}
    if(hours>=18 && hours<24){ return "evening"}
    if(hours>=0 && hours<6){ return "night"}
}

function setLocalStorage() {
    localStorage.setItem('name', userName.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem('language', language);
    localStorage.setItem('bg', currentBg);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if(localStorage.getItem('name')) {
        userName.value = localStorage.getItem('name');
    }

    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
    }

    if(localStorage.getItem('language')) {
        document.getElementById(localStorage.getItem('language')).checked='true'
        language = localStorage.getItem('language');
        getWeather();
        getQuotes();
        changeBlockLanguage();
        changeThemeLanguage()
    }

    if(localStorage.getItem('bg')) {
        document.getElementById(localStorage.getItem('bg')).checked='true';
        switch (localStorage.getItem('bg')){
            case 'github':
                setBg();
                checkedBg = setBg;
                break;
            case 'unsplash':
                getLinkToImage();
                checkedBg=getLinkToImage;
                break;
            case 'flickr':
                getLinkToImageFlickr();
                checkedBg=getLinkToImageFlickr;
                break;
        }
        currentBg = localStorage.getItem('bg');
    }

        inputsHidden.forEach(el=>{
        if(localStorage.getItem(el.id)) {
            el.checked='true'
            document.querySelector(`.${el.value}`).classList.add('hidden');
        }else{
            document.querySelector(`.${el.value}`).classList.remove('hidden');
        }
    })
}
window.addEventListener('load', getLocalStorage);

function getRandomNum(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    if(!randomNum){randomNum = Math.floor(Math.random() * (max - min + 1)) + min;}
    if(max===7 && min===0){randomQuote=Math.floor(Math.random() * (max - min + 1)) + min;}
    return true;
}
getRandomNum(1, 20);

function setBg(){
    img = new Image();
    let timeOfDay=getTimeOfDay();
    let bgNum=String(randomNum).padStart(2,"0");
    img.src = `https://github.com/AngellilyK/stage1-tasks/blob/assets/images/${timeOfDay}/${bgNum}.jpg?raw=true`;
    img.onload = () => {      
        body.style.backgroundImage = `url(${img.src})`;
    };
}
setBg();

async function getLinkToImage() {
    img = new Image();
    const url = `https://api.unsplash.com/photos/random?query=${timeForApi}&client_id=9BmKN_2F1x0FoyOMji5EhmC0zWFDRmnSDMD1Ee-yVfQ`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data)
    img.src = data.urls.regular;
    img.onload = () => {      
        body.style.backgroundImage = `url(${img.src})`;
    };
}


async function getLinkToImageFlickr() {
    img = new Image();
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=775ed70f9906475c57ac8072891d67ad&tags=${timeForApi}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    let bgNum=String(randomNum);
    img.src = data.photos.photo[bgNum].url_l;
    img.onload = () => {      
        body.style.backgroundImage = `url(${img.src})`;
    };
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

function getSlideNext(){
    ++randomNum;
    if(randomNum>20){randomNum=1};
    checkedBg();
}

function getSlidePrev(){
    --randomNum;
    if(randomNum<1){randomNum=20};
    checkedBg();
}

async function getWeather() {  
    try{
        if(city.value=='Minsk' && language=='ru'){
            city.value='Минск';
        } else if(city.value=='Минск' && language=='en'){
            city.value='Minsk';
        }
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${language}&appid=b714d72b6eca11595ba114cbefa13361&units=metric`;
        const res = await fetch(url);
        const data = await res.json(); 

        weatherIcon.className = 'weather-icon owf';
        weatherError.classList.add("hidden");
        weatherContainer.classList.remove("hidden");
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        if(language=='ru'){
            wind.textContent = `Скорость ветра: ${Math.round(data.wind.speed)} м/с`;
            humidity.textContent = `ОВЗ: ${Math.round(data.main.humidity)}%`;
        }else{
            wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
            humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;
        }
    } catch(error){
        weatherError.classList.remove("hidden");
        weatherError.textContent="Error! City not found";
        weatherContainer.classList.add("hidden");
    }
}

city.addEventListener('change',getWeather);
document.addEventListener('DOMContentLoaded', getWeather);

async function getQuotes() {  
    const url = 'data.json';
    const res = await fetch(url);
    const data = await res.json(); 

    function showQuotes(){
        getRandomNum(0,7);
        if(language=='ru'){
            quote.textContent=data[0][randomQuote].text;
            author.textContent=data[0][randomQuote].author;
        }else{
            quote.textContent=data[1][randomQuote].text;
            author.textContent=data[1][randomQuote].author;
        }
    }
    showQuotes();

    btnChangeQuote.onclick = () => {      
        showQuotes();
    }
}
getQuotes();

playBtn.addEventListener('click', playAudio);
playPrev.addEventListener('click', playPrevSong);
playNext.addEventListener('click', playNextSong);

function playAudio(){
    audio.src = playList[playNum].src;
    currentSong = document.getElementById(`song-${playNum}`);
    currentSong.classList.add('play-item-active');
    currentSongTitle.textContent = playList[playNum].title;
    if(!isPlay){
        audio.play();
        playBtn.classList.add('pause');
        document.getElementById(playNum).classList.add('pause-each');
        isPlay=true;
    } else{
        audio.pause();
        playBtn.classList.remove('pause');
        document.getElementById(playNum).classList.remove('pause-each');
        isPlay = false;
    }
}

function playNextSong(){
    currentSong.classList.remove('play-item-active');
    document.getElementById(playNum).classList.remove('pause-each');
    ++playNum;
    if(playNum>3){playNum=0};
    isPlay=false;
    playAudio();
}

function playPrevSong(){
    currentSong.classList.remove('play-item-active');
    document.getElementById(playNum).classList.remove('pause-each');
    --playNum;
    if(playNum<0){playNum=3};
    isPlay=false;
    playAudio();
}

for(let i = 0; i < playList.length; i++) {
    const li=document.createElement('li');
    li.classList.add('play-item');
    li.id=`song-${i}`;
    li.textContent=playList[i].title;
    playListContainer.append(li);
    const button=document.createElement('button');
    button.classList.add('play-each');
    button.id=i;
    li.prepend(button);
}

audio.addEventListener("loadeddata", () => {
    duration = audio.duration;
});

function currentSongTime() {
    if(audio.currentTime==duration){
        playNextSong();
    }
    setTimeout(currentSongTime,1000);
}
currentSongTime();

timeline.addEventListener('click', e=>{
    const timelineWidth = window.getComputedStyle(timeline).width;
    timeToSeek = e.offsetX / parseInt(timelineWidth) * duration;
    audio.currentTime= timeToSeek;
})

setInterval(() => {
    progressBar.style.width = audio.currentTime / duration * 100 + "%";
    currentTimeSong.textContent = getTimeCodeFromNum(audio.currentTime);
    if(duration){lengthSong.textContent = getTimeCodeFromNum(duration);}
}, 500);

function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;
  
    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
}


volumeSlider.addEventListener('click', e => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    document.querySelector(".volume-percentage").style.width = newVolume * 100 + '%';
}, false);


document.querySelector(".volume-button").addEventListener("click", () => {
    audio.muted = !audio.muted;
    if (audio.muted) {
      volumeEl.classList.add("volume-mute");
    } else {
      volumeEl.classList.remove("volume-mute");
    }
});

let eachPlay = document.querySelectorAll('.play-each');
eachPlay.forEach(el=>{
    el.addEventListener("click",()=>{
        playNum = el.id;
        if(isPlay){
            eachPlay.forEach(x=>{
                if (x !== el){
                    x.classList.remove('pause-each');
                    currentSong.classList.remove('play-item-active');
                }

            })
        el.classList.add('pause-each');

        } else{
            el.classList.remove('pause-each');
        }
        playAudio();

    })
})

function changeBlockLanguage(){
    inputsHidden.forEach(x=>{
        if(language=='ru'){
            switch (x.value){
                case 'time':
                    x.nextElementSibling.innerHTML=`Время`;
                    break;
                case 'date':
                    x.nextElementSibling.innerHTML=`Дата`;
                    break;
                case 'greeting-container':
                    x.nextElementSibling.innerHTML=`Приветствие`;
                    break;
                case 'quotes':
                    x.nextElementSibling.innerHTML=`Цитаты`;
                    break;
                case 'weather':
                    x.nextElementSibling.innerHTML=`Погода`;
                    break;
                case 'player':
                    x.nextElementSibling.innerHTML=`Плеер`;
                    break;
            }
        }else{
            switch (x.value){
                case 'time':
                    x.nextElementSibling.innerHTML=`Time`;
                    break;
                case 'date':
                    x.nextElementSibling.innerHTML=`Date`;
                    break;
                case 'greeting-container':
                    x.nextElementSibling.innerHTML=`Greeting`;
                    break;
                case 'quotes':
                    x.nextElementSibling.innerHTML=`Quote`;
                    break;
                case 'weather':
                    x.nextElementSibling.innerHTML=`Weather`;
                    break;
                case 'player':
                    x.nextElementSibling.innerHTML=`Player`;
                    break;
            }
        }
    })
}


checkForm.forEach(el=>{
    el.addEventListener('click',()=>{
        if(el.checked){language=el.value};
        getWeather();
        getQuotes();
        changeBlockLanguage();
        changeThemeLanguage()
    })
})

inputsHidden.forEach(el=>{
    el.addEventListener('click',()=>{
        if (el.checked){
            document.querySelector(`.${el.value}`).classList.add('hidden');
            function setLocalStorage() {
                localStorage.setItem(el.id, 'true');
            }
            window.addEventListener('beforeunload', setLocalStorage);
        } else{
            document.querySelector(`.${el.value}`).classList.remove('hidden');
            if(localStorage.getItem(el.id)) {
                localStorage.removeItem(el.id);
            }

        }
    })
})

inputChangeBg.forEach(el=>{
    el.addEventListener('click',()=>{
        if(el.checked){
            currentBg = el.id;
            switch (el.id){
                case 'github':
                    setBg();
                    checkedBg = setBg;
                    break;
                case 'unsplash':
                    getLinkToImage();
                    checkedBg=getLinkToImage;
                    break;
                case 'flickr':
                    getLinkToImageFlickr();
                    checkedBg=getLinkToImageFlickr;
                    break;
            }
        };
    })
})

inputTheme.forEach(el=>{
    el.addEventListener('click',()=>{
        if(el.checked){timeForApi=el.value};
        switch (currentBg){
            case 'github':
                setBg();
                checkedBg = setBg;
                break;
            case 'unsplash':
                getLinkToImage();
                checkedBg=getLinkToImage;
                break;
            case 'flickr':
                getLinkToImageFlickr();
                checkedBg=getLinkToImageFlickr;
                break;
        }
    })
});

function changeThemeLanguage(){
    inputTheme.forEach(x=>{
        if(language=='ru'){
            switch (x.value){
                case 'morning':
                    x.nextElementSibling.innerHTML=`Утро`;
                    break;
                case 'afternoon':
                    x.nextElementSibling.innerHTML=`День`;
                    break;
                case 'evening':
                    x.nextElementSibling.innerHTML=`Вечер`;
                    break;
                case 'night':
                    x.nextElementSibling.innerHTML=`Ночь`;
                    break;
            }
        }else{
            switch (x.value){
                case 'morning':
                    x.nextElementSibling.innerHTML=`Morning`;
                    break;
                case 'afternoon':
                    x.nextElementSibling.innerHTML=`Afternoon`;
                    break;
                case 'evening':
                    x.nextElementSibling.innerHTML=`Evening`;
                    break;
                case 'night':
                    x.nextElementSibling.innerHTML=`Night`;
                    break;
            }
        }
    })
}
