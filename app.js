/*Получение фильмов*/
const API_KEY = 'a4dd694c-6cc8-41e4-8288-0b6e33706efd';
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';

getMovies(API_URL_POPULAR);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY
    }
  });
  const respData = await resp.json();
  showMovies(respData);
}

/*Цвет кружка в зависимости от рейтинга фильма*/
function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

/*Функция, которая отрисовывает карточки*/
function showMovies(data) {
  const moviesEl = document.querySelector('.movies');

  //Очищение предыдущих фильмов
  document.querySelector(".movies").innerHTML = "";

  data.films.forEach(movie => {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `
    <div class="movie__cover-inner">
      <img src="${movie.posterUrlPreview}" alt="${movie.nameRu}" class="movie__cover">
      <div class="movie__cover--darkened"></div>
    </div>
    <div class="movie__info">
      <div class="movie__title">${movie.nameRu}</div>
      <div class="movie__category">${movie.genres.map((genre) => ` ${genre.genre}`)}</div>
      ${movie.rating && movie.rating != 'null' &&
        `
        <div class="movie__average movie__average--${getClassByRate(movie.rating)}">${movie.rating}</div>
        `
      }
    </div>`;
    moviesEl.appendChild(movieEl);
  });
}

/*Работа с поиском*/
const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);

    search.value = "";
  }
})