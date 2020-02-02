import storage from "./LocalStorage";

class Film {
  constructor() {
    this.url = "http://my-json-server.typicode.com/moviedb-tech/movies/list/";
    this.filmList = document.querySelector(".movie-list");
    this.modal = document.querySelector(".modal");
    this.selectFilter = document.querySelector(".filter-genre");
    this.filter = "";
    this.list = "";
  }

  getFilmList() {
    fetch(`${this.url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        storage.save(response, "FilmList");
        this.setGenres(response);
        this.getGenres();
        this.renderFilmItems(response, "card");
        this.list = response;
      })
      .catch(error => {
        console.error(error);
        return undefined;
      });
  }

  getFilm(id) {
    fetch(`${this.url}${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        this.createFilmModal(response);
      })
      .catch(error => {
        console.error(error);
        return undefined;
      });
  }

  createFilmItem(
    { id, name, img, description, year, genres, director, starring },
    type
  ) {
    let genList = "";
    let film = "";
    if (type === "card") {
      film = `<div class="movie-item" data-id='${id}'>
                <img src=${img} alt=""/>
                <p class="movie-name">${name}</p>
                <p class="movie-year">${year}</p>
            </div>`;
    } else {
      if (genres) {
        genres.forEach(function(item) {
          genList += `<div class="genre-item">${item}</div>`;
        });
      }
      film = `<div class="movie-item" data-id='${id}'>
            <div class="movie-block-left">
            <img src=${img} alt=""/>
            </div>
            <div class="movie-block-right">
                <div class="movie-info">
                    <div class="movie-name">${name}</div>
                    <div class="movie-year">${year}</div>
                </div>
            <p class="movie-desc">${description}</p>
            <div class="generes-list">
               ${genList}
            </div>
            </div>
        </div>`;
    }
    this.filmList.innerHTML += film;
  }

  renderFilmItems(newList = "", type = "card") {
    const FilmItems = newList || this.list;
    this.filmList.innerHTML = "";
    FilmItems.forEach(element => this.createFilmItem(element, type));
  }

  setGenres(filmList) {
    let genres = [];
    filmList.forEach(item => {
      item.genres.forEach(item1 => {
        if (!genres.includes(item1.toLowerCase())) {
          genres.push(item1.toLowerCase());
        }
      });
    });
    genres = genres.sort((a, b) => {
      if (a > b) return 1;
      if (a === b) return 0;
      return -1;
    });
    storage.save(genres, "Genres");
  }

  getGenres() {
    let genresList = "";
    const arrGenre = storage.get("Genres");
    arrGenre.forEach(item => {
      genresList += `<option value='${item}'>${item}</option>`;
    });
    this.selectFilter.innerHTML += genresList;
  }

  filterFilmList(val, type = "") {
    const value = val || this.filter;
    let newList = [];
    if (value) {
      newList = this.list.filter(item => {
        const temp = item.genres.filter(item1 => item1.toLowerCase() === value);
        if (temp.length) return item;
      });
      this.filter = value;
      if (type) {
        this.renderFilmItems(newList, type);
      } else this.renderFilmItems(newList);
    } else {
      this.renderFilmItems("", type);
    }
  }

  createFilmModal({
    id,
    name,
    img,
    description,
    year,
    genres,
    director,
    starring
  }) {
    let genList = "";
    if (genres) {
      genres.forEach(function(item) {
        genList += `<div class="genre-item">${item}</div>`;
      });
    }
    const film = `
    <div class="modal-content">
        <div class="modal-left">
            <img src=${img} alt="">
            <div class="star-year">
                <p>starr</p>
                <p class="modal-movie-name">${year}</p>
            </div>
            <div class="generes-list">
                ${genList}
            </div>
        </div>
        <div class="modal-right">
            <div class="modal-main-info">
                <h1>${name}</h1>
                <p>${description}</p>
            </div>
            <div class="modal-movie-cast">
                <p class="modal-movie-director">Director: ${director}</p>
                <p class="modal-movie-starring">Starring: ${starring.join(
                  ","
                )}</p>
            </div>
        </div>
        <span class="close-button">
            X
        </span>
    </div>`;
    this.modal.classList.add("active");
    this.modal.innerHTML += film;
  }
}

export default Film;
