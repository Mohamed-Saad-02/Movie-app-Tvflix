"use strict";

import { api_key, fetchDataFromServer } from "./api.js";

// const videoShow = window.localStorage.getItem("video");

const tvShow = document.querySelector(".tv-show");

const videoShow = window.localStorage.getItem("video");

const logo = document.querySelector(".logo");

logo.addEventListener("click", (e) =>
  videoShow == "tv"
    ? (e.currentTarget.href = "tv.html")
    : (e.currentTarget.href = "index.html")
);

export function sidebar() {
  /*
    - Fetch all genres eg: [ {"id": "123", "name": "Action"} ]
    - then change genre formate eg: {123: "Action"}
  */
  const genreList = {};

  fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/${
      tvShow.textContent == "Movie" ? "tv" : "movie"
    }/list?api_key=${api_key}`,
    function ({ genres }) {
      // console.log(genres);
      for (const { id, name } of genres) {
        genreList[id] = name;
        // console.log(genreList);
        // console.log(Object.entries(genreList));
      }

      genreLink();
    }
  );

  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner");

  sidebarInner.innerHTML = `
    <div class="sidebar-list">
      <p class="title">Genre</p>

      
    </div>

    <div class="sidebar-list">
      <p class="title">Language</p>

      <a href="movie-list.html" menu-close class="sidebar-link" onclick="getMovieList('with_original_language=en', 'English')">English</a>
      <a href="movie-list.html" menu-close class="sidebar-link" onclick="getMovieList('with_original_language=ar', 'Arabic')">Arabic</a>
      <a href="movie-list.html" menu-close class="sidebar-link" onclick="getMovieList('with_original_language=hi', 'Hindi')">Hindi</a>
    </div>

    <div class="sidebar-footer">
      <p class="copyright">
        Copyright 2023
        <a
          href="https://www.facebook.com/profile.php?id=100046155277195"
          target="_blank"
          >Abo-Saad</a
        >

        <img
          src="assets/images/tmdb-logo.svg"
          width="130"
          height="17"
          alt="the movie database logo"
        />
      </p>
    </div>
  `;

  const genreLink = function () {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "./movie-list.html");
      link.setAttribute("menu-close", "");
      link.setAttribute(
        "onclick",
        `getMovieList("with_genres=${genreId}", "${genreName}")`
      );

      link.textContent = genreName;

      sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
    }

    const sidebar = document.querySelector("[sidebar]");
    sidebar.appendChild(sidebarInner);

    toggleSidebar(sidebar);
  };

  const toggleSidebar = function (sidebar) {
    // Toggle sidebar in mobile screen

    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelector("[menu-close]");
    const overlay = document.querySelector("[overlay]");

    addEventOnElement(sidebarTogglers, "click", function () {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    addEventOnElement(sidebarClose, "click", function () {
      sidebar.classList.remove("active");
      sidebarBtn.classList.remove("active");
      overlay.classList.remove("active");
    });
  };
}
