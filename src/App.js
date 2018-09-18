import React, { Component } from "react"
import LocationList from "./LocationList"
import './App.css'

// Load Google Maps
const loadGoogleMaps = (src) => {
  const ref = window.document.getElementsByTagName("script")[0]

  const script = window.document.createElement("script")

  script.src = src

  script.async = true

  script.onerror = () => {
    document.write("Error: Google Maps cannot be loaded")
  }

  ref.parentNode.insertBefore(script, ref)
}


window.gm_authFailure = function () {
  alert("Error: Google Maps cannot be loaded");
}

class App extends Component {

  componentDidMount() {
    window.initMap = this.initMap

    loadGoogleMaps("https://maps.googleapis.com/maps/api/js?key=AIzaSyBtMi0aIbjCpQvwsr4b9hCvsoFy3HTG7WE&callback=initMap")
  }

  constructor(props) {

    super(props)

    this.state = {
      infoWindow: "",
      locations: require("./LocationData.json"),
      map: "",
      prevMarker: ""
    }

    // Retain object instance in function
    this.initMap = this.initMap.bind(this)

    this.openInfoWindow = this.openInfoWindow.bind(this)

    this.closeInfoWindow = this.closeInfoWindow.bind(this)
  }

  // Initialize Google Map script
  initMap() {
    let self = this;

    let mapView = document.getElementById("map")

    mapView.style.height = window.innerHeight + "px"

    let map = new window.google.maps.Map(mapView,
      {
        center: { lat: 47.508278, lng: 19.104139 },
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoom: 14
      }
    )

    let InfoWindow = new window.google.maps.InfoWindow({})

    window.google.maps.event.addListener(InfoWindow, "closeclick", function() {
      self.closeInfoWindow()
    })

    this.setState(
      {
        map: map,
        infoWindow: InfoWindow
      }
    );

    window.google.maps.event.addDomListener(window, "resize", function() {
      let center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, "click", function() {
      self.closeInfoWindow();
    });

    let locations = [];

    this.state.locations.forEach(function(location) {
      let longname = location.name + " (" + location.type + ")"

      let marker = new window.google.maps.Marker(
        {
          position: new window.google.maps.LatLng(location.latitude, location.longitude),
          animation: window.google.maps.Animation.DROP,
          map: map
        }
      )

      marker.addListener("click", function() {
        self.openInfoWindow(marker)
      })

      location.longname = longname
      location.marker = marker
      location.display = true
      locations.push(location)
    })

    this.setState(
      {
        locations: locations
      }
    )
  }

  // Invokes opening of the window when marker is clicked
  openInfoWindow(marker) {
    this.closeInfoWindow()

    this.state.infoWindow.open(this.state.map, marker)

    marker.setAnimation(window.google.maps.Animation.BOUNCE)

    this.setState({ prevMarker: marker })

    this.state.infoWindow.setContent("Loading Data...")

    this.state.map.setCenter(marker.getPosition())

    this.state.map.panBy(0, -200)

    this.getMarkerInfo(marker)
  }

  // Retrieve location data from FourSquare
  getMarkerInfo(marker) {
    let self = this

    // Set FourSquare API client ID and Secret Key variables
    let clientId = "4PVHT3ENAFNNL4R2QTJHJMMRVZ4VATZRM22A0E5FHLZXVBWP"

    let clientSecret = "LNQ1AYVOXUEUOQPNFEBBPRB1EVCL3IQX5KQI15MUQI0XVZ1P"

    // Set API end point url variable
    let url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1"

    fetch(url)
      .then( (response) => {
        if (response.status !== 200) {
          self.state.infoWindow.setContent("Error: data cannot be loaded")
          return;
        }

        response.json().then( (data) => {
          console.log(data)

          let location_data = data.response.venues[0]

          let place = `<h3 class="location-title">${location_data.name}</h3>`

          let address = `<p class="address-info">${location_data.location.formattedAddress[0]}</p>` +
                        `<p class="address-info">${location_data.location.formattedAddress[1]}</p>` +
                        `<p class="address-info">${location_data.location.formattedAddress[2]}</p>` +
                        `<p class="address-info">${location_data.location.formattedAddress[3]}</p>`
          let details = '<a class="details-link" href="https://foursquare.com/v/' + location_data.id + '" target="_blank">Click here to learn more about the location</a>'

          self.state.infoWindow.setContent(place + address + details);
        })
      })

      .catch( (response) => {
        self.state.infoWindow.setContent("Error: data cannot be loaded")
        console.log(response)
      })
  }

  // Invokes closing of previously opened info window
  closeInfoWindow() {
    if (this.state.prevMarker) {
      this.state.prevMarker.setAnimation(null)
    }

    this.setState({ prevMarker: "" })

    this.state.infoWindow.close()
  }

  

  render() {
    return (
      <div>
        <LocationList
          closeInfoWindow={this.closeInfoWindow}
          key="100"
          locations={this.state.locations}
          openInfoWindow={this.openInfoWindow}/>
        <div id="map" />
      </div>
    );
  }
}

export default App