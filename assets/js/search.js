"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

const tvShow = document.querySelector(".tv-show");

const videoShow = window.localStorage.getItem("video");

const logo = document.querySelector(".logo");

logo.addEventListener("click", (e) =>
  videoShow == "tv"
    ? (e.currentTarget.href = "tv.html")
    : (e.currentTarget.href = "index.html")
);

export function search() {
  const searchWrapper = document.querySelector("[search-wrapper]");
  const searchField = document.querySelector("[search-filed]");

  const searchResultModal = document.createElement("div");
  searchResultModal.classList.add("search-modal");
  document.querySelector("main").appendChild(searchResultModal);

  let searchTimeout;

  searchField.addEventListener("input", function () {
    if (!searchField.value.trim()) {
      searchResultModal.classList.remove("active");
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeout);
      return;
    }

    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(function () {
      fetchDataFromServer(
        `https://api.themoviedb.org/3/search/${
          tvShow.textContent == "TV" ? "movie" : "tv"
        }?api_key=${api_key}&query=${
          searchField.value
        }&include_adult=false&language=en-US&page=1`,
        function ({ results: movieList }) {
          searchWrapper.classList.remove("searching");
          searchResultModal.classList.add("active");
          searchResultModal.innerHTML = ""; // remove old result

          searchResultModal.innerHTML = `
          <p class="label">Results for</p>

        <h1 class="heading">${searchField.value}</h1>

        <div class="movie-list">
          <div class="grid-list"></div>
        </div>
          `;

          for (const movie of movieList) {
            const movieCard = createMovieCard(movie);

            searchResultModal
              .querySelector(".grid-list")
              .appendChild(movieCard);
          }
        }
      );
    }, 500);
  });
}
