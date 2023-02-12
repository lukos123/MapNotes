"use strict";

class Mapa {
  _map;
  _markers = [];
  _currentX = 0;
  _currentY = 0;
  _idMap;
  _currentMarker;
  _modalOn = false;
  _modalOff = false;
  _nowModalWindow = 0;

  constructor(id) {
    this._modalWindowCreate = new ModalWindow(`#modal-window-create-marker`);
    this._modalWindowRemove = new ModalWindow(`#modal-window-remove-marker`);
    // this._markersInfo = [];
    this._idMap = id;
    window.addEventListener("beforeunload", this._closeApp.bind(this));
    this._mapCreate();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._mapPosition.bind(this),
        alert.bind(this, "error getting location")
      );
    }
    setTimeout(this._createNewMarkerFirst.bind(this), 500);

    setInterval(
      function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            this._position.bind(this),
            console.log.bind(this, "error getting location")
          );
        }
      }.bind(this),
      5000
    );

    this._modalWindowMarkerCreate__input =
      document.getElementById("name-marker");
    this._modalWindowMarkerRemove__input =
      document.getElementById("delete-marker");
    this._modalWindowMarkerRemove__input.addEventListener(
      "click",
      this._removeMarker.bind(this)
    );

    this._modalWindowMarkerCreate__input.addEventListener(
      "keydown",
      this._markerEnterCreate.bind(this)
    );

    this._modalWindowMarkerCreate__input.addEventListener(
      "blur",
      this._markerBlurCreate.bind(this)
    );
  }
  _position(position) {
    const { latitude, longitude } = position.coords;
    // console.log("f");
    if (this.marker) {
      this.marker.remove();
    }
    this.marker = L.marker([latitude, longitude], {
      icon: L.divIcon({
        className: "my-marker-icon",
        html: '<div class="marker-you"><svg height="32px" width="32px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#0055ff;} </style> <g> <path class="st0" d="M255.995,198.276c-31.884,0-57.724,25.84-57.724,57.724c0,31.875,25.841,57.716,57.724,57.716 c31.874,0,57.716-25.841,57.716-57.716C313.711,224.116,287.87,198.276,255.995,198.276z"></path> <path class="st0" d="M511.13,254.868L410.124,228.04c-5.79-32.047-21.284-60.778-43.346-82.823 c-22.044-22.062-50.784-37.564-82.83-43.346L257.128,0.875c-0.136-0.508-0.598-0.87-1.133-0.87s-0.996,0.362-1.133,0.87 l-26.819,100.997c-32.056,5.781-60.796,21.284-82.831,43.346c-22.071,22.035-37.566,50.785-43.346,82.832L0.869,254.868 C0.363,255.003,0,255.465,0,256c0,0.535,0.363,0.997,0.869,1.133l100.998,26.819c5.78,32.047,21.274,60.787,43.346,82.832 c22.035,22.062,50.775,37.555,82.822,43.346l26.828,100.997c0.136,0.507,0.598,0.869,1.133,0.869s0.996-0.362,1.133-0.869 l26.828-100.997c32.038-5.79,60.777-21.284,82.821-43.346c22.062-22.044,37.556-50.785,43.346-82.822l101.006-26.828 c0.508-0.136,0.87-0.598,0.87-1.133C512,255.465,511.637,255.003,511.13,254.868z M337.621,337.626 c-20.956,20.921-49.687,33.796-81.626,33.814c-31.948-0.018-60.669-12.893-81.626-33.814 c-20.929-20.957-33.804-49.688-33.814-81.626c0.01-31.947,12.884-60.669,33.814-81.626c20.957-20.921,49.679-33.805,81.626-33.814 c31.938,0.008,60.67,12.893,81.626,33.814c20.921,20.957,33.796,49.679,33.814,81.626 C371.417,287.938,358.542,316.669,337.621,337.626z"></path> </g> </g></svg></div>',
      }),
    });
    // this.marker = L.marker([latitude, longitude], {
    //   icon: L.icon({
    //     iconUrl: "img/favicon.png",
    //     iconSize: [38, 38],
    //     iconAnchor: [0, 0],
    //     // popupAnchor: [-3, -76],
    //   }),
    // });
    this.marker.addTo(this._map);
    // this._map.setView([latitude, longitude], 14);
  }
  _markerEnterCreate(event) {
    if (event.key === "Enter") {
      if (this._modalWindowMarkerCreate__input.value !== "") {
        this._createNewMarker(this._modalWindowMarkerCreate__input.value);
        this._modalWindowCreate.toggleOff();
        this._modalWindowMarkerCreate__input.value = "";
      }
    }
  }
  _markerBlurCreate() {
    if (this._modalWindowMarkerCreate__input.value !== "") {
      this._createNewMarker(this._modalWindowMarkerCreate__input.value);
      this._modalWindowCreate.toggleOff();
      this._modalWindowMarkerCreate__input.value = "";
    }
  }
  _mapPosition(position) {
    const { latitude, longitude } = position.coords;
    this._map.setView([latitude, longitude], 14);
    // let marker = L.marker([latitude, longitude]).addTo(this._map);
    this._position(position);
  }
  _mapCreate() {
    this._map = L.map(this._idMap);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(
      this._map
    );

    this._map.on("click", this._mapOnClick.bind(this));
  }
  _mapOnClick(e) {
    this._currentX = e.latlng.lat;
    this._currentY = e.latlng.lng;
    // this._nowModalWindow = 0;
    // console.log("s");
    this._modalWindowCreate.toggleOn();
    this._modalWindowMarkerCreate__input.focus();
  }
  _closeApp() {
    const _markersInfo = [];
    this._markers.forEach(function (i) {
      _markersInfo.push([i.getLatLng(), i._popup._content]);
    });
    localStorage.setItem("markers", JSON.stringify(_markersInfo));
  }
  _createNewMarkerFirst() {
    const markersInfo = JSON.parse(localStorage.getItem("markers"));

    if (markersInfo) {
      // this._markersInfo = markersInfo;
      markersInfo.forEach(
        function (i) {
          let m = L.marker([i[0].lat, i[0].lng]);
          const popup = L.popup({
            maxWidth: 100,
            // maxHeight: 100,
            autoClose: false,
            closeOnClick: false,
          });
          m.addTo(this._map).bindPopup(popup).setPopupContent(i[1]).openPopup();
          // console.log(m.getLatLng(), name);
          // const markersInfo = [];
          this._markers.push(m);
          // this._markersInfo.push([m.getLatLng(), name]);

          // this._markers.forEach(function (i) {
          //   markersInfo.push([i.getLatLng(), name]);
          // });
          // localStorage.setItem("markers", JSON.stringify(markersInfo));

          // console.log(this._markers);

          this._map.on("popupclose", this._popupClose.bind(this, m, popup));
        }.bind(this)
      );
    }
  }
  _createNewMarker(name) {
    // console.log(name);
    let m = L.marker([this._currentX, this._currentY]);
    const popup = L.popup({
      maxWidth: 100,
      // maxHeight: 100,
      autoClose: false,
      closeOnClick: false,
    });
    m.addTo(this._map).bindPopup(popup).setPopupContent(name).openPopup();
    // console.log(m.getLatLng(), name);
    // const markersInfo = [];
    this._markers.push(m);
    // this._markers.forEach(function (i) {
    // this._markersInfo.push([m.getLatLng(), name]);
    // });

    // console.log(this._markers);

    this._map.on("popupclose", this._popupClose.bind(this, m, popup));
  }
  _popupClose(m, popup, e) {
    if (e.popup === popup) {
      // this._nowModalWindow = 1;
      this._modalWindowRemove.toggleOn();
      this._currentMarker = m;
      setTimeout(function () {
        m.openPopup();
      }, 10);
    }
  }
  _removeMarker() {
    if (this._markers) {
      if (this._markers.indexOf(this._currentMarker) > -1)
        this._markers.splice(this._markers.indexOf(this._currentMarker), 1);
      // console.log(this._markers);
    }
    this._currentMarker.remove();
    this._currentMarker = undefined;
    this._modalWindowRemove.toggleOff();
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const mainMap = new Mapa("map");
});
