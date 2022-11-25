/*Получение фильмов*/
const API_KEY = 'a4dd694c-6cc8-41e4-8288-0b6e33706efd';
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const API_MOVIE_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

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
    movieEl.addEventListener("click", () => openModal(movie.filmId))
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

//Модальное окно
const modalEl = document.querySelector('.modal');

async function openModal(id) {
  const resp = await fetch(API_MOVIE_DETAILS + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY
    }
  });
  const respData = await resp.json();

  modalEl.classList.add('modal--show');
  document.body.classList.add('stop-scrolling');

  modalEl.innerHTML = `
    <div class="modal__card">
      <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
      <h2>
        <span class="modal__movie-title">${respData.nameRu}</span>
        <span class="modal__movie-release-year">${respData.year} г.</span>
      </h2>
      <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-genre">Жанр - ${respData.genres.map((genre) => ` ${genre.genre}`)}</li>
        ${respData.filmLength ?
        `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ""}
        <li>Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
        <li class="modal__movie-overview">Описание - ${respData.description}</li>
      </ul>
      <button type="button" class="modal__button-close">Закрыть</button>
    </div>
  `
  const btnClose = document.querySelector('.modal__button-close');
  btnClose.addEventListener('click', () => closeModal());
}

function closeModal() {
  modalEl.classList.remove('modal--show');
  document.body.classList.remove('stop-scrolling');
}

//при клике вне окна
window.addEventListener('click', (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
})

//обработчик на кнопку, при нажатии на кнопку esc, окно закрывается
window.addEventListener('keydown', (e) => {
  console.log(e.keyCode);
  if (e.keyCode === 27) {
    closeModal();
  }
})
