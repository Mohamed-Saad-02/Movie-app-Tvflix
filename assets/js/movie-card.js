"use strict";

import { imageBaseURL } from "./api.js";

const logo = document.querySelector(".logo");

logo.addEventListener("click", (e) =>
  videoShow == "tv"
    ? (e.currentTarget.href = "tv.html")
    : (e.currentTarget.href = "index.html")
);

/*
  - movie card
*/

const tvShow = document.querySelector(".tv-show");

export function createMovieCard(movie) {
  const {
    poster_path,
    title,
    name,
    vote_average,
    release_date,
    first_air_date,
    original_language,
    original_title,
    id,
  } = movie;

  const card = document.createElement("div");
  card.classList.add("movie-card");

  const videoShow = window.localStorage.getItem("video");

  card.innerHTML = `
          <figure class="poster-box card-banner">
            <img
              src="${imageBaseURL}w342${poster_path}"
              alt="${videoShow == "tv" ? name : title}"
              class="image-cover"
              loading="lazy"
            />
          </figure>

          <h4 class="title">${tvShow.textContent == "TV" ? title : name}</h4>

          <div class="meta-list">
            <div class="meta-item">
              <img
                src="assets/images/star.png"
                width="20"
                height="20"
                loading="lazy"
                alt="rating"
              />

              <span class="span">${vote_average.toFixed(1)}</span>
            </div>

            <div class="card-badge">${
              videoShow == "movie"
                ? release_date.split("-")[0]
                : first_air_date.split("-")[0]
            }</div>
          </div>

          <a
            href="detail.html"
            title="${tvShow.textContent == "Movie" ? name : title}"
            class="card-btn"
            onclick="getMovieDetail(${id})"
          ></a>
  `;

  return card;
}
