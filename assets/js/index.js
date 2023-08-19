"use strict";

// Import all components and functions
import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

sidebar();

search();

const tvShow = document.querySelector(".tv-show");

window.localStorage.setItem(
  "video",
  tvShow.textContent === "TV" ? "movie" : "tv"
);

const videoShow = window.localStorage.getItem("video");

const logo = document.querySelector(".logo");

logo.addEventListener("click", (e) =>
  videoShow == "tv"
    ? (e.currentTarget.href = "tv.html")
    : (e.currentTarget.href = "index.html")
);

tvShow.addEventListener("click", function (e) {
  videoShow == "movie"
    ? (tvShow.href = "tv.html")
    : (tvShow.href = "index.html");
});

/* 
  Home page sections (Top rated, Upcoming, Trending movies);

*/

const homePageSection = [
  {
    title: `Upcoming ${videoShow == "movie" ? "Movie" : "Tv"}`,
    path: `/${videoShow == "movie" ? "movie" : "tv"}/upcoming`,
  },
  {
    title: `Weekly Trending ${videoShow == "movie" ? "Movie" : "Tv"}`,
    path: `/trending/${videoShow == "movie" ? "movie" : "tv"}/week`,
  },
  {
    title: `Top Rated ${videoShow == "movie" ? "Movie" : "Tv"}`,
    path: `/${videoShow == "movie" ? "movie" : "tv"}/top_rated`,
  },
];

/*
    - Fetch all genres eg: [ {"id": "123", "name": "Action"} ]
    - then change genre formate eg: {123: "Action"}
  */
const genreList = {
  // Create genre string from genre id eg: [23, 43] ==> "Action, Romance"

  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]); // This == genreList
    }
    return newGenreList.join(", ");
  },
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/${videoShow}/list?api_key=${api_key}`,
  function ({ genres }) {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }

    fetchDataFromServer(
      `https://api.themoviedb.org/3/discover/${videoShow}?api_key=${api_key}`,
      heroPanner
    );
  }
);

const pageContent = document.querySelector("[page-content]");

const heroPanner = function ({ results: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
    <div class="banner-slider"></div>

      <div class="slider-control">
        <div class="control-inner"></div>
      </div>
  `;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      name,
      release_date,
      first_air_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("slider-item", "");

    sliderItem.innerHTML = `
            <img
              src= "${imageBaseURL}w1280${backdrop_path}"
              class="image-cover"
              alt="${tvShow.textContent == "Movie" ? name : title}"
              loading=${index === 0 ? "eager" : "lazy"}
            />

            <div class="banner-content">
              <h2 class="heading">${
                tvShow.textContent == "Movie" ? name : title
              }</h2>

              <div class="meta-list">
                <div class="meta-item">${
                  tvShow.textContent == "Movie"
                    ? first_air_date.split("-")[0]
                    : release_date.split("-")[0]
                }</div>

                <div class="meta-item card-badge">${vote_average.toFixed(
                  1
                )}</div>
              </div>

              <p class="genre">${genreList.asString(genre_ids)}</p>

              <p class="banner-text">${overview}</p>

              <a href="detail.html" class="btn" onclick="getMovieDetail(${id})">
                <i
                  class="fa-regular fa-circle-play"
                  aria-hidden="true"
                  title="play circle"
                ></i>

                <span class="span">Watch Now</span>
              </a>
            </div>
    `;

    banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
    <img
        src="${imageBaseURL}w154${poster_path}"
        alt="Slide to ${title}"
        loading="lazy"
        draggable="false"
        class="image-cover"
        />
    `;

    banner.querySelector(".control-inner").appendChild(controlItem);
  }

  pageContent.appendChild(banner);

  addHeroToSlide();

  // fetch data for home page section (top rated, upcoming, trending)

  for (const { title, path } of homePageSection) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3/${path}?api_key=${api_key}&page=1`,
      createMovieList,
      title
    );
  }
};

// Hero slider functionality
const addHeroToSlide = function () {
  const sliderItems = document.querySelectorAll("[slider-item]");
  const sliderControls = document.querySelectorAll("[slider-control]");

  // let lastSliderItem = sliderItems[0];
  // let lastSliderControls = sliderControls[0];

  let number = 0;

  sliderItems[number].classList.add("active");
  sliderControls[number].classList.add("active");

  const sliderStart = function () {
    // lastSliderItem.classList.remove("active");
    // lastSliderControls.classList.remove("active");

    // // this === slider-control
    // sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
    //   "active"
    // );
    // this.classList.add("active");

    // lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    // lastSliderControls = this;

    sliderItems.forEach((el) => {
      el.classList.remove("active");
    });

    number = Number(this.getAttribute("slider-control"));

    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    );

    sliderControls.forEach((el) => {
      el.classList.remove("active");

      this.classList.add("active");
    });
  };

  const decreaseNumber = function () {
    setInterval(() => {
      sliderItems.forEach((el) => {
        el.classList.remove("active");
      });

      sliderControls.forEach((el) => {
        el.classList.remove("active");
      });

      sliderItems[number].classList.add("active");
      sliderControls[number].classList.add("active");

      if (number == 0) {
        increaseNumber();
        clearInterval(decreaseNumber);
      } else {
        number--;
      }
    }, 6000);
  };

  const increaseNumber = function () {
    setInterval(() => {
      sliderItems.forEach((el) => {
        el.classList.remove("active");
      });

      sliderControls.forEach((el) => {
        el.classList.remove("active");
      });

      sliderItems[number].classList.add("active");
      sliderControls[number].classList.add("active");

      if (number == sliderControls.length - 1) {
        decreaseNumber();
        clearInterval(increaseNumber);
      } else {
        number++;
      }
    }, 6000);
  };

  increaseNumber();

  addEventOnElement(sliderControls, "click", sliderStart);
};

const createMovieList = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = `${title}`;

  movieListElem.innerHTML = `
          <div class="title-wrapper">
          <h3 class="title-large">${title}</h3>
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
