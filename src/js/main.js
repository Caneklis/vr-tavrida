import Swiper from "swiper/bundle";

// // Import jQuery module (npm i jquery)
import $ from "jquery";
import { forEach } from "lodash";
window.jQuery = $;
window.$ = $;

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM полностью загружен и разобран");
  require("./../../node_modules/leaflet/dist/leaflet");
  require("./../../node_modules/magnific-popup/dist/jquery.magnific-popup");
  require("./modules/popup");
  require("./modules/video");

  const body = document.querySelector(".page__body");

  // const introBtn = document.querySelector(".intro__button ");
  // const intro = document.querySelector(".intro");

  // if (introBtn) {
  //   intro.classList.add("intro--fixed");
  //   introBtn.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     intro.classList.add("intro--close");
  //     setTimeout(() => {
  //       intro.style.display = "none";
  //     }, 300);
  //   });
  // }

  const menuButton = document.querySelector(".main-nav__button");
  const menuList = document.querySelector(".main-nav__list");
  const logo = document.querySelector(".logo");
  const fixedBtns = document.querySelector(".fixed-buttons");

  menuButton.addEventListener("click", () => {
    let expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", !expanded);
    menuButton.classList.toggle("main-nav__button--open");
    menuList.classList.toggle("main-nav__list--open");
    logo.classList.toggle("logo--open");
    body.classList.toggle("page__body--overflow-hidden");
    fixedBtns.classList.toggle("fixed-buttons--hidden");

    menuList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", !expanded);
        menuButton.classList.remove("main-nav__button--open");
        menuList.classList.remove("main-nav__list--open");
        logo.classList.remove("logo--open");
        body.classList.remove("page__body--overflow-hidden");
      });
    });
  });

  (function () {
    const smoothScroll = function (targetEl, duration) {
      // const headerElHeight = document.querySelector(".header").clientHeight;
      let target = document.querySelector(targetEl);
      let targetPosition = target.getBoundingClientRect().top;
      let startPosition = window.pageYOffset;
      let startTime = null;

      const ease = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      const animation = function (currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, targetPosition, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };
      requestAnimationFrame(animation);
    };

    const scrollTo = function () {
      const links = document.querySelectorAll(".js-scroll");
      links.forEach((each) => {
        each.addEventListener("click", function () {
          const currentTarget = this.getAttribute("href");
          smoothScroll(currentTarget, 300);
        });
      });
    };
    scrollTo();
  })();

  const swiper = new Swiper(".swiper-container", {
    // Optional parameters
    loop: true,
    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  const swiperInPopup = new Swiper(".team__popup-slider .swiper-container", {
    // Optional parameters
    loop: true,
    pagination: {
      el: ".team__popup-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + "</span>";
      },
    },
  });

  $(".image-popup-vertical-fit").magnificPopup({
    type: "image",
    closeOnContentClick: true,
    mainClass: "mfp-img-mobile",
    image: {
      verticalFit: true,
    },
  });

  $(".popup-youtube").magnificPopup({
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false,
  });

  // create the map

  const mapURL = "/images/map.svg";

  const mapImage = new Image();
  mapImage.onload = function () {
    const mapHeight = this.height,
      mapWidth = this.width;

    const imageUrl = mapURL,
      imageBounds = [
        [0, 0],
        [mapHeight, mapWidth],
      ];

    const testing = L.imageOverlay(imageUrl, imageBounds);
    const bounds = new L.LatLngBounds(
      new L.LatLng(0, 0),
      new L.LatLng(mapHeight, mapWidth)
    );

    let map = L.map("map", {
      crs: L.CRS.Simple,
      center: [mapHeight / 2, mapWidth / 2],
      zoom: -1,
      maxZoom: 3,
      layers: [testing],
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      tap: false,
    });

    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(map);

    const rightBottomBlock = document.querySelector(".leaflet-control-zoom");
    const rightTopBlock = document.querySelector(".leaflet-top.leaflet-right");
    const rightTopBlockContent = document.querySelector(
      ".map__controls--top-right"
    );

    const rightBottomBlockText = "Масштаб";

    rightBottomBlock.insertAdjacentHTML(
      "afterbegin",
      `<p class="map__control-text">${rightBottomBlockText}</p`
    );

    rightTopBlock.appendChild(rightTopBlockContent);

    // var baseMaps = {
    //   Testing: testing,
    //   Something: something,
    // };
    // var overlayMaps = {
    //   "Overlay Test": testing,
    //   "One more test": something,
    // };
    // L.control.layers(baseMaps, overlayMaps).addTo(map);

    var myIconStart = L.icon({
      iconUrl: "/images/resources/start.svg",
      iconSize: [38, 70],
      iconAnchor: [19, 70],
      popupAnchor: [0, -64],
    });

    var myIconFinish = L.icon({
      iconUrl: "/images/resources/finish.svg",
      iconSize: [38, 70],
      iconAnchor: [19, 70],
      popupAnchor: [0, -64],
    });

    var myIconYou = L.icon({
      iconUrl: "/images/resources/whereiam.svg",
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -19],
    });

    var myIconPoint = L.icon({
      iconUrl: "/images/resources/point.svg",
      iconSize: [38, 70],
      iconAnchor: [19, 70],
      popupAnchor: [0, -64],
    });

    var myIconBuilding = L.icon({
      iconUrl: "/images/resources/underconstruction.svg",
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -19],
    });

    for (let key in points) {
      let marker = null;
      switch (true) {
        case points[key].type === "start":
          marker = L.marker([points[key].y, points[key].x], {
            icon: myIconStart,
          }).addTo(map);
          break;
        case points[key].type === "finish":
          marker = L.marker([points[key].y, points[key].x], {
            icon: myIconFinish,
          }).addTo(map);
          break;
        case points[key].type === "you":
          marker = L.marker([points[key].y, points[key].x], {
            icon: myIconYou,
          }).addTo(map);
          break;
        case points[key].type === "building":
          marker = L.marker([points[key].y, points[key].x], {
            icon: L.icon({
              iconUrl: `${points[key].image}`,
              iconSize: [38, 38],
              iconAnchor: [19, 19],
              popupAnchor: [0, -19],
            }),
          }).addTo(map);
          break;
        default:
          marker = L.marker([points[key].y, points[key].x], {
            icon: L.icon({
              iconUrl: `/images/buildings/${points[key].id}.svg`,
              iconSize: [38, 38],
              iconAnchor: [19, 19],
              popupAnchor: [0, -19],
            }),
          }).addTo(map);
          break;
      }
      marker.bindPopup(points[key].label);
      if (points[key].type === "you") {
        marker.openPopup();
        map.setView([points[key].y, points[key].x], 1);
      }
    }
  };

  mapImage.src = mapURL;

  const blindVersionBtn = document.querySelectorAll(".blind-version-btn");

  blindVersionBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      body.classList.toggle("blind-version");

      const blindVersionBtnList = document.querySelectorAll(
        ".blind-version-btn"
      );

      blindVersionBtnList.forEach((element) => {
        element.classList.toggle("active");

        if (element.classList.contains("active")) {
          element.innerHTML = "Обычная версия";
        } else {
          element.innerHTML = "Версия для слабовидящих";
        }
      });
    });
  });

  let song = document.getElementById("song");
  let play = document.getElementById("play");

  function togglePlay() {
    return song.paused ? song.play() : song.pause();
  }

  play.onclick = function (e) {
    e.preventDefault();
    togglePlay();
  };
});
