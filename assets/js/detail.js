"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const logo = document.querySelector(".logo");

logo.addEventListener("click", (e) =>
  videoShow == "tv"
    ? (e.currentTarget.href = "tv.html")
    : (e.currentTarget.href = "index.html")
);

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

const tvShow = document.querySelector(".tv-show");
const videoShow = window.localStorage.getItem("video");

if (window.localStorage.getItem("video") === "movie") {
  tvShow.textContent = "TV";
}

tvShow.addEventListener("click", function (e) {
  videoShow == "movie"
    ? (tvShow.href = "tv.html")
    : (tvShow.href = "index.html");
});

sidebar();

const getDirector = function (nameDirector) {
  const newDirector = [];

  for (const { name } of nameDirector) newDirector.push(name);

  return newDirector.join(" & ");
};

const getGenres = function (genreList) {
  const newGenreList = [];

  for (const { name } of genreList) newGenreList.push(name);

  return newGenreList.join(", ");
};

const getCasts = function (castList) {
  const newCastsList = [];
  for (let i = 0; i < castList.length && i < 10; i++) {
    const { name } = castList[i];

    newCastsList.push(name);
  }

  return newCastsList.join(", ");
};

const getDirectors = function (crewList) {
  const directors = crewList.filter(({ job }) => job === "Director");

  const directorList = [];

  for (const { name } of directors) directorList.push(name);

  return directorList.join(", ");
};

// return only trailers and teasers and array
const filterVideos = function (videoList) {
  return videoList.filter(
    ({ type, site }) =>
      (type === "Trailer" || type === "Teaser") && site === "YouTube"
  );
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/${videoShow}/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
  function (movie) {
    const {
      backdrop_path,
      poster_path,
      title,
      name,
      first_air_date,
      release_date,
      runtime,
      vote_average,
      number_of_seasons,
      original_language,
      original_name,
      genres,
      overview,
      videos: { results: videos },
    } = movie;

    if (videoShow == "movie") {
      var {
        casts: { cast, crew },
        releases: {
          countries: [{ certification }],
        },
      } = movie;
    }

    let check = function () {
      if (videoShow == "tv") {
        if (original_language == "ar") {
          return original_name;
        } else {
          return name;
        }
      } else {
        return title;
      }
    };

    document.title = `${title} - TVflix`;

    console.log(movie);

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

    movieDetail.innerHTML = `
            <div
          class="backdrop-image"
          style="background-image: url('${imageBaseURL}
          ${"w1280" || "original"}${backdrop_path || poster_path}')"
        ></div>

        <figure class="poster-box movie-poster">
          <img
            src="${imageBaseURL}w342${poster_path}"
            alt="${tvShow.textContent == "Movie" ? name : title} poster"
            class="image-cover"
          />
        </figure>

        <div class="detail-box">
          <div class="detail-content">
            <h1 class="heading">${check()}</h1>

            <div class="meta-list">
              <div class="meta-item">
                <img
                  src="assets/images/star.png"
                  width="20"
                  height="20"
                  alt="rating"
                />

                <span class="span">${vote_average.toFixed(1)}</span>
              </div>

              <div class="separator"></div>

              <div class="meta-item">${
                videoShow == "movie"
                  ? runtime + "m"
                  : number_of_seasons + " Seasons"
              }</div>

              <div class="separator"></div>

              <div class="meta-item">${
                tvShow.textContent == "Movie"
                  ? first_air_date.split("-")[0]
                  : release_date.split("-")[0]
              }</div>

              <div class="meta-item card-badge">${
                videoShow == "movie" ? certification : ""
              }</div>
            </div>

            <p class="genre">${getGenres(genres)}</p>

            <p class="overview">${overview}</p>

            <ul class="detail-list">
              <div class="list-item">
                <p class="list-name">${
                  videoShow == "movie" ? "Starring: " : ""
                }</p>

                <p>${videoShow == "movie" ? "" + getCasts(cast) : ""}</p>
              </div>

              <div class="list-item">
                <p class="list-name">Directed By: </p>

                <p>${
                  videoShow == "tv"
                    ? getDirector(movie.created_by)
                    : getDirectors(crew)
                }</p>
              </div>
            </ul>
          </div>

          <div class="title-wrapper">
            <h3 class="title-large">Trailers and Clips</h3>
          </div>

          <div class="slider-list">
            <div class="slider-inner"></div>
          </div>

        </div>
    `;

    for (const { key, name } of filterVideos(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");

      // console.log(key);

      videoCard.innerHTML = `
      <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0"
        frameborder="0" allowfullscreen="1" title=${name} class="image-cover" loading="lazy"></iframe>
      `;

      movieDetail.querySelector(".slider-inner").appendChild(videoCard);
    }

    pageContent.appendChild(movieDetail);

    fetchDataFromServer(
      `https://api.themoviedb.org/3/${videoShow}/${movieId}/recommendations?api_key=${api_key}&page=1`,
      addSuggestedMovies
    );
  }
);

const addSuggestedMovies = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = "You May Also Like";

  movieListElem.innerHTML = `
          <div class="title-wrapper">
          <h3 class="title-large">You May Also Like</h3>
        </div>

        <div class="slider-list">
          <div class="slider-inner">
          </div>
        </div>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie); // called from movie_card.js

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }
  pageContent.appendChild(movieListElem);
};

search();
