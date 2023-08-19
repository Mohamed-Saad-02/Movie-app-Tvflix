"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const logo = document.querySelector(".logo");

logo.addEventListener("click", (e) =>
  videoShow == "tv"
    ? (e.currentTarget.href = "tv.html")
    : (e.currentTarget.href = "index.html")
);

// Collecting genre name & url parameter from local storage
const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");

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

let currentPage = 1;
let totalPage = 0;

fetchDataFromServer(
  `https://api.themoviedb.org/3/discover/${videoShow}?api_key=${api_key}&include_adult=false&page=${currentPage}&sort_by=popularity.desc&${urlParam}`,
  function ({ results: movieList, total_pages }) {
    totalPage = total_pages;

    document.title = `${genreName} ${videoShow.toUpperCase()} - Tvflix`;

    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list", "genre-list");
    movieListElem.ariaLabel = `${genreName} Movies`;

    movieListElem.innerHTML = `
    <div class="title-wrapper">
          <h3 class="heading">All ${genreName} Movies</h3>
        </div>

        <div class="grid-list">
          
        </div>

        <button class="btn load-more" load-more>Load More</button>
    `;

    // add movie card based on fetched item

    for (const movie of movieList) {
      const movieCard = createMovieCard(movie);

      movieListElem.querySelector(".grid-list").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem);

    // load more button functionality

    document
      .querySelector("[load-more]")
      .addEventListener("click", function () {
        if (currentPage >= totalPage) {
          this.style.display = "none"; // this == loading btn

          return;
        }

        currentPage++;
        this.classList.add("loading"); // this == loading btn

        fetchDataFromServer(
          `https://api.themoviedb.org/3/discover/${videoShow}?api_key=${api_key}&include_adult=false&page=${currentPage}&sort_by=popularity.desc&${urlParam}`,
          ({ results: movieList }) => {
            this.classList.remove("loading"); // this == loading btn

            for (const movie of movieList) {
              const movieCard = createMovieCard(movie);

              movieListElem.querySelector(".grid-list").appendChild(movieCard);
            }
          }
        );
      });
  }
);

search();
